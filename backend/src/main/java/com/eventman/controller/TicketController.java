package com.eventman.controller;

import com.eventman.Ticket;
import com.eventman.TicketRepository;
import com.eventman.EventRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3002", "http://eventman-frontend:3000"})
public class TicketController {

    private final TicketRepository ticketRepository;
    private final EventRepository eventRepository;

    public TicketController(TicketRepository ticketRepository, EventRepository eventRepository) {
        this.ticketRepository = ticketRepository;
        this.eventRepository = eventRepository;
    }

    @PostMapping
    public ResponseEntity<?> createTicket(@RequestBody Ticket ticketRequest) {
        try {
            // Validate that the event exists
            if (ticketRequest.getEventId() != null && !eventRepository.existsById(ticketRequest.getEventId())) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Event not found");
                return ResponseEntity.badRequest().body(error);
            }

            // Create new ticket
            Ticket ticket = new Ticket();
            ticket.setName(ticketRequest.getName());
            ticket.setDescription(ticketRequest.getDescription());
            ticket.setPrice(ticketRequest.getPrice());
            ticket.setCurrency(ticketRequest.getCurrency() != null ? ticketRequest.getCurrency() : "USD");
            ticket.setQuantityAvailable(ticketRequest.getQuantityAvailable());
            ticket.setEventId(ticketRequest.getEventId());
            ticket.setEventName(ticketRequest.getEventName());
            ticket.setStatus(ticketRequest.getStatus() != null ? ticketRequest.getStatus() : Ticket.TicketStatus.ACTIVE);

            // Set creation timestamp
            ticket.setCreatedAt(java.time.LocalDateTime.now().toString());

            Ticket savedTicket = ticketRepository.save(ticket);
            return ResponseEntity.ok(savedTicket);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to create ticket: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping
    public ResponseEntity<List<Ticket>> getAllTickets() {
        List<Ticket> tickets = ticketRepository.findAll();
        return ResponseEntity.ok(tickets);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Ticket> getTicketById(@PathVariable Long id) {
        return ticketRepository.findById(id)
                .map(ticket -> ResponseEntity.ok(ticket))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<Ticket>> getTicketsByEvent(@PathVariable Long eventId) {
        List<Ticket> tickets = ticketRepository.findByEventId(eventId);
        return ResponseEntity.ok(tickets);
    }

    @GetMapping("/event/{eventId}/active")
    public ResponseEntity<List<Ticket>> getActiveTicketsByEvent(@PathVariable Long eventId) {
        List<Ticket> tickets = ticketRepository.findByEventIdAndStatus(eventId, Ticket.TicketStatus.ACTIVE);
        return ResponseEntity.ok(tickets);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateTicket(@PathVariable Long id, @RequestBody Ticket ticketRequest) {
        try {
            Optional<Ticket> existingTicketOpt = ticketRepository.findById(id);

            if (existingTicketOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Ticket existingTicket = existingTicketOpt.get();

            // Update ticket fields
            existingTicket.setName(ticketRequest.getName());
            existingTicket.setDescription(ticketRequest.getDescription());
            existingTicket.setPrice(ticketRequest.getPrice());
            existingTicket.setCurrency(ticketRequest.getCurrency());
            existingTicket.setQuantityAvailable(ticketRequest.getQuantityAvailable());
            existingTicket.setStatus(ticketRequest.getStatus());

            // Update event info if provided
            if (ticketRequest.getEventId() != null) {
                existingTicket.setEventId(ticketRequest.getEventId());
                existingTicket.setEventName(ticketRequest.getEventName());
            }

            Ticket savedTicket = ticketRepository.save(existingTicket);
            return ResponseEntity.ok(savedTicket);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to update ticket: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTicket(@PathVariable Long id) {
        try {
            Optional<Ticket> ticket = ticketRepository.findById(id);

            if (ticket.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            ticketRepository.deleteById(id);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Ticket deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to delete ticket: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateTicketStatus(@PathVariable Long id, @RequestParam Ticket.TicketStatus status) {
        try {
            Optional<Ticket> existingTicketOpt = ticketRepository.findById(id);

            if (existingTicketOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Ticket existingTicket = existingTicketOpt.get();
            existingTicket.setStatus(status);

            Ticket savedTicket = ticketRepository.save(existingTicket);
            return ResponseEntity.ok(savedTicket);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to update ticket status: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}
