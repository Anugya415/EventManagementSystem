package com.eventman.controller;

import com.eventman.Event;
import com.eventman.EventRepository;
import com.eventman.User;
import com.eventman.UserRepository;
import com.eventman.Payment;
import com.eventman.PaymentRepository;
import com.eventman.Ticket;
import com.eventman.TicketRepository;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3002", "http://eventman-frontend:3000"})
public class ReportController {

    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final PaymentRepository paymentRepository;
    private final TicketRepository ticketRepository;

    public ReportController(EventRepository eventRepository, UserRepository userRepository,
                          PaymentRepository paymentRepository, TicketRepository ticketRepository) {
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
        this.paymentRepository = paymentRepository;
        this.ticketRepository = ticketRepository;
    }

    @GetMapping("/events")
    public ResponseEntity<String> getEventsReport(@RequestParam(defaultValue = "json") String format) {
        List<Event> events = eventRepository.findAll();

        if ("csv".equals(format)) {
            return generateEventsCSV(events);
        } else {
            return generateEventsJSON(events);
        }
    }

    @GetMapping("/users")
    public ResponseEntity<String> getUsersReport(@RequestParam(defaultValue = "json") String format) {
        List<User> users = userRepository.findAll();

        if ("csv".equals(format)) {
            return generateUsersCSV(users);
        } else {
            return generateUsersJSON(users);
        }
    }

    @GetMapping("/payments")
    public ResponseEntity<String> getPaymentsReport(
            @RequestParam(defaultValue = "json") String format,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {

        List<Payment> payments = paymentRepository.findAll();

        // Filter by date range if provided
        if (startDate != null && endDate != null) {
            payments = payments.stream()
                    .filter(payment -> payment.getCreatedAt() != null &&
                            payment.getCreatedAt().compareTo(startDate) >= 0 &&
                            payment.getCreatedAt().compareTo(endDate) <= 0)
                    .collect(Collectors.toList());
        }

        if ("csv".equals(format)) {
            return generatePaymentsCSV(payments);
        } else {
            return generatePaymentsJSON(payments);
        }
    }

    @GetMapping("/tickets")
    public ResponseEntity<String> getTicketsReport(@RequestParam(defaultValue = "json") String format) {
        List<Ticket> tickets = ticketRepository.findAll();

        if ("csv".equals(format)) {
            return generateTicketsCSV(tickets);
        } else {
            return generateTicketsJSON(tickets);
        }
    }

    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getSummaryReport() {
        Map<String, Object> summary = new HashMap<>();

        // Event statistics
        List<Event> events = eventRepository.findAll();
        summary.put("totalEvents", events.size());
        summary.put("activeEvents", events.stream()
                .filter(e -> e.getStatus() == Event.EventStatus.ACTIVE).count());
        summary.put("completedEvents", events.stream()
                .filter(e -> e.getStatus() == Event.EventStatus.COMPLETED).count());

        // User statistics
        List<User> users = userRepository.findAll();
        summary.put("totalUsers", users.size());
        summary.put("adminUsers", users.stream()
                .filter(u -> u.getRole() == User.UserRole.ADMIN).count());
        summary.put("organizerUsers", users.stream()
                .filter(u -> u.getRole() == User.UserRole.ORGANIZER).count());
        summary.put("attendeeUsers", users.stream()
                .filter(u -> u.getRole() == User.UserRole.ATTENDEE).count());

        // Payment statistics
        List<Payment> payments = paymentRepository.findAll();
        summary.put("totalPayments", payments.size());
        summary.put("completedPayments", payments.stream()
                .filter(p -> p.getStatus() == Payment.PaymentStatus.COMPLETED).count());
        summary.put("totalRevenue", payments.stream()
                .filter(p -> p.getStatus() == Payment.PaymentStatus.COMPLETED)
                .mapToDouble(Payment::getAmount).sum());

        // Ticket statistics
        List<Ticket> tickets = ticketRepository.findAll();
        summary.put("totalTickets", tickets.size());
        summary.put("activeTickets", tickets.stream()
                .filter(t -> t.getStatus() == Ticket.TicketStatus.ACTIVE).count());

        return ResponseEntity.ok(summary);
    }

    @GetMapping("/event/{eventId}/details")
    public ResponseEntity<Map<String, Object>> getEventDetailsReport(@PathVariable Long eventId) {
        Optional<Event> eventOpt = eventRepository.findById(eventId);
        if (eventOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Event event = eventOpt.get();
        Map<String, Object> eventDetails = new HashMap<>();

        // Event basic info
        eventDetails.put("event", event);

        // Tickets for this event
        List<Ticket> tickets = ticketRepository.findByEventId(eventId);
        eventDetails.put("tickets", tickets);
        eventDetails.put("totalTickets", tickets.size());

        // Payments for this event
        List<Payment> payments = paymentRepository.findByEventId(eventId);
        eventDetails.put("payments", payments);
        eventDetails.put("totalPayments", payments.size());
        eventDetails.put("totalRevenue", payments.stream()
                .filter(p -> p.getStatus() == Payment.PaymentStatus.COMPLETED)
                .mapToDouble(Payment::getAmount).sum());

        return ResponseEntity.ok(eventDetails);
    }

    private ResponseEntity<String> generateEventsCSV(List<Event> events) {
        StringBuilder csv = new StringBuilder();
        csv.append("ID,Name,Description,Location,Start Date,End Date,Capacity,Price,Currency,Type,Category,Tags,Status,Organizer ID,Organizer Name,Created At\n");

        for (Event event : events) {
            csv.append(String.format("%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s\n",
                    event.getId(),
                    escapeCSV(event.getName()),
                    escapeCSV(event.getDescription()),
                    escapeCSV(event.getLocation()),
                    event.getStartDateTime(),
                    event.getEndDateTime(),
                    event.getCapacity(),
                    event.getPrice(),
                    event.getCurrency(),
                    event.getType(),
                    event.getCategory(),
                    escapeCSV(event.getTags()),
                    event.getStatus(),
                    event.getOrganizerId(),
                    escapeCSV(event.getOrganizerName()),
                    event.getCreatedAt()));
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.TEXT_PLAIN);
        headers.setContentDispositionFormData("attachment", "events_report.csv");

        return ResponseEntity.ok()
                .headers(headers)
                .body(csv.toString());
    }

    private ResponseEntity<String> generateEventsJSON(List<Event> events) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setContentDispositionFormData("attachment", "events_report.json");

        return ResponseEntity.ok()
                .headers(headers)
                .body("{\"events\":" + events.toString() + "}");
    }

    private ResponseEntity<String> generateUsersCSV(List<User> users) {
        StringBuilder csv = new StringBuilder();
        csv.append("ID,Email,Name,Phone,Role,Created At\n");

        for (User user : users) {
            csv.append(String.format("%s,%s,%s,%s,%s,%s\n",
                    user.getId(),
                    escapeCSV(user.getEmail()),
                    escapeCSV(user.getName()),
                    user.getPhone(),
                    user.getRole(),
                    user.getCreatedAt()));
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.TEXT_PLAIN);
        headers.setContentDispositionFormData("attachment", "users_report.csv");

        return ResponseEntity.ok()
                .headers(headers)
                .body(csv.toString());
    }

    private ResponseEntity<String> generateUsersJSON(List<User> users) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setContentDispositionFormData("attachment", "users_report.json");

        return ResponseEntity.ok()
                .headers(headers)
                .body("{\"users\":" + users.toString() + "}");
    }

    private ResponseEntity<String> generatePaymentsCSV(List<Payment> payments) {
        StringBuilder csv = new StringBuilder();
        csv.append("ID,Amount,Currency,Status,Payment Method,Transaction ID,User ID,User Email,Event ID,Event Name,Ticket ID,Ticket Name,Quantity,Notes,Created At,Updated At\n");

        for (Payment payment : payments) {
            csv.append(String.format("%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s\n",
                    payment.getId(),
                    payment.getAmount(),
                    payment.getCurrency(),
                    payment.getStatus(),
                    payment.getPaymentMethod(),
                    payment.getTransactionId(),
                    payment.getUserId(),
                    escapeCSV(payment.getUserEmail()),
                    payment.getEventId(),
                    escapeCSV(payment.getEventName()),
                    payment.getTicketId(),
                    escapeCSV(payment.getTicketName()),
                    payment.getQuantity(),
                    escapeCSV(payment.getNotes()),
                    payment.getCreatedAt(),
                    payment.getUpdatedAt()));
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.TEXT_PLAIN);
        headers.setContentDispositionFormData("attachment", "payments_report.csv");

        return ResponseEntity.ok()
                .headers(headers)
                .body(csv.toString());
    }

    private ResponseEntity<String> generatePaymentsJSON(List<Payment> payments) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setContentDispositionFormData("attachment", "payments_report.json");

        return ResponseEntity.ok()
                .headers(headers)
                .body("{\"payments\":" + payments.toString() + "}");
    }

    private ResponseEntity<String> generateTicketsCSV(List<Ticket> tickets) {
        StringBuilder csv = new StringBuilder();
        csv.append("ID,Name,Description,Price,Currency,Quantity Available,Event ID,Event Name,Status,Created At\n");

        for (Ticket ticket : tickets) {
            csv.append(String.format("%s,%s,%s,%s,%s,%s,%s,%s,%s,%s\n",
                    ticket.getId(),
                    escapeCSV(ticket.getName()),
                    escapeCSV(ticket.getDescription()),
                    ticket.getPrice(),
                    ticket.getCurrency(),
                    ticket.getQuantityAvailable(),
                    ticket.getEventId(),
                    escapeCSV(ticket.getEventName()),
                    ticket.getStatus(),
                    ticket.getCreatedAt()));
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.TEXT_PLAIN);
        headers.setContentDispositionFormData("attachment", "tickets_report.csv");

        return ResponseEntity.ok()
                .headers(headers)
                .body(csv.toString());
    }

    private ResponseEntity<String> generateTicketsJSON(List<Ticket> tickets) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setContentDispositionFormData("attachment", "tickets_report.json");

        return ResponseEntity.ok()
                .headers(headers)
                .body("{\"tickets\":" + tickets.toString() + "}");
    }

    private String escapeCSV(String value) {
        if (value == null) return "";
        if (value.contains(",") || value.contains("\"") || value.contains("\n")) {
            return "\"" + value.replace("\"", "\"\"") + "\"";
        }
        return value;
    }
}
