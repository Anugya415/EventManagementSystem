# 🚀 Event Management System - Complete CI/CD & Deployment Guide

This guide provides a complete CI/CD and deployment setup for your full-stack Event Management System using GitHub Actions, Docker, Kubernetes, and Ansible.

## 📋 Prerequisites

- Docker Hub account
- Kubernetes cluster (local minikube, cloud provider, etc.)
- GitHub repository with Actions enabled
- kubectl configured locally
- Ansible installed (for manual deployment)

## 🔧 Setup Instructions

### 1. GitHub Secrets Configuration

Add the following secrets to your GitHub repository (`Settings > Secrets and variables > Actions`):

```bash
# Docker Hub credentials
DOCKERHUB_USERNAME=your-dockerhub-username
DOCKERHUB_TOKEN=your-dockerhub-access-token

# Kubernetes configuration (base64 encoded kubeconfig)
KUBE_CONFIG_DATA=<base64-encoded-kubeconfig>
```

#### To get your base64 encoded kubeconfig:
```bash
# Encode your kubeconfig file
cat ~/.kube/config | base64 -w 0
```

### 2. Update Email Configuration

Edit `k8s/secrets.yaml` and replace the email credentials:

```bash
# Encode your email credentials
echo -n "your-email@gmail.com" | base64
echo -n "your-app-password" | base64

# Update the secrets.yaml file with the encoded values
```

### 3. Project Structure

Your project should have this structure:
```
EventManagementSystem/
├── .github/workflows/ci-cd.yml     # GitHub Actions workflow
├── k8s/                            # Kubernetes manifests
│   ├── deployment-frontend.yaml
│   ├── service-frontend.yaml
│   ├── deployment-backend.yaml
│   ├── service-backend.yaml
│   ├── mysql-deployment.yaml
│   ├── mysql-service.yaml
│   ├── mysql-pvc.yaml
│   └── secrets.yaml
├── ansible/                        # Ansible automation
│   ├── deploy.yml
│   ├── requirements.yml
│   └── ansible.cfg
├── event/                          # Frontend (Next.js)
│   └── Dockerfile
├── backend/                        # Backend (Spring Boot)
│   └── Dockerfile
└── DEPLOYMENT_GUIDE.md            # This file
```

## 🚀 Deployment Methods

### Method 1: Automatic CI/CD (Recommended)

1. **Push to main branch** - This triggers the GitHub Actions workflow automatically
2. **Monitor the workflow** in GitHub Actions tab
3. **Check deployment status** in your Kubernetes cluster

The workflow will:
- Build Docker images for frontend and backend
- Push images to Docker Hub with commit SHA tags
- Deploy to Kubernetes automatically
- Verify deployment status

### Method 2: Manual Deployment with Ansible

#### Prerequisites:
```bash
# Install Ansible
pip install ansible

# Install required collections
ansible-galaxy collection install -r ansible/requirements.yml
```

#### Deploy:
```bash
# Navigate to ansible directory
cd ansible

# Run the deployment playbook
ansible-playbook deploy.yml

# Or run specific tags
ansible-playbook deploy.yml --tags "secrets,storage,mysql"
ansible-playbook deploy.yml --tags "backend,frontend"
```

### Method 3: Manual kubectl Deployment

```bash
# Apply all manifests
kubectl apply -f k8s/

# Check deployment status
kubectl get deployments
kubectl get services
kubectl get pods

# Get frontend service external IP
kubectl get service frontend-service
```

## 🔍 Monitoring & Troubleshooting

### Check Deployment Status
```bash
# View all resources
kubectl get all

# Check pod logs
kubectl logs -l app=frontend
kubectl logs -l app=backend
kubectl logs -l app=mysql

# Describe problematic pods
kubectl describe pod <pod-name>

# Check service endpoints
kubectl get endpoints
```

### Common Issues & Solutions

1. **Image Pull Errors**
   ```bash
   # Check if images exist in Docker Hub
   docker pull <your-username>/event-management-frontend:latest
   docker pull <your-username>/event-management-backend:latest
   ```

2. **Database Connection Issues**
   ```bash
   # Check MySQL pod status
   kubectl get pods -l app=mysql
   kubectl logs -l app=mysql
   
   # Verify secrets
   kubectl get secrets
   kubectl describe secret mysql-secret
   ```

3. **Service Not Accessible**
   ```bash
   # Check service type and external IP
   kubectl get services
   
   # For LoadBalancer services, wait for external IP assignment
   kubectl get service frontend-service -w
   ```

## 📊 Application Access

### Frontend Access
```bash
# Get the external IP
kubectl get service frontend-service

# Access the application
http://<EXTERNAL-IP>
```

### Backend API Access
```bash
# Port forward for testing (backend is ClusterIP)
kubectl port-forward service/backend-service 8080:8080

# Test API endpoints
curl http://localhost:8080/actuator/health
```

## 🔄 Updates & Rollbacks

### Rolling Updates
```bash
# Update image in deployment
kubectl set image deployment/frontend-deployment frontend=<new-image>
kubectl set image deployment/backend-deployment backend=<new-image>

# Check rollout status
kubectl rollout status deployment/frontend-deployment
kubectl rollout status deployment/backend-deployment
```

### Rollbacks
```bash
# View rollout history
kubectl rollout history deployment/frontend-deployment

# Rollback to previous version
kubectl rollout undo deployment/frontend-deployment
kubectl rollout undo deployment/backend-deployment
```

## 🧹 Cleanup

### Remove all resources
```bash
# Delete all resources
kubectl delete -f k8s/

# Or delete by labels
kubectl delete all -l app=frontend
kubectl delete all -l app=backend
kubectl delete all -l app=mysql
```

## 🔐 Security Considerations

1. **Secrets Management**: Update default passwords in `k8s/secrets.yaml`
2. **Network Policies**: Consider implementing network policies for production
3. **RBAC**: Set up proper Role-Based Access Control
4. **Image Security**: Scan Docker images for vulnerabilities
5. **TLS/SSL**: Configure HTTPS for production deployments

## 📈 Scaling

### Horizontal Pod Autoscaler
```bash
# Create HPA for frontend
kubectl autoscale deployment frontend-deployment --cpu-percent=70 --min=2 --max=10

# Create HPA for backend
kubectl autoscale deployment backend-deployment --cpu-percent=70 --min=2 --max=10

# Check HPA status
kubectl get hpa
```

### Manual Scaling
```bash
# Scale deployments
kubectl scale deployment frontend-deployment --replicas=5
kubectl scale deployment backend-deployment --replicas=3
```

## 🎯 Production Checklist

- [ ] Update all default passwords and secrets
- [ ] Configure proper resource limits and requests
- [ ] Set up monitoring and logging (Prometheus, Grafana, ELK stack)
- [ ] Configure backup strategy for MySQL data
- [ ] Set up SSL/TLS certificates
- [ ] Configure domain name and ingress controller
- [ ] Implement network policies
- [ ] Set up alerting and notifications
- [ ] Configure CI/CD notifications (Slack, email)
- [ ] Test disaster recovery procedures

## 📞 Support

For issues and questions:
1. Check the troubleshooting section above
2. Review GitHub Actions logs
3. Check Kubernetes events: `kubectl get events --sort-by=.metadata.creationTimestamp`
4. Review application logs in pods

---

**🎉 Your Event Management System is now ready for production deployment!**
