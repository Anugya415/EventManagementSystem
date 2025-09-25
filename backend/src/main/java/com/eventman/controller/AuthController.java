package com.eventman.controller;

import com.eventman.User;
import com.eventman.UserRepository;
import com.eventman.security.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3002", "http://eventman-frontend:3000"})
public class AuthController {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    // In-memory user storage for demo purposes (keeping for backward compatibility)
    private final java.util.Map<String, AuthUser> users = new java.util.concurrent.ConcurrentHashMap<>();

    public AuthController(JwtUtil jwtUtil, UserRepository userRepository) {
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
        // Initialize with demo users
        initializeDemoUsers();
    }

    private void initializeDemoUsers() {
        users.put("admin@eventman.com", new AuthUser(1L, "admin@eventman.com", "System Administrator", new String[]{"ADMIN"}));
        users.put("superadmin@eventman.com", new AuthUser(4L, "superadmin@eventman.com", "Super Administrator", new String[]{"ADMIN"}));
        users.put("organizer@eventman.com", new AuthUser(2L, "organizer@eventman.com", "Event Organizer", new String[]{"ORGANIZER"}));
        users.put("sarah@eventman.com", new AuthUser(5L, "sarah@eventman.com", "Sarah Johnson", new String[]{"ORGANIZER"}));
        users.put("mike@eventman.com", new AuthUser(6L, "mike@eventman.com", "Mike Chen", new String[]{"ORGANIZER"}));
        users.put("attendee@eventman.com", new AuthUser(3L, "attendee@eventman.com", "Regular Attendee", new String[]{"ATTENDEE"}));
        users.put("john@example.com", new AuthUser(7L, "john@example.com", "John Smith", new String[]{"ATTENDEE"}));
        users.put("emma@example.com", new AuthUser(8L, "emma@example.com", "Emma Davis", new String[]{"ATTENDEE"}));
        users.put("alex@example.com", new AuthUser(9L, "alex@example.com", "Alex Wilson", new String[]{"ATTENDEE"}));
        users.put("lisa@example.com", new AuthUser(10L, "lisa@example.com", "Lisa Brown", new String[]{"ATTENDEE"}));
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        try {
            String email = loginRequest.getEmail();
            String password = loginRequest.getPassword();

            // First check database users
            Optional<User> dbUser = userRepository.findByEmail(email);
            if (dbUser.isPresent()) {
                User user = dbUser.get();
                // For demo purposes, accept "password" for all database users
                if ("password".equals(password) || passwordEncoder.matches(password, user.getPassword())) {
                    String[] roles = {user.getRole().name()};
                    String token = jwtUtil.generateToken(email, roles);

                    Map<String, Object> response = new HashMap<>();
                    response.put("token", token);
                    response.put("id", user.getId());
                    response.put("email", user.getEmail());
                    response.put("name", user.getName());
                    response.put("roles", roles);
                    return ResponseEntity.ok(response);
                }
            }

            // Check demo users (in-memory)
            AuthUser user = users.get(email);
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
        // For demo purposes, accept "password" for all demo users
        return "password".equals(password);
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest registerRequest) {
        try {
            String email = registerRequest.getEmail();
            String password = registerRequest.getPassword();
            String name = registerRequest.getName();
            String phone = registerRequest.getPhone();

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

            // Check if user already exists in database
            if (userRepository.existsByEmail(email)) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "User with this email already exists");
                return ResponseEntity.badRequest().body(error);
            }

            // Check if user already exists in demo users
            if (users.containsKey(email)) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "User with this email already exists");
                return ResponseEntity.badRequest().body(error);
            }

            // Create new user in database (all new registrations are attendees)
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setName(name);
            newUser.setPhone(phone);
            newUser.setRole(User.UserRole.ATTENDEE);
            newUser.setPassword(passwordEncoder.encode(password));
            newUser.setCreatedAt(java.time.LocalDateTime.now().toString());

            User savedUser = userRepository.save(newUser);

            // Generate JWT token for immediate login
            String[] roles = {"ATTENDEE"};
            String token = jwtUtil.generateToken(email, roles);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Registration successful! Welcome to Festify!");
            response.put("token", token);
            response.put("user", Map.of(
                "id", savedUser.getId(),
                "email", savedUser.getEmail(),
                "name", savedUser.getName(),
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

    // AuthUser model class for in-memory demo users
    public static class AuthUser {
        private Long id;
        private String email;
        private String name;
        private String[] roles;

        public AuthUser() {}

        public AuthUser(Long id, String email, String name, String[] roles) {
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