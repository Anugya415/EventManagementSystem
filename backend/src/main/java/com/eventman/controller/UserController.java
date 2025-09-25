package com.eventman.controller;

import com.eventman.User;
import com.eventman.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3002", "http://eventman-frontend:3000"})
public class UserController {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody User userRequest) {
        try {
            // Check if email already exists
            if (userRepository.existsByEmail(userRequest.getEmail())) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Email already exists");
                return ResponseEntity.badRequest().body(error);
            }

            // Create new user
            User user = new User();
            user.setEmail(userRequest.getEmail());
            user.setName(userRequest.getName());
            user.setPhone(userRequest.getPhone());
            user.setRole(userRequest.getRole() != null ? userRequest.getRole() : User.UserRole.ATTENDEE);

            // Hash password if provided
            if (userRequest.getPassword() != null && !userRequest.getPassword().isEmpty()) {
                user.setPassword(passwordEncoder.encode(userRequest.getPassword()));
            } else {
                // Set a default password for demo purposes
                user.setPassword(passwordEncoder.encode("password123"));
            }

            // Set creation timestamp
            user.setCreatedAt(java.time.LocalDateTime.now().toString());

            User savedUser = userRepository.save(user);
            return ResponseEntity.ok(savedUser);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to create user: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userRepository.findAll();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(user -> ResponseEntity.ok(user))
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody User userRequest) {
        try {
            Optional<User> existingUserOpt = userRepository.findById(id);

            if (existingUserOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            User existingUser = existingUserOpt.get();

            // Update user fields
            existingUser.setName(userRequest.getName());
            existingUser.setPhone(userRequest.getPhone());
            existingUser.setRole(userRequest.getRole());

            // Update password if provided
            if (userRequest.getPassword() != null && !userRequest.getPassword().isEmpty()) {
                existingUser.setPassword(passwordEncoder.encode(userRequest.getPassword()));
            }

            User savedUser = userRepository.save(existingUser);
            return ResponseEntity.ok(savedUser);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to update user: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            Optional<User> user = userRepository.findById(id);

            if (user.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            userRepository.deleteById(id);
            Map<String, String> response = new HashMap<>();
            response.put("message", "User deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to delete user: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<User> getUserByEmail(@PathVariable String email) {
        return userRepository.findByEmail(email)
                .map(user -> ResponseEntity.ok(user))
                .orElse(ResponseEntity.notFound().build());
    }
}
