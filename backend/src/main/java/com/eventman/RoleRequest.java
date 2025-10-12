package com.eventman;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Table(name = "role_requests")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class RoleRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Store user info separately to avoid join issues
    @Column(name = "user_email", nullable = false)
    private String userEmail;

    @Column(name = "user_name", nullable = false)
    private String userName;

    @Column(nullable = false)
    private String requestedRole; // e.g., "ORGANIZER"

    @Column(name = "\"current_role\"", nullable = false)
    private String currentRole; // e.g., "ATTENDEE"

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RequestStatus status;

    @Column(length = 1000)
    private String reason;

    @Column(length = 500)
    private String adminNotes;

    @Column(name = "requested_at", nullable = false)
    private String requestedAt;

    @Column(name = "reviewed_at")
    private String reviewedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewed_by")
    private User reviewedBy;

    // Store reviewer info separately to avoid join issues
    @Column(name = "reviewed_by_name")
    private String reviewedByName;

    // Default constructor
    public RoleRequest() {}

    // Constructor
    public RoleRequest(User user, String requestedRole, String currentRole, String reason) {
        this.user = user;
        this.userEmail = user.getEmail();
        this.userName = user.getName();
        this.requestedRole = requestedRole;
        this.currentRole = currentRole;
        this.reason = reason;
        this.status = RequestStatus.PENDING;
        this.requestedAt = java.time.LocalDateTime.now().toString();
    }

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getRequestedRole() { return requestedRole; }
    public void setRequestedRole(String requestedRole) { this.requestedRole = requestedRole; }

    public String getCurrentRole() { return currentRole; }
    public void setCurrentRole(String currentRole) { this.currentRole = currentRole; }

    public RequestStatus getStatus() { return status; }
    public void setStatus(RequestStatus status) { this.status = status; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public String getAdminNotes() { return adminNotes; }
    public void setAdminNotes(String adminNotes) { this.adminNotes = adminNotes; }

    public String getRequestedAt() { return requestedAt; }
    public void setRequestedAt(String requestedAt) { this.requestedAt = requestedAt; }

    public String getReviewedAt() { return reviewedAt; }
    public void setReviewedAt(String reviewedAt) { this.reviewedAt = reviewedAt; }

    public User getReviewedBy() { return reviewedBy; }
    public void setReviewedBy(User reviewedBy) {
        this.reviewedBy = reviewedBy;
        if (reviewedBy != null) {
            this.reviewedByName = reviewedBy.getName();
        }
    }

    public String getReviewedByName() { return reviewedByName; }
    public void setReviewedByName(String reviewedByName) { this.reviewedByName = reviewedByName; }

    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public enum RequestStatus {
        PENDING, APPROVED, REJECTED
    }
}
