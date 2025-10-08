# Festify - Event Management System

A comprehensive event management system with role-based access control, built with Next.js frontend and Spring Boot backend.

## 🏗️ Architecture

- **Frontend**: Next.js 15 with Tailwind CSS
- **Backend**: Spring Boot 3 with Spring Security and JWT
- **Database**: MySQL 8
- **Authentication**: JWT tokens with role-based authorization
- **Deployment**: Docker & Docker Compose

## 🚀 Features

### 👤 User Roles & Permissions
- **ADMIN**: Full system access, user management, role request approvals
- **ORGANIZER**: Create and manage events, view attendees, analytics
- **ATTENDEE**: Register for events, view tickets, request organizer role

### 📅 Event Management
- Create and manage events with customizable fields
- Event scheduling and capacity management
- Ticket type configuration and pricing
- Event status tracking (Draft, Published, Active, Completed)

### 🎫 Ticket & Registration
- Multiple ticket types per event
- Automated registration system
- Payment processing integration
- Attendee management and check-in

### 💳 Payment Processing
- Transaction history and status tracking
- Multiple payment methods support
- Refund management
- Revenue analytics

### 📝 Role Request System
- Attendees can request organizer role
- Admin approval/rejection workflow
- Request tracking and history
- Admin notes for decisions

### 📧 Communication
- Email reminder system
- Template management
- Automated notifications
- Performance tracking

### 📊 Analytics & Reporting
- Event performance metrics
- Revenue and attendance analytics
- User engagement statistics
- Export capabilities

## 🛠️ Setup Instructions

### Option 1: Docker Deployment (Recommended) 🐳

The easiest way to run the entire application is using Docker Compose.

#### Prerequisites
- Docker Desktop installed and running
- Docker Compose (comes with Docker Desktop)

#### Quick Start
1. **Clone the repository and navigate to the project:**
```bash
cd EventManagementSystem
```

2. **Start all services with Docker Compose:**
```bash
docker-compose up --build -d
```

3. **Wait for services to start (about 1-2 minutes):**
```bash
docker-compose ps
```

4. **Access the application:**
- **Frontend**: http://localhost:3002
- **Backend API**: http://localhost:8081
- **Database**: localhost:3307

5. **View logs (optional):**
```bash
docker-compose logs -f
```

6. **Stop the application:**
```bash
docker-compose down
```

7. **Stop and remove all data:**
```bash
docker-compose down -v
```

### Option 2: Local Development Setup

#### Prerequisites
- Java 17 or higher
- Node.js 18 or higher
- MySQL 8.0
- Maven 3.6+

#### Database Setup
1. Install MySQL and create a database:
```sql
CREATE DATABASE eventman_db;
```

2. Update MySQL root password to `12345678` or modify `application.properties`

#### Backend Setup
1. Navigate to the backend directory:
```bash
cd backend
```

2. Run the Spring Boot application:
```bash
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

#### Frontend Setup
1. Navigate to the frontend directory:
```bash
cd event
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file (optional):
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

4. Start the development server:
```bash
npm run dev
```

The frontend will start on `http://localhost:3000`

## 🔐 Demo Accounts

The application comes with pre-configured demo accounts:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@eventman.com | password |
| Organizer | organizer@eventman.com | password |
| Attendee | attendee@eventman.com | password |

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Users
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/{id}` - Get user by ID
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user

### Events
- `GET /api/events` - Get all events
- `GET /api/events/{id}` - Get event by ID
- `POST /api/events` - Create new event (Organizer/Admin)
- `PUT /api/events/{id}` - Update event
- `DELETE /api/events/{id}` - Delete event

### Tickets
- `GET /api/tickets` - Get all tickets
- `GET /api/tickets/{id}` - Get ticket by ID
- `POST /api/tickets` - Create ticket
- `PUT /api/tickets/{id}` - Update ticket
- `DELETE /api/tickets/{id}` - Delete ticket

### Payments
- `GET /api/payments` - Get all payments
- `POST /api/payments` - Create payment
- `PUT /api/payments/{id}` - Update payment
- `PUT /api/payments/{id}/status` - Update payment status

### Role Requests
- `POST /api/role-requests` - Submit role request (Attendee)
- `GET /api/role-requests` - Get all requests (Admin)
- `GET /api/role-requests/pending` - Get pending requests (Admin)
- `PUT /api/role-requests/{id}/approve` - Approve request (Admin)
- `PUT /api/role-requests/{id}/reject` - Reject request (Admin)

### Reminders
- `GET /api/reminders` - Get all reminders
- `POST /api/reminders` - Create reminder
- `PUT /api/reminders/{id}` - Update reminder
- `DELETE /api/reminders/{id}` - Delete reminder

## 💾 Database Access

### Docker Deployment
When running with Docker, connect to MySQL using:

**MySQL Workbench / DBeaver / Any MySQL Client:**
```
Host:     127.0.0.1  (or localhost)
Port:     3307       ⚠️ NOT 3306!
Username: root
Password: 12345678
Database: eventman_db
```

**Command Line:**
```bash
mysql -h 127.0.0.1 -P 3307 -uroot -p12345678 eventman_db
```

**Docker Exec:**
```bash
docker-compose exec db mysql -uroot -p12345678 eventman_db
```

### Local Development
```
Host:     localhost
Port:     3306
Username: root
Password: 12345678
Database: eventman_db
```

## 🔒 Security Features

- JWT-based authentication with secure token generation
- Role-based access control (RBAC)
- Password encryption with BCrypt
- CORS configuration for cross-origin requests
- Request validation and sanitization
- Protected API endpoints

## 🚦 Getting Started

### Using Docker (Recommended)
1. Run `docker-compose up --build -d`
2. Wait for containers to be healthy
3. Open `http://localhost:3002` in your browser
4. Login with demo account: `admin@eventman.com` / `password`

### Using Local Development
1. Start MySQL database
2. Start backend: `cd backend && mvn spring-boot:run`
3. Start frontend: `cd event && npm run dev`
4. Open `http://localhost:3000` in your browser

## 📝 Development Notes

- Backend uses Spring Security with JWT authentication
- Frontend uses React Context API for state management
- Database schema auto-updates with `spring.jpa.hibernate.ddl-auto=update`
- Sample data loaded from `data.sql` on first startup
- Data persists across container restarts using Docker volumes

## 🐳 Docker Commands Reference

### Basic Operations
```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View running containers
docker-compose ps

# View logs
docker-compose logs -f [service_name]

# Restart a specific service
docker-compose restart [service_name]

# Rebuild and restart
docker-compose up --build -d
```

### Database Operations
```bash
# Access MySQL shell
docker-compose exec db mysql -uroot -p12345678 eventman_db

# Backup database
docker-compose exec db mysqldump -uroot -p12345678 eventman_db > backup.sql

# View database tables
docker-compose exec db mysql -uroot -p12345678 -e "USE eventman_db; SHOW TABLES;"

# Check data counts
docker-compose exec db mysql -uroot -p12345678 -e "
  USE eventman_db;
  SELECT 'USERS' as table_name, COUNT(*) as count FROM users
  UNION ALL SELECT 'EVENTS', COUNT(*) FROM events
  UNION ALL SELECT 'TICKETS', COUNT(*) FROM tickets
  UNION ALL SELECT 'PAYMENTS', COUNT(*) FROM payments;"
```

### Troubleshooting
```bash
# View backend logs
docker-compose logs backend

# View frontend logs
docker-compose logs frontend

# View database logs
docker-compose logs db

# Check container health
docker-compose ps

# Remove all containers and volumes (fresh start)
docker-compose down -v
```

## 🔍 Troubleshooting Guide

### Cannot connect to MySQL Workbench
- ✅ Use port **3307** (not 3306)
- ✅ Use hostname **127.0.0.1** (not localhost or db)
- ✅ Username: `root`, Password: `12345678`

### Frontend cannot reach backend
- Check if containers are running: `docker-compose ps`
- Check backend logs: `docker-compose logs backend`
- Verify API URL in browser console

### Data not persisting
- Don't use `docker-compose down -v` (removes volumes)
- Use `docker-compose down` to preserve data
- Database uses persistent volume: `eventmanagementsystem_db_data`

### Port conflicts
- Frontend: Change `3002:3000` in docker-compose.yml
- Backend: Change `8081:8080` in docker-compose.yml
- Database: Change `3307:3306` in docker-compose.yml

## 📊 Database Schema

The application automatically creates the following tables:
- `users` - User accounts with role-based permissions
- `events` - Event details and scheduling
- `tickets` - Ticket types and availability
- `payments` - Payment transactions and history
- `reminders` - Event reminders and notifications
- `role_requests` - User role upgrade requests

## 🎯 Usage Guide

### For Attendees
1. Register or login at http://localhost:3002
2. Browse events on the Events page
3. Purchase tickets for events
4. View your tickets in "My Tickets"
5. Request organizer role from your Profile page

### For Organizers
1. Login with organizer account
2. Create events from "Events" → "Create Event"
3. Manage tickets for your events
4. View attendee lists and analytics
5. Send reminders to participants

### For Admins
1. Login with admin account
2. Manage all users in "Users" page
3. Review role requests in "Role Requests"
4. Approve/reject organizer role requests
5. View system-wide analytics and reports
6. Manage all events, payments, and tickets

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly with Docker
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
