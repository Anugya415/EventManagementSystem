# 🧹 Clean Deployment Structure

## 📁 **Essential Files Only**

After cleanup, your codebase now contains only the essential deployment files:

### 🏗️ **Kubernetes Manifests (`k8s/`)**

```
k8s/
├── deployment-frontend.yaml      # Frontend deployment (Next.js)
├── simple-backend-deployment.yaml # Backend deployment (Spring Boot) 
├── simple-backend-service.yaml   # Backend service
├── service-frontend.yaml         # Frontend service
├── mysql-deployment.yaml         # MySQL database deployment
├── mysql-service.yaml           # MySQL service
├── mysql-pvc.yaml              # MySQL persistent volume claim
└── secrets.yaml                # Database and email secrets
```

### 🤖 **Ansible Automation (`ansible/`)**

```
ansible/
├── deploy.yml          # Main deployment playbook
├── requirements.yml    # Required Ansible collections
└── ansible.cfg        # Ansible configuration
```

### 📜 **Scripts (`scripts/`)**

```
scripts/
└── push-images.sh     # Docker image push script for different registries
```

## 🗑️ **Removed Files**

The following redundant files were removed:

### ❌ **Duplicate Backend Files**
- `k8s/deployment-backend.yaml` → Replaced by `simple-backend-deployment.yaml`
- `k8s/service-backend.yaml` → Replaced by `simple-backend-service.yaml`

### ❌ **Experimental Files**
- `k8s/deployment-with-different-registries.yaml` → Experimental multi-registry setup

### ❌ **Redundant Scripts**
- `scripts/deploy.sh` → Replaced by Ansible automation
- `scripts/setup-secrets.sh` → Secrets already configured

## ✅ **Benefits of Clean Structure**

1. **No Confusion**: Only one deployment method per component
2. **Easier Maintenance**: Fewer files to manage
3. **Clear Purpose**: Each file has a specific, non-overlapping function
4. **Working Configuration**: All remaining files are tested and working
5. **Ansible-First**: Primary deployment method is automated

## 🚀 **How to Deploy**

### **Option 1: Ansible (Recommended)**
```bash
cd ansible
ansible-playbook deploy.yml
```

### **Option 2: Direct kubectl**
```bash
kubectl apply -f k8s/
```

### **Option 3: Push to Different Registries**
```bash
./scripts/push-images.sh help
```

## 📊 **Current Working Deployments**

- **Ansible-managed (minikube)**: `http://localhost:3000` & `http://localhost:8080`
- **Pure Kubernetes (pure-k8s)**: `http://localhost:4000` & `http://localhost:9080`

Both deployments use the same clean file structure!
