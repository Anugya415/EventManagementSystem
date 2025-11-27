#!/bin/bash

# Docker Automation Management Script
# This script helps manage the GitHub Actions Docker automation

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}$1${NC}"
}

# Check if we're in the right directory
check_directory() {
    if [ ! -f ".github/workflows/docker-build-push.yml" ]; then
        print_error "GitHub Actions workflow not found. Please run from project root."
        exit 1
    fi
}

# Show workflow status
show_status() {
    print_header "🔍 Docker Automation Status"
    echo ""
    
    if [ -f ".github/workflows/docker-build-push.yml" ]; then
        print_status "✅ GitHub Actions workflow: Present"
    else
        print_error "❌ GitHub Actions workflow: Missing"
    fi
    
    if command -v gh &> /dev/null; then
        print_status "Checking GitHub repository status..."
        gh workflow list | grep -q "Build and Push Docker Images" && \
            print_status "✅ Workflow registered in GitHub" || \
            print_warning "⚠️  Workflow not yet registered (push to trigger)"
    else
        print_warning "GitHub CLI not installed - cannot check remote status"
    fi
    
    echo ""
    print_header "📋 Required Secrets:"
    echo "- DOCKERHUB_USERNAME"
    echo "- DOCKERHUB_TOKEN"
    echo ""
    print_header "🔗 Setup Guide: DOCKER_AUTOMATION_SETUP.md"
}

# Validate workflow file
validate_workflow() {
    print_header "🔍 Validating Workflow File"
    
    if command -v yamllint &> /dev/null; then
        yamllint .github/workflows/docker-build-push.yml && \
            print_status "✅ Workflow YAML is valid" || \
            print_error "❌ Workflow YAML has syntax errors"
    else
        print_warning "yamllint not installed - skipping YAML validation"
    fi
    
    # Check for required components
    if grep -q "DOCKERHUB_USERNAME" .github/workflows/docker-build-push.yml; then
        print_status "✅ Docker Hub authentication configured"
    else
        print_error "❌ Docker Hub authentication missing"
    fi
    
    if grep -q "docker/build-push-action" .github/workflows/docker-build-push.yml; then
        print_status "✅ Docker build action configured"
    else
        print_error "❌ Docker build action missing"
    fi
}

# Test local Docker builds
test_local_builds() {
    print_header "🧪 Testing Local Docker Builds"
    
    # Test frontend build
    if [ -f "event/Dockerfile" ]; then
        print_status "Testing frontend Docker build..."
        docker build -t test-frontend ./event --quiet && \
            print_status "✅ Frontend build successful" || \
            print_error "❌ Frontend build failed"
        docker rmi test-frontend &>/dev/null || true
    else
        print_error "❌ Frontend Dockerfile not found"
    fi
    
    # Test backend build  
    if [ -f "backend/Dockerfile" ]; then
        print_status "Testing backend Docker build..."
        docker build -t test-backend ./backend --quiet && \
            print_status "✅ Backend build successful" || \
            print_error "❌ Backend build failed"
        docker rmi test-backend &>/dev/null || true
    else
        print_error "❌ Backend Dockerfile not found"
    fi
}

# Show recent workflow runs
show_runs() {
    print_header "📊 Recent Workflow Runs"
    
    if command -v gh &> /dev/null; then
        gh run list --workflow="Build and Push Docker Images" --limit=5 || \
            print_warning "No workflow runs found or GitHub CLI not authenticated"
    else
        print_warning "GitHub CLI not installed - cannot show workflow runs"
        echo "Install with: brew install gh"
    fi
}

# Trigger manual workflow
trigger_workflow() {
    print_header "🚀 Triggering Manual Workflow"
    
    if command -v gh &> /dev/null; then
        print_status "Triggering workflow with push_to_registry=true..."
        gh workflow run "Build and Push Docker Images" --field push_to_registry=true && \
            print_status "✅ Workflow triggered successfully" || \
            print_error "❌ Failed to trigger workflow"
    else
        print_error "GitHub CLI required to trigger workflows"
        echo "Install with: brew install gh"
        echo "Then authenticate with: gh auth login"
    fi
}

# Show Docker Hub images
show_images() {
    print_header "🐳 Docker Hub Images"
    
    read -p "Enter your Docker Hub username: " DOCKER_USERNAME
    
    if [ -n "$DOCKER_USERNAME" ]; then
        echo ""
        print_status "Frontend images:"
        echo "https://hub.docker.com/r/$DOCKER_USERNAME/event-management-frontend/tags"
        
        print_status "Backend images:"  
        echo "https://hub.docker.com/r/$DOCKER_USERNAME/event-management-backend/tags"
        
        echo ""
        print_status "Pull commands:"
        echo "docker pull $DOCKER_USERNAME/event-management-frontend:latest"
        echo "docker pull $DOCKER_USERNAME/event-management-backend:latest"
    fi
}

# Update Kubernetes manifests to use Docker Hub
update_k8s_manifests() {
    print_header "🔄 Updating Kubernetes Manifests for Docker Hub"
    
    read -p "Enter your Docker Hub username: " DOCKER_USERNAME
    
    if [ -n "$DOCKER_USERNAME" ]; then
        # Backup original files
        cp k8s/deployment-frontend.yaml k8s/deployment-frontend.yaml.backup
        cp k8s/simple-backend-deployment.yaml k8s/simple-backend-deployment.yaml.backup
        
        # Update frontend manifest
        sed -i.tmp "s/imagePullPolicy: Never/imagePullPolicy: Always/" k8s/deployment-frontend.yaml
        sed -i.tmp "s|event-management-frontend:latest|$DOCKER_USERNAME/event-management-frontend:latest|" k8s/deployment-frontend.yaml
        rm k8s/deployment-frontend.yaml.tmp
        
        # Update backend manifest
        sed -i.tmp "s/imagePullPolicy: Never/imagePullPolicy: Always/" k8s/simple-backend-deployment.yaml
        sed -i.tmp "s|event-management-backend:latest|$DOCKER_USERNAME/event-management-backend:latest|" k8s/simple-backend-deployment.yaml
        rm k8s/simple-backend-deployment.yaml.tmp
        
        print_status "✅ Kubernetes manifests updated to use Docker Hub images"
        print_status "📁 Backups created: *.backup"
        
        echo ""
        print_status "To deploy with Docker Hub images:"
        echo "kubectl apply -f k8s/"
        
        echo ""
        print_status "To revert to local images:"
        echo "mv k8s/deployment-frontend.yaml.backup k8s/deployment-frontend.yaml"
        echo "mv k8s/simple-backend-deployment.yaml.backup k8s/simple-backend-deployment.yaml"
    fi
}

# Main menu
show_menu() {
    echo ""
    print_header "🐳 Docker Automation Management"
    echo "================================"
    echo ""
    echo "1. Show automation status"
    echo "2. Validate workflow file"
    echo "3. Test local Docker builds"
    echo "4. Show recent workflow runs"
    echo "5. Trigger manual workflow"
    echo "6. Show Docker Hub images"
    echo "7. Update K8s manifests for Docker Hub"
    echo "8. Open setup guide"
    echo "9. Exit"
    echo ""
}

# Open setup guide
open_guide() {
    if command -v code &> /dev/null; then
        code DOCKER_AUTOMATION_SETUP.md
    elif command -v open &> /dev/null; then
        open DOCKER_AUTOMATION_SETUP.md
    else
        print_status "Setup guide: DOCKER_AUTOMATION_SETUP.md"
    fi
}

# Main execution
main() {
    check_directory
    
    while true; do
        show_menu
        read -p "Enter your choice (1-9): " choice
        
        case $choice in
            1)
                show_status
                ;;
            2)
                validate_workflow
                ;;
            3)
                test_local_builds
                ;;
            4)
                show_runs
                ;;
            5)
                trigger_workflow
                ;;
            6)
                show_images
                ;;
            7)
                update_k8s_manifests
                ;;
            8)
                open_guide
                ;;
            9)
                print_status "Goodbye!"
                exit 0
                ;;
            *)
                print_error "Invalid choice. Please enter 1-9."
                ;;
        esac
        
        echo ""
        read -p "Press Enter to continue..."
    done
}

# Run main function
main
