# Festify - Event Management System

A comprehensive event management system with role-based access control, built with a Next.js frontend and Spring Boot backend.

## 🏗️ Architecture

- **Frontend**: Next.js 15 with Tailwind CSS
- **Backend**: Spring Boot 3 with Spring Security and JWT
- **Database**: MySQL 8
- **Authentication**: JWT tokens with role-based authorization

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

### Prerequisites
- Java 17 or higher
- Node.js 18 or higher
- MySQL 8.0
- Maven 3.6+

### Database Setup
1. Install MySQL and create a database:
```sql
CREATE DATABASE eventman_db;
```

2. Update MySQL root password to `12345678` or modify the backend configuration.

### Backend Setup
1. Navigate to the backend directory:
```bash
cd backend
```

2. Run the Spring Boot application:
```bash
mvn spring-boot:run
```

The backend will start on `http://localhost:8080` (or as configured in `application.properties`).

### Frontend Setup
1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create/update `.env.local` file:
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

## 🔒 Security Features

- JWT-based authentication with secure token generation
- Role-based access control (RBAC)
- Password encryption with BCrypt
- CORS configuration for cross-origin requests
- Request validation and sanitization
- Protected API endpoints

## 📊 Database Schema

The application automatically creates the following tables:
- `users` - User accounts with role-based permissions
- `events` - Event details and scheduling
- `tickets` - Ticket types and availability
- `payments` - Payment transactions and history
- `reminders` - Event reminders and notifications
- `role_requests` - User role upgrade requests

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
