package com.eventman;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "reminders")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Reminder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(length = 1000)
    private String message;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReminderType type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReminderStatus status;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "user_email", length = 255)
    private String userEmail;

    @Column(name = "event_id")
    private Long eventId;

    @Column(name = "event_name", length = 255)
    private String eventName;

    @Column(name = "scheduled_time", nullable = false)
    private String scheduledTime;

    @Column(name = "sent_time")
    private String sentTime;

    @Column(length = 500)
    private String notes;

    @Column(name = "created_at", nullable = true)
    private String createdAt;

    // Default constructor
    public Reminder() {}

    // Constructor with all fields
    public Reminder(Long id, String title, String message, ReminderType type,
                   ReminderStatus status, Long userId, String userEmail, Long eventId,
                   String eventName, String scheduledTime, String sentTime, String notes, String createdAt) {
        this.id = id;
        this.title = title;
        this.message = message;
        this.type = type;
        this.status = status;
        this.userId = userId;
        this.userEmail = userEmail;
        this.eventId = eventId;
        this.eventName = eventName;
        this.scheduledTime = scheduledTime;
        this.sentTime = sentTime;
        this.notes = notes;
        this.createdAt = createdAt;
    }

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public ReminderType getType() { return type; }
    public void setType(ReminderType type) { this.type = type; }

    public ReminderStatus getStatus() { return status; }
    public void setStatus(ReminderStatus status) { this.status = status; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }

    public Long getEventId() { return eventId; }
    public void setEventId(Long eventId) { this.eventId = eventId; }

    public String getEventName() { return eventName; }
    public void setEventName(String eventName) { this.eventName = eventName; }

    public String getScheduledTime() { return scheduledTime; }
    public void setScheduledTime(String scheduledTime) { this.scheduledTime = scheduledTime; }

    public String getSentTime() { return sentTime; }
    public void setSentTime(String sentTime) { this.sentTime = sentTime; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }

    public enum ReminderType {
        EMAIL, SMS, PUSH_NOTIFICATION, IN_APP
    }

    public enum ReminderStatus {
        PENDING, SENT, FAILED, CANCELLED
    }
}
