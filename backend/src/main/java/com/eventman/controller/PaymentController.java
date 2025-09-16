package com.eventman.controller;

import com.eventman.Payment;
import com.eventman.PaymentRepository;
import com.eventman.UserRepository;
import com.eventman.EventRepository;
import com.eventman.TicketRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "http://localhost:3000")
public class PaymentController {

    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;
    private final EventRepository eventRepository;
    private final TicketRepository ticketRepository;

    public PaymentController(PaymentRepository paymentRepository, UserRepository userRepository,
                           EventRepository eventRepository, TicketRepository ticketRepository) {
        this.paymentRepository = paymentRepository;
        this.userRepository = userRepository;
        this.eventRepository = eventRepository;
        this.ticketRepository = ticketRepository;
    }

    @PostMapping
    public ResponseEntity<?> createPayment(@RequestBody Payment paymentRequest) {
        try {
            // Validate user exists
            if (!userRepository.existsById(paymentRequest.getUserId())) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "User not found");
                return ResponseEntity.badRequest().body(error);
            }

            // Validate event exists if provided
            if (paymentRequest.getEventId() != null && !eventRepository.existsById(paymentRequest.getEventId())) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Event not found");
                return ResponseEntity.badRequest().body(error);
            }

            // Validate ticket exists if provided
            if (paymentRequest.getTicketId() != null && !ticketRepository.existsById(paymentRequest.getTicketId())) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Ticket not found");
                return ResponseEntity.badRequest().body(error);
            }

            // Create new payment
            Payment payment = new Payment();
            payment.setAmount(paymentRequest.getAmount());
            payment.setCurrency(paymentRequest.getCurrency() != null ? paymentRequest.getCurrency() : "USD");
            payment.setStatus(paymentRequest.getStatus() != null ? paymentRequest.getStatus() : Payment.PaymentStatus.PENDING);
            payment.setPaymentMethod(paymentRequest.getPaymentMethod());
            payment.setTransactionId(paymentRequest.getTransactionId());
            payment.setUserId(paymentRequest.getUserId());
            payment.setUserEmail(paymentRequest.getUserEmail());
            payment.setEventId(paymentRequest.getEventId());
            payment.setEventName(paymentRequest.getEventName());
            payment.setTicketId(paymentRequest.getTicketId());
            payment.setTicketName(paymentRequest.getTicketName());
            payment.setQuantity(paymentRequest.getQuantity());
            payment.setNotes(paymentRequest.getNotes());

            // Set timestamps
            String now = java.time.LocalDateTime.now().toString();
            payment.setCreatedAt(now);
            payment.setUpdatedAt(now);

            Payment savedPayment = paymentRepository.save(payment);
            return ResponseEntity.ok(savedPayment);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to create payment: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping
    public ResponseEntity<List<Payment>> getAllPayments() {
        List<Payment> payments = paymentRepository.findAll();
        return ResponseEntity.ok(payments);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Payment> getPaymentById(@PathVariable Long id) {
        return paymentRepository.findById(id)
                .map(payment -> ResponseEntity.ok(payment))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Payment>> getPaymentsByUser(@PathVariable Long userId) {
        List<Payment> payments = paymentRepository.findByUserId(userId);
        return ResponseEntity.ok(payments);
    }

    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<Payment>> getPaymentsByEvent(@PathVariable Long eventId) {
        List<Payment> payments = paymentRepository.findByEventId(eventId);
        return ResponseEntity.ok(payments);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Payment>> getPaymentsByStatus(@PathVariable Payment.PaymentStatus status) {
        List<Payment> payments = paymentRepository.findByStatus(status);
        return ResponseEntity.ok(payments);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updatePaymentStatus(@PathVariable Long id, @RequestParam Payment.PaymentStatus status) {
        try {
            Optional<Payment> existingPaymentOpt = paymentRepository.findById(id);

            if (existingPaymentOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Payment existingPayment = existingPaymentOpt.get();
            existingPayment.setStatus(status);
            existingPayment.setUpdatedAt(java.time.LocalDateTime.now().toString());

            Payment savedPayment = paymentRepository.save(existingPayment);
            return ResponseEntity.ok(savedPayment);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to update payment status: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePayment(@PathVariable Long id, @RequestBody Payment paymentRequest) {
        try {
            Optional<Payment> existingPaymentOpt = paymentRepository.findById(id);

            if (existingPaymentOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Payment existingPayment = existingPaymentOpt.get();

            // Update payment fields
            existingPayment.setAmount(paymentRequest.getAmount());
            existingPayment.setCurrency(paymentRequest.getCurrency());
            existingPayment.setStatus(paymentRequest.getStatus());
            existingPayment.setPaymentMethod(paymentRequest.getPaymentMethod());
            existingPayment.setTransactionId(paymentRequest.getTransactionId());
            existingPayment.setNotes(paymentRequest.getNotes());
            existingPayment.setUpdatedAt(java.time.LocalDateTime.now().toString());

            Payment savedPayment = paymentRepository.save(existingPayment);
            return ResponseEntity.ok(savedPayment);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to update payment: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePayment(@PathVariable Long id) {
        try {
            Optional<Payment> payment = paymentRepository.findById(id);

            if (payment.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            paymentRepository.deleteById(id);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Payment deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to delete payment: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/process")
    public ResponseEntity<?> processPayment(@RequestBody Map<String, Object> paymentData) {
        try {
            // This is a simplified payment processing endpoint
            // In a real application, you would integrate with payment processors like Stripe, PayPal, etc.

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Payment processed successfully");
            response.put("transactionId", "TXN_" + System.currentTimeMillis());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Payment processing failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}
