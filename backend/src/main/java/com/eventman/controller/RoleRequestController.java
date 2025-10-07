package com.eventman.controller;

import com.eventman.RoleRequest;
import com.eventman.RoleRequestRepository;
import com.eventman.User;
import com.eventman.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/role-requests")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3002", "http://eventman-frontend:3000"})
public class RoleRequestController {

    private final RoleRequestRepository roleRequestRepository;
    private final UserRepository userRepository;

    public RoleRequestController(RoleRequestRepository roleRequestRepository, UserRepository userRepository) {
        this.roleRequestRepository = roleRequestRepository;
        this.userRepository = userRepository;
    }

    // Submit a role request (for attendees)
    @PostMapping
    public ResponseEntity<?> submitRoleRequest(@RequestBody Map<String, Object> requestData) {
        try {
            Long userId = Long.valueOf(requestData.get("userId").toString());
            String requestedRole = (String) requestData.get("requestedRole");
            String reason = (String) requestData.get("reason");

            // Validate user exists
            Optional<User> userOpt = userRepository.findById(userId);
            if (userOpt.isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "User not found");
                return ResponseEntity.badRequest().body(error);
            }

            User user = userOpt.get();

            // Check if user already has a pending request for this role
            boolean hasPendingRequest = roleRequestRepository.existsByUserIdAndRequestedRoleAndStatus(
                userId, requestedRole, RoleRequest.RequestStatus.PENDING
            );

            if (hasPendingRequest) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "You already have a pending request for this role");
                return ResponseEntity.badRequest().body(error);
            }

            // Create new role request
            RoleRequest roleRequest = new RoleRequest(user, requestedRole, user.getRole().toString(), reason);
            // The constructor already sets userEmail and userName, but let's make sure
            roleRequest.setUserEmail(user.getEmail());
            roleRequest.setUserName(user.getName());
            RoleRequest savedRequest = roleRequestRepository.save(roleRequest);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Role request submitted successfully");
            response.put("request", savedRequest);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to submit role request: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // Get user's role requests
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<RoleRequest>> getUserRoleRequests(@PathVariable Long userId) {
        List<RoleRequest> requests = roleRequestRepository.findByUserId(userId);
        return ResponseEntity.ok(requests);
    }

    // Get all role requests (for admins)
    @GetMapping
    public ResponseEntity<List<RoleRequest>> getAllRoleRequests() {
        List<RoleRequest> requests = roleRequestRepository.findAll();
        return ResponseEntity.ok(requests);
    }

    // Get pending role requests (for admins)
    @GetMapping("/pending")
    public ResponseEntity<List<RoleRequest>> getPendingRoleRequests() {
        List<RoleRequest> requests = roleRequestRepository.findAllPendingRequests();
        return ResponseEntity.ok(requests);
    }

    // Approve role request (admin only)
    @PutMapping("/{requestId}/approve")
    public ResponseEntity<?> approveRoleRequest(
            @PathVariable Long requestId,
            @RequestBody Map<String, Object> approvalData) {
        try {
            Optional<RoleRequest> requestOpt = roleRequestRepository.findById(requestId);
            if (requestOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            RoleRequest request = requestOpt.get();

            if (request.getStatus() != RoleRequest.RequestStatus.PENDING) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Request is not in pending status");
                return ResponseEntity.badRequest().body(error);
            }

            Long adminId = Long.valueOf(approvalData.get("adminId").toString());
            Optional<User> adminOpt = userRepository.findById(adminId);
            if (adminOpt.isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Admin not found");
                return ResponseEntity.badRequest().body(error);
            }

            // Update user role
            User user = request.getUser();
            user.setRole(User.UserRole.valueOf(request.getRequestedRole()));
            userRepository.save(user);

            // Update request status
            request.setStatus(RoleRequest.RequestStatus.APPROVED);
            request.setReviewedBy(adminOpt.get());
            request.setReviewedByName(adminOpt.get().getName());
            request.setReviewedAt(java.time.LocalDateTime.now().toString());
            if (approvalData.containsKey("adminNotes")) {
                request.setAdminNotes((String) approvalData.get("adminNotes"));
            }

            RoleRequest updatedRequest = roleRequestRepository.save(request);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Role request approved successfully");
            response.put("request", updatedRequest);
            response.put("updatedUser", user);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to approve role request: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // Reject role request (admin only)
    @PutMapping("/{requestId}/reject")
    public ResponseEntity<?> rejectRoleRequest(
            @PathVariable Long requestId,
            @RequestBody Map<String, Object> rejectionData) {
        try {
            Optional<RoleRequest> requestOpt = roleRequestRepository.findById(requestId);
            if (requestOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            RoleRequest request = requestOpt.get();

            if (request.getStatus() != RoleRequest.RequestStatus.PENDING) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Request is not in pending status");
                return ResponseEntity.badRequest().body(error);
            }

            Long adminId = Long.valueOf(rejectionData.get("adminId").toString());
            Optional<User> adminOpt = userRepository.findById(adminId);
            if (adminOpt.isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Admin not found");
                return ResponseEntity.badRequest().body(error);
            }

            // Update request status
            request.setStatus(RoleRequest.RequestStatus.REJECTED);
            request.setReviewedBy(adminOpt.get());
            request.setReviewedByName(adminOpt.get().getName());
            request.setReviewedAt(java.time.LocalDateTime.now().toString());
            if (rejectionData.containsKey("adminNotes")) {
                request.setAdminNotes((String) rejectionData.get("adminNotes"));
            }

            RoleRequest updatedRequest = roleRequestRepository.save(request);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Role request rejected");
            response.put("request", updatedRequest);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to reject role request: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // Delete role request
    @DeleteMapping("/{requestId}")
    public ResponseEntity<?> deleteRoleRequest(@PathVariable Long requestId) {
        try {
            Optional<RoleRequest> requestOpt = roleRequestRepository.findById(requestId);
            if (requestOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            roleRequestRepository.deleteById(requestId);

            Map<String, String> response = new HashMap<>();
            response.put("message", "Role request deleted successfully");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to delete role request: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // Get role request by ID
    @GetMapping("/{requestId}")
    public ResponseEntity<RoleRequest> getRoleRequestById(@PathVariable Long requestId) {
        return roleRequestRepository.findById(requestId)
                .map(request -> ResponseEntity.ok(request))
                .orElse(ResponseEntity.notFound().build());
    }
}
