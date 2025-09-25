# Docker Deployment Guide

This guide explains how to deploy the Event Management System using Docker.

## Prerequisites

- Docker installed on your system
- Docker Compose installed on your system

## Project Structure

```
EventManagementSystem/
├── backend/          # Spring Boot application
├── event/           # Next.js frontend application
├── docker-compose.yml
├── .env             # Environment variables
└── DOCKER_DEPLOYMENT_README.md
```

## Environment Variables

The `.env` file contains the following configuration:

```env
# Database Configuration
DB_ROOT_PASSWORD=rootpassword
DB_NAME=eventman_db
DB_USERNAME=eventuser
DB_PASSWORD=eventpass123

# Next.js Frontend Configuration
NEXT_PUBLIC_API_URL=http://localhost:8080
```

## Services

### Database (MySQL)
- **Port**: 3306
- **Database**: eventman_db
- **Username**: eventuser
- **Password**: eventpass123

### Backend (Spring Boot)
- **Port**: 8080
- **Framework**: Spring Boot 3.2.0 with Java 17
- **Database**: MySQL 8.0

### Frontend (Next.js)
- **Port**: 3000
- **Framework**: Next.js 15.5.3 with React 19

## Deployment Steps

1. **Clone or navigate to the project directory**:
   ```bash
   cd /path/to/EventManagementSystem
   ```

2. **Ensure Docker and Docker Compose are running**:
   ```bash
   docker --version
   docker-compose --version
   ```

3. **Build and start all services**:
   ```bash
   docker-compose up --build
   ```

   Or run in detached mode:
   ```bash
   docker-compose up --build -d
   ```

4. **Wait for services to start**:
   - Database will initialize first
   - Backend will wait for database to be healthy
   - Frontend will wait for backend to be healthy

5. **Access the application**:
   - **Frontend**: http://localhost:3000
   - **Backend API**: http://localhost:8080
   - **Database**: localhost:3306 (accessible from host)

## Demo Users

The application comes with pre-configured demo users:

| Email | Password | Role |
|-------|----------|------|
| admin@eventman.com | password | ADMIN |
| organizer@eventman.com | password | ORGANIZER |
| attendee@eventman.com | password | ATTENDEE |
| sarah@eventman.com | password | ORGANIZER |
| mike@eventman.com | password | ORGANIZER |

## Stopping the Application

```bash
docker-compose down
```

To also remove volumes (including database data):
```bash
docker-compose down -v
```

## Troubleshooting

### Common Issues

1. **Port conflicts**: Ensure ports 3000, 8080, and 3306 are not in use by other applications.

2. **Database connection issues**: Check that the database container is healthy:
   ```bash
   docker-compose ps
   docker-compose logs db
   ```

3. **Backend startup failures**: Check backend logs:
   ```bash
   docker-compose logs backend
   ```

4. **Frontend build failures**: Check frontend logs:
   ```bash
   docker-compose logs frontend
   ```

### Logs

View logs for all services:
```bash
docker-compose logs
```

View logs for specific service:
```bash
docker-compose logs [service_name]  # backend, frontend, or db
```

### Rebuilding

If you make changes to the code, rebuild specific services:
```bash
docker-compose up --build [service_name]
```

Or rebuild everything:
```bash
docker-compose up --build
```

## Development Mode

For development, you can run services individually:

```bash
# Run only database
docker-compose up db

# Run backend with database
docker-compose up db backend

# Run everything
docker-compose up
```

## Production Deployment

For production deployment, consider:

1. Using environment-specific `.env` files
2. Setting up proper SSL/TLS certificates
3. Configuring reverse proxy (nginx)
4. Setting up monitoring and logging
5. Using managed database services instead of containerized MySQL
6. Implementing proper backup strategies

## API Endpoints

The backend provides REST API endpoints at `http://localhost:8080/api/`:

- `POST /api/auth/login` - User authentication
- `POST /api/auth/register` - User registration
- `GET /api/events` - Get all events
- `POST /api/events` - Create new event
- `PUT /api/events/{id}` - Update event
- `DELETE /api/events/{id}` - Delete event
- `GET /api/users` - Get all users
- `GET /api/tickets` - Get all tickets
- `GET /api/payments` - Get all payments
- `GET /api/reminders` - Get all reminders

All endpoints (except login/register) require JWT authentication.
