package com.eventman.controller;

import com.eventman.security.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private final JwtUtil jwtUtil;

    // In-memory user storage for demo purposes
    private final java.util.Map<String, User> users = new java.util.concurrent.ConcurrentHashMap<>();
    private long nextUserId = 11; // Start after demo users

    public AuthController(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
        // Initialize with demo users
        initializeDemoUsers();
    }

    private void initializeDemoUsers() {
        users.put("admin@eventman.com", new User(1L, "admin@eventman.com", "System Administrator", new String[]{"ADMIN"}));
        users.put("superadmin@eventman.com", new User(4L, "superadmin@eventman.com", "Super Administrator", new String[]{"ADMIN"}));
        users.put("organizer@eventman.com", new User(2L, "organizer@eventman.com", "Event Organizer", new String[]{"ORGANIZER"}));
        users.put("sarah@eventman.com", new User(5L, "sarah@eventman.com", "Sarah Johnson", new String[]{"ORGANIZER"}));
        users.put("mike@eventman.com", new User(6L, "mike@eventman.com", "Mike Chen", new String[]{"ORGANIZER"}));
        users.put("attendee@eventman.com", new User(3L, "attendee@eventman.com", "Regular Attendee", new String[]{"ATTENDEE"}));
        users.put("john@example.com", new User(7L, "john@example.com", "John Smith", new String[]{"ATTENDEE"}));
        users.put("emma@example.com", new User(8L, "emma@example.com", "Emma Davis", new String[]{"ATTENDEE"}));
        users.put("alex@example.com", new User(9L, "alex@example.com", "Alex Wilson", new String[]{"ATTENDEE"}));
        users.put("lisa@example.com", new User(10L, "lisa@example.com", "Lisa Brown", new String[]{"ATTENDEE"}));
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        try {
            String email = loginRequest.getEmail();
            String password = loginRequest.getPassword();

            // Check if user exists and password matches (demo implementation)
            User user = users.get(email);
            if (user != null && isValidPassword(email, password)) {
                String token = jwtUtil.generateToken(email, user.getRoles());

                Map<String, Object> response = new HashMap<>();
                response.put("token", token);
                response.put("id", user.getId());
                response.put("email", user.getEmail());
                response.put("name", user.getName());
                response.put("roles", user.getRoles());
                return ResponseEntity.ok(response);
            }

            // Invalid credentials
            Map<String, String> error = new HashMap<>();
            error.put("message", "Invalid email or password");
            return ResponseEntity.badRequest().body(error);

        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Authentication failed");
            return ResponseEntity.badRequest().body(error);
        }
    }

    // Simple password validation for demo users
    private boolean isValidPassword(String email, String password) {
        // Demo password logic - in production, use proper password hashing
        if ("admin@eventman.com".equals(email) && "admin123".equals(password)) return true;
        if ("superadmin@eventman.com".equals(email) && "super123".equals(password)) return true;
        if ("organizer@eventman.com".equals(email) && "organizer123".equals(password)) return true;
        if ("sarah@eventman.com".equals(email) && "sarah123".equals(password)) return true;
        if ("mike@eventman.com".equals(email) && "mike123".equals(password)) return true;
        if ("attendee@eventman.com".equals(email) && "attendee123".equals(password)) return true;
        if ("john@example.com".equals(email) && "john123".equals(password)) return true;
        if ("emma@example.com".equals(email) && "emma123".equals(password)) return true;
        if ("alex@example.com".equals(email) && "alex123".equals(password)) return true;
        if ("lisa@example.com".equals(email) && "lisa123".equals(password)) return true;

        // Check registered users (they can use any password for demo purposes)
        User user = users.get(email);
        return user != null && password != null && !password.trim().isEmpty();
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest registerRequest) {
        try {
            String email = registerRequest.getEmail();
            String password = registerRequest.getPassword();
            String name = registerRequest.getName();

            // Validation
            if (email == null || email.trim().isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Email is required");
                return ResponseEntity.badRequest().body(error);
            }

            if (password == null || password.length() < 6) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Password must be at least 6 characters long");
                return ResponseEntity.badRequest().body(error);
            }

            if (name == null || name.trim().isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Name is required");
                return ResponseEntity.badRequest().body(error);
            }

            // Check if user already exists
            if (users.containsKey(email)) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "User with this email already exists");
                return ResponseEntity.badRequest().body(error);
            }

            // Create new user (all new registrations are attendees)
            long userId = nextUserId++;
            String[] roles = {"ATTENDEE"};
            User newUser = new User(userId, email, name, roles);
            users.put(email, newUser);

            // Generate JWT token for immediate login
            String token = jwtUtil.generateToken(email, roles);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Registration successful! Welcome to Festify!");
            response.put("token", token);
            response.put("user", Map.of(
                "id", userId,
                "email", email,
                "name", name,
                "roles", roles
            ));

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Registration failed. Please try again.");
            return ResponseEntity.badRequest().body(error);
        }
    }

    // Inner classes for request/response
    public static class LoginRequest {
        private String email;
        private String password;

        public LoginRequest() {}

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class RegisterRequest {
        private String email;
        private String password;
        private String name;
        private String phone;

        public RegisterRequest() {}

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    }

    // User model class
    public static class User {
        private Long id;
        private String email;
        private String name;
        private String[] roles;

        public User() {}

        public User(Long id, String email, String name, String[] roles) {
            this.id = id;
            this.email = email;
            this.name = name;
            this.roles = roles;
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String[] getRoles() { return roles; }
        public void setRoles(String[] roles) { this.roles = roles; }
    }
}