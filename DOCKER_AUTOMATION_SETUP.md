# 🐳 Docker Hub Automation Setup Guide

## 📋 Overview

This guide sets up automated Docker image building and pushing to Docker Hub using GitHub Actions. The workflow will automatically build and push both frontend and backend images when code changes are detected.

## 🔧 Prerequisites

- ✅ GitHub repository with admin access
- ✅ Docker Hub account
- ✅ Working Dockerfiles in `event/` and `backend/` folders

## 🚀 Setup Instructions

### Step 1: Create Docker Hub Access Token

1. **Login to Docker Hub**: Go to [hub.docker.com](https://hub.docker.com)
2. **Navigate to Security**: Account Settings → Security
3. **Create New Token**:
   - Token Name: `github-actions-eventmanagement`
   - Permissions: `Read, Write, Delete`
4. **Copy Token**: Save the generated token securely

### Step 2: Configure GitHub Repository Secrets

Navigate to your GitHub repository → Settings → Secrets and variables → Actions

#### **Required Secrets:**

```bash
# Docker Hub Authentication
DOCKERHUB_USERNAME = your-dockerhub-username
DOCKERHUB_TOKEN = your-docker-hub-access-token
```

#### **Optional Variables (Repository Variables):**

```bash
# Frontend Environment
NEXT_PUBLIC_API_URL = https://your-api-domain.com
```

### Step 3: Repository Settings

#### **Enable GitHub Actions:**
- Go to Settings → Actions → General
- Set "Actions permissions" to "Allow all actions and reusable workflows"
- Enable "Allow GitHub Actions to create and approve pull requests"

#### **Configure Branch Protection (Recommended):**
- Go to Settings → Branches
- Add rule for `main` branch:
  - ✅ Require status checks to pass before merging
  - ✅ Require branches to be up to date before merging
  - ✅ Include administrators

## 🔄 Workflow Features

### **Automated Triggers:**
- ✅ **Push to main/develop**: Builds and pushes images
- ✅ **Pull Requests**: Builds images (no push)
- ✅ **Manual Trigger**: Via GitHub Actions UI
- ✅ **Path-based**: Only builds when relevant files change

### **Smart Change Detection:**
```yaml
Frontend builds when:
- Files in event/ folder change
- Workflow file changes

Backend builds when:
- Files in backend/ folder change  
- Workflow file changes
```

### **Multi-Architecture Support:**
- ✅ `linux/amd64` (Intel/AMD)
- ✅ `linux/arm64` (Apple Silicon, ARM servers)

### **Security Features:**
- ✅ Vulnerability scanning with Trivy
- ✅ Build provenance attestation
- ✅ SARIF security reports
- ✅ No secrets in logs

## 📦 Generated Docker Images

### **Image Naming Convention:**
```bash
# Frontend
docker.io/YOUR_USERNAME/event-management-frontend:latest
docker.io/YOUR_USERNAME/event-management-frontend:main-sha123456

# Backend  
docker.io/YOUR_USERNAME/event-management-backend:latest
docker.io/YOUR_USERNAME/event-management-backend:main-sha123456
```

### **Available Tags:**
- `latest` - Latest main branch build
- `main-{sha}` - Specific commit from main
- `develop-{sha}` - Specific commit from develop
- `pr-{number}` - Pull request builds (not pushed)

## 🎯 Usage Examples

### **Pull Latest Images:**
```bash
# Frontend
docker pull YOUR_USERNAME/event-management-frontend:latest

# Backend
docker pull YOUR_USERNAME/event-management-backend:latest
```

### **Run Containers:**
```bash
# Frontend
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=http://localhost:8080 \
  YOUR_USERNAME/event-management-frontend:latest

# Backend
docker run -p 8080:8080 \
  -e SPRING_PROFILES_ACTIVE=production \
  YOUR_USERNAME/event-management-backend:latest
```

### **Use in Kubernetes:**
```yaml
# Update your k8s manifests to use Docker Hub images
spec:
  containers:
  - name: frontend
    image: YOUR_USERNAME/event-management-frontend:latest
    imagePullPolicy: Always
```

## 🔍 Monitoring & Debugging

### **Check Workflow Status:**
1. Go to Actions tab in your GitHub repository
2. Click on "Build and Push Docker Images" workflow
3. View logs for each job

### **Common Issues:**

#### **Authentication Failed:**
```bash
Error: denied: requested access to the resource is denied
```
**Solution**: Check DOCKERHUB_USERNAME and DOCKERHUB_TOKEN secrets

#### **Build Failed:**
```bash
Error: failed to solve: process "/bin/sh -c npm run build" did not complete
```
**Solution**: Check Dockerfile and build logs for specific errors

#### **No Changes Detected:**
```bash
Skipping build - no changes in frontend/backend
```
**Solution**: This is normal - workflow only builds when files change

## 📊 Workflow Jobs Breakdown

### **1. detect-changes**
- Analyzes which components changed
- Determines if frontend/backend builds are needed

### **2. build-frontend** 
- Builds Next.js frontend Docker image
- Pushes to Docker Hub with multiple tags
- Supports multi-architecture builds

### **3. build-backend**
- Builds Spring Boot backend Docker image  
- Pushes to Docker Hub with multiple tags
- Supports multi-architecture builds

### **4. security-scan**
- Scans images for vulnerabilities
- Uploads results to GitHub Security tab
- Runs for successfully built images

### **5. notify-deployment**
- Creates deployment summary
- Shows build status and usage instructions
- Provides Docker commands for testing

## 🔄 Integration with Existing Ansible

This Docker automation **does not interfere** with your existing Ansible setup:

- ✅ **Ansible continues to work** with local images
- ✅ **Docker Hub provides backup** and distribution
- ✅ **Can switch between local/remote** images easily
- ✅ **Enables production deployments** with Docker Hub images

### **Switch to Docker Hub Images:**
```bash
# Update k8s manifests to use Docker Hub
sed -i 's/imagePullPolicy: Never/imagePullPolicy: Always/' k8s/deployment-frontend.yaml
sed -i 's/event-management-frontend:latest/YOUR_USERNAME\/event-management-frontend:latest/' k8s/deployment-frontend.yaml
```

## 🎉 Next Steps

1. **Setup Secrets**: Add DOCKERHUB_USERNAME and DOCKERHUB_TOKEN
2. **Test Workflow**: Make a small change and push to main
3. **Verify Images**: Check Docker Hub for new images
4. **Update Deployments**: Optionally switch to Docker Hub images
5. **Monitor Security**: Review vulnerability scan results

Your Docker automation is now ready! 🚀
