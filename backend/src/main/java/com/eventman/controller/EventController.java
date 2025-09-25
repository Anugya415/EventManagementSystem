package com.eventman.controller;

import com.eventman.Event;
import com.eventman.EventRepository;
import com.eventman.security.JwtUtil;
import com.eventman.security.PermissionService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3002", "http://eventman-frontend:3000"})
public class EventController {

    private final PermissionService permissionService;
    private final JwtUtil jwtUtil;
    private final EventRepository eventRepository;

    public EventController(PermissionService permissionService, JwtUtil jwtUtil, EventRepository eventRepository) {
        this.permissionService = permissionService;
        this.jwtUtil = jwtUtil;
        this.eventRepository = eventRepository;
    }

    @PostMapping
    public ResponseEntity<?> createEvent(@RequestBody Event eventRequest) {
        try {
            // Check permissions using PermissionService
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated()) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Authentication required");
                return ResponseEntity.status(401).body(error);
            }

            String[] roles = authentication.getAuthorities().stream()
                    .map(authority -> authority.getAuthority().replace("ROLE_", ""))
                    .toArray(String[]::new);

            // Check permissions
            if (!permissionService.canCreateEvent(roles)) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Insufficient permissions to create events");
                return ResponseEntity.status(403).body(error);
            }

            // Create new event
            Event event = new Event();
            event.setName(eventRequest.getName());
            event.setDescription(eventRequest.getDescription());
            event.setLocation(eventRequest.getLocation());
            event.setStartDateTime(eventRequest.getStartDateTime());
            event.setEndDateTime(eventRequest.getEndDateTime());
            event.setCapacity(eventRequest.getCapacity());
            event.setPrice(eventRequest.getPrice());
            event.setCurrency(eventRequest.getCurrency());
            event.setType(eventRequest.getType());
            event.setCategory(eventRequest.getCategory());
            event.setTags(eventRequest.getTags());
            event.setStatus(eventRequest.getStatus() != null ? eventRequest.getStatus() : Event.EventStatus.DRAFT);
            event.setOrganizerId(1L); // Demo organizer ID
            event.setOrganizerName("Demo Organizer");

            // Save to database
            Event savedEvent = eventRepository.save(event);

            return ResponseEntity.ok(savedEvent);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to create event");
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping
    public ResponseEntity<List<Event>> getAllEvents() {
        List<Event> events = eventRepository.findAll();
        return ResponseEntity.ok(events);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Event> getEventById(@PathVariable Long id) {
        Optional<Event> event = eventRepository.findById(id);

        if (event.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(event.get());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateEvent(@PathVariable Long id, @RequestBody Event eventRequest) {
        try {
            // Check permissions using PermissionService
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated()) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Authentication required");
                return ResponseEntity.status(401).body(error);
            }

            String[] roles = authentication.getAuthorities().stream()
                    .map(authority -> authority.getAuthority().replace("ROLE_", ""))
                    .toArray(String[]::new);

            if (!permissionService.canUpdateEvent(roles)) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Insufficient permissions to update events");
                return ResponseEntity.status(403).body(error);
            }

            Optional<Event> existingEventOpt = eventRepository.findById(id);

            if (existingEventOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Event existingEvent = existingEventOpt.get();

            // Update event fields
            existingEvent.setName(eventRequest.getName());
            existingEvent.setDescription(eventRequest.getDescription());
            existingEvent.setLocation(eventRequest.getLocation());
            existingEvent.setStartDateTime(eventRequest.getStartDateTime());
            existingEvent.setEndDateTime(eventRequest.getEndDateTime());
            existingEvent.setCapacity(eventRequest.getCapacity());
            existingEvent.setPrice(eventRequest.getPrice());
            existingEvent.setCurrency(eventRequest.getCurrency());
            existingEvent.setType(eventRequest.getType());
            existingEvent.setCategory(eventRequest.getCategory());
            existingEvent.setTags(eventRequest.getTags());
            existingEvent.setStatus(eventRequest.getStatus());

            Event savedEvent = eventRepository.save(existingEvent);
            return ResponseEntity.ok(savedEvent);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to update event");
            return ResponseEntity.badRequest().body(error);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEvent(@PathVariable Long id) {
        try {
            // Check permissions using PermissionService
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated()) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Authentication required");
                return ResponseEntity.status(401).body(error);
            }

            String[] roles = authentication.getAuthorities().stream()
                    .map(authority -> authority.getAuthority().replace("ROLE_", ""))
                    .toArray(String[]::new);

            if (!permissionService.canDeleteEvent(roles)) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Insufficient permissions to delete events");
                return ResponseEntity.status(403).body(error);
            }

            Optional<Event> event = eventRepository.findById(id);

            if (event.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            eventRepository.deleteById(id);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Event deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to delete event");
            return ResponseEntity.badRequest().body(error);
        }
    }
}