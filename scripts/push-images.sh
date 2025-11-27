#!/bin/bash

# Event Management System - Docker Image Push Script
# This script demonstrates different approaches to push frontend and backend

set -e

echo "🚀 Event Management System - Image Push Script"
echo "================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DOCKER_USERNAME="nithinkumark"
GITHUB_USERNAME="nithinkumark"
VERSION="v1.0.0"

echo -e "${BLUE}📋 Current Tagged Images:${NC}"
docker images | grep -E "(nithinkumark|ghcr.io)" || echo "No tagged images found"
echo ""

# Function to push to Docker Hub
push_to_dockerhub() {
    echo -e "${YELLOW}🐳 Pushing Frontend to Docker Hub...${NC}"
    echo "Registry: Docker Hub (hub.docker.com)"
    echo "Repository: ${DOCKER_USERNAME}/event-management-frontend"
    echo ""
    
    # Check if logged in to Docker Hub
    if ! docker info | grep -q "Username: ${DOCKER_USERNAME}"; then
        echo -e "${RED}❌ Please login to Docker Hub first:${NC}"
        echo "docker login"
        echo ""
        return 1
    fi
    
    # Push both latest and versioned tags
    echo "Pushing latest tag..."
    docker push ${DOCKER_USERNAME}/event-management-frontend:latest
    
    echo "Pushing version tag..."
    docker push ${DOCKER_USERNAME}/event-management-frontend:${VERSION}
    
    echo -e "${GREEN}✅ Frontend pushed to Docker Hub successfully!${NC}"
    echo "Available at: https://hub.docker.com/r/${DOCKER_USERNAME}/event-management-frontend"
    echo ""
}

# Function to push to GitHub Container Registry
push_to_ghcr() {
    echo -e "${YELLOW}📦 Pushing Backend to GitHub Container Registry...${NC}"
    echo "Registry: GitHub Container Registry (ghcr.io)"
    echo "Repository: ghcr.io/${GITHUB_USERNAME}/event-management-backend"
    echo ""
    
    # Check if logged in to GHCR
    if ! docker info | grep -q "ghcr.io"; then
        echo -e "${RED}❌ Please login to GitHub Container Registry first:${NC}"
        echo "echo \$GITHUB_TOKEN | docker login ghcr.io -u ${GITHUB_USERNAME} --password-stdin"
        echo "Or: docker login ghcr.io"
        echo ""
        return 1
    fi
    
    # Push both latest and versioned tags
    echo "Pushing latest tag..."
    docker push ghcr.io/${GITHUB_USERNAME}/event-management-backend:latest
    
    echo "Pushing version tag..."
    docker push ghcr.io/${GITHUB_USERNAME}/event-management-backend:${VERSION}
    
    echo -e "${GREEN}✅ Backend pushed to GHCR successfully!${NC}"
    echo "Available at: https://github.com/${GITHUB_USERNAME}/EventManagementSystem/pkgs/container/event-management-backend"
    echo ""
}

# Function to push to alternative registries
push_alternatives() {
    echo -e "${BLUE}🔄 Alternative Push Options:${NC}"
    echo ""
    
    echo "1. AWS ECR (Elastic Container Registry):"
    echo "   aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com"
    echo "   docker tag event-management-frontend:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/event-management-frontend:latest"
    echo "   docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/event-management-frontend:latest"
    echo ""
    
    echo "2. Google Container Registry (GCR):"
    echo "   gcloud auth configure-docker"
    echo "   docker tag event-management-backend:latest gcr.io/<project-id>/event-management-backend:latest"
    echo "   docker push gcr.io/<project-id>/event-management-backend:latest"
    echo ""
    
    echo "3. Azure Container Registry (ACR):"
    echo "   az acr login --name <registry-name>"
    echo "   docker tag event-management-frontend:latest <registry-name>.azurecr.io/event-management-frontend:latest"
    echo "   docker push <registry-name>.azurecr.io/event-management-frontend:latest"
    echo ""
    
    echo "4. Private Registry:"
    echo "   docker tag event-management-backend:latest your-registry.com/event-management-backend:latest"
    echo "   docker push your-registry.com/event-management-backend:latest"
    echo ""
}

# Main execution
case "${1:-help}" in
    "dockerhub")
        push_to_dockerhub
        ;;
    "ghcr")
        push_to_ghcr
        ;;
    "both")
        push_to_dockerhub
        push_to_ghcr
        ;;
    "alternatives")
        push_alternatives
        ;;
    "help"|*)
        echo -e "${GREEN}Usage: $0 [option]${NC}"
        echo ""
        echo "Options:"
        echo "  dockerhub     - Push frontend to Docker Hub"
        echo "  ghcr          - Push backend to GitHub Container Registry"
        echo "  both          - Push to both registries"
        echo "  alternatives  - Show alternative registry options"
        echo "  help          - Show this help message"
        echo ""
        echo -e "${YELLOW}Examples:${NC}"
        echo "  $0 dockerhub     # Push frontend to Docker Hub"
        echo "  $0 ghcr          # Push backend to GHCR"
        echo "  $0 both          # Push both images to different registries"
        echo ""
        ;;
esac

echo -e "${BLUE}📊 Summary of Tagged Images:${NC}"
echo "Frontend (Docker Hub):"
echo "  - ${DOCKER_USERNAME}/event-management-frontend:latest"
echo "  - ${DOCKER_USERNAME}/event-management-frontend:${VERSION}"
echo ""
echo "Backend (GitHub Container Registry):"
echo "  - ghcr.io/${GITHUB_USERNAME}/event-management-backend:latest"
echo "  - ghcr.io/${GITHUB_USERNAME}/event-management-backend:${VERSION}"
echo ""
