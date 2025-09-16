# EventMan - Event Management System

A comprehensive event management system with role-based access control, built with Next.js frontend and Spring Boot backend.

## 🏗️ Architecture

- **Frontend**: Next.js 15 with Tailwind CSS
- **Backend**: Spring Boot 3 with Spring Security and JWT
- **Database**: MySQL 8
- **Authentication**: JWT tokens with role-based authorization

## 🚀 Features

### 👤 User Roles & Permissions
- **ADMIN**: Full system access, user management, all features
- **ORGANIZER**: Create and manage events, view attendees, analytics
- **ATTENDEE**: Register for events, view tickets, manage profile

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

2. The application will automatically create tables on startup.

### Backend Setup
1. Navigate to the backend directory:
```bash
cd backend
```

2. Update database configuration in `src/main/resources/application.properties` if needed:
```properties
spring.datasource.username=root
spring.datasource.password=
spring.datasource.url=jdbc:mysql://localhost:3306/eventman_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
```

3. Run the Spring Boot application:
```bash
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### Frontend Setup
1. Navigate to the frontend directory:
```bash
cd event
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will start on `http://localhost:3000`

## 🔐 Demo Accounts

The application creates demo accounts on startup:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@eventman.com | admin123 |
| Organizer | organizer@eventman.com | organizer123 |
| Attendee | attendee@eventman.com | attendee123 |

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Users
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/profile` - Get current user profile
- `GET /api/users/{id}` - Get user by ID
- `PUT /api/users/{id}` - Update user

### Events
- `GET /api/events` - Get all events
- `GET /api/events/{id}` - Get event by ID
- `POST /api/events` - Create new event
- `PUT /api/events/{id}` - Update event
- `DELETE /api/events/{id}` - Delete event
- `GET /api/events/my-events` - Get organizer's events

### Test Endpoints
- `GET /api/test/public` - Public access
- `GET /api/test/user` - Authenticated users
- `GET /api/test/admin` - Admin only
- `GET /api/test/organizer` - Organizer/Admin only

## 🔒 Security Features

- JWT-based authentication
- Role-based access control
- Password encryption with BCrypt
- CORS configuration
- Request validation

## 🚦 Getting Started

1. Start the backend server first
2. Start the frontend development server
3. Open `http://localhost:3000` in your browser
4. Login with one of the demo accounts
5. Explore the role-based features!

## 📝 Development Notes

- The backend uses Spring Security with JWT tokens
- Frontend uses React Context for authentication state
- Database schema is auto-generated from JPA entities
- Demo data is created on application startup

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
