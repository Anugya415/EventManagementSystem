package com.eventman;

import jakarta.persistence.*;

@Entity
@Table(name = "events")
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String name;

    @Column(length = 2000)
    private String description;

    @Column(length = 500)
    private String location;

    @Column(name = "start_date_time", nullable = false)
    private String startDateTime;

    @Column(name = "end_date_time", nullable = false)
    private String endDateTime;

    @Column
    private Integer capacity;

    @Column
    private Double price;

    @Column(length = 10)
    private String currency;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EventType type;

    @Column(length = 100)
    private String category;

    @Column(length = 500)
    private String tags;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EventStatus status;

    @Column(name = "organizer_id")
    private Long organizerId;

    @Column(name = "organizer_name", length = 255)
    private String organizerName;

    @Column(name = "created_at", nullable = true)
    private String createdAt;

    // Default constructor
    public Event() {}

    // Constructor with all fields
    public Event(Long id, String name, String description, String location, String startDateTime, String endDateTime,
                 Integer capacity, Double price, String currency, EventType type, String category, String tags,
                 EventStatus status, Long organizerId, String organizerName, String createdAt) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.location = location;
        this.startDateTime = startDateTime;
        this.endDateTime = endDateTime;
        this.capacity = capacity;
        this.price = price;
        this.currency = currency;
        this.type = type;
        this.category = category;
        this.tags = tags;
        this.status = status;
        this.organizerId = organizerId;
        this.organizerName = organizerName;
        this.createdAt = createdAt;
    }

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getStartDateTime() { return startDateTime; }
    public void setStartDateTime(String startDateTime) { this.startDateTime = startDateTime; }

    public String getEndDateTime() { return endDateTime; }
    public void setEndDateTime(String endDateTime) { this.endDateTime = endDateTime; }

    public Integer getCapacity() { return capacity; }
    public void setCapacity(Integer capacity) { this.capacity = capacity; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public EventType getType() { return type; }
    public void setType(EventType type) { this.type = type; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getTags() { return tags; }
    public void setTags(String tags) { this.tags = tags; }

    public EventStatus getStatus() { return status; }
    public void setStatus(EventStatus status) { this.status = status; }

    public Long getOrganizerId() { return organizerId; }
    public void setOrganizerId(Long organizerId) { this.organizerId = organizerId; }

    public String getOrganizerName() { return organizerName; }
    public void setOrganizerName(String organizerName) { this.organizerName = organizerName; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }

    public enum EventStatus {
        DRAFT, PUBLISHED, ACTIVE, COMPLETED, CANCELLED
    }

    public enum EventType {
        CONFERENCE, WEDDING, FESTIVAL, WEBINAR, WORKSHOP, CONCERT, OTHER
    }
}
