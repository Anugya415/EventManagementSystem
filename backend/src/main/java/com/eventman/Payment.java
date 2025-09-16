package com.eventman;

import jakarta.persistence.*;

@Entity
@Table(name = "payments")
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Double amount;

    @Column(length = 10)
    private String currency;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentStatus status;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method", nullable = false)
    private PaymentMethod paymentMethod;

    @Column(name = "transaction_id", length = 255)
    private String transactionId;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "user_email", length = 255)
    private String userEmail;

    @Column(name = "event_id")
    private Long eventId;

    @Column(name = "event_name", length = 255)
    private String eventName;

    @Column(name = "ticket_id")
    private Long ticketId;

    @Column(name = "ticket_name", length = 255)
    private String ticketName;

    @Column(name = "quantity")
    private Integer quantity;

    @Column(length = 1000)
    private String notes;

    @Column(name = "created_at", nullable = true)
    private String createdAt;

    @Column(name = "updated_at", nullable = true)
    private String updatedAt;

    // Default constructor
    public Payment() {}

    // Constructor with all fields
    public Payment(Long id, Double amount, String currency, PaymentStatus status,
                  PaymentMethod paymentMethod, String transactionId, Long userId,
                  String userEmail, Long eventId, String eventName, Long ticketId,
                  String ticketName, Integer quantity, String notes, String createdAt, String updatedAt) {
        this.id = id;
        this.amount = amount;
        this.currency = currency;
        this.status = status;
        this.paymentMethod = paymentMethod;
        this.transactionId = transactionId;
        this.userId = userId;
        this.userEmail = userEmail;
        this.eventId = eventId;
        this.eventName = eventName;
        this.ticketId = ticketId;
        this.ticketName = ticketName;
        this.quantity = quantity;
        this.notes = notes;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public PaymentStatus getStatus() { return status; }
    public void setStatus(PaymentStatus status) { this.status = status; }

    public PaymentMethod getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(PaymentMethod paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getTransactionId() { return transactionId; }
    public void setTransactionId(String transactionId) { this.transactionId = transactionId; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }

    public Long getEventId() { return eventId; }
    public void setEventId(Long eventId) { this.eventId = eventId; }

    public String getEventName() { return eventName; }
    public void setEventName(String eventName) { this.eventName = eventName; }

    public Long getTicketId() { return ticketId; }
    public void setTicketId(Long ticketId) { this.ticketId = ticketId; }

    public String getTicketName() { return ticketName; }
    public void setTicketName(String ticketName) { this.ticketName = ticketName; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }

    public String getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(String updatedAt) { this.updatedAt = updatedAt; }

    public enum PaymentStatus {
        PENDING, COMPLETED, FAILED, REFUNDED, CANCELLED
    }

    public enum PaymentMethod {
        CREDIT_CARD, DEBIT_CARD, PAYPAL, BANK_TRANSFER, CASH, OTHER
    }
}
