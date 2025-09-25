package com.eventman.controller;

import com.eventman.Reminder;
import com.eventman.ReminderRepository;
import com.eventman.UserRepository;
import com.eventman.EventRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/reminders")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3002", "http://eventman-frontend:3000"})
public class ReminderController {

    private final ReminderRepository reminderRepository;
    private final UserRepository userRepository;
    private final EventRepository eventRepository;

    public ReminderController(ReminderRepository reminderRepository, UserRepository userRepository,
                            EventRepository eventRepository) {
        this.reminderRepository = reminderRepository;
        this.userRepository = userRepository;
        this.eventRepository = eventRepository;
    }

    @PostMapping
    public ResponseEntity<?> createReminder(@RequestBody Reminder reminderRequest) {
        try {
            // Validate user exists
            if (!userRepository.existsById(reminderRequest.getUserId())) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "User not found");
                return ResponseEntity.badRequest().body(error);
            }

            // Validate event exists if provided
            if (reminderRequest.getEventId() != null && !eventRepository.existsById(reminderRequest.getEventId())) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Event not found");
                return ResponseEntity.badRequest().body(error);
            }

            // Create new reminder
            Reminder reminder = new Reminder();
            reminder.setTitle(reminderRequest.getTitle());
            reminder.setMessage(reminderRequest.getMessage());
            reminder.setType(reminderRequest.getType());
            reminder.setStatus(reminderRequest.getStatus() != null ? reminderRequest.getStatus() : Reminder.ReminderStatus.PENDING);
            reminder.setUserId(reminderRequest.getUserId());
            reminder.setUserEmail(reminderRequest.getUserEmail());
            reminder.setEventId(reminderRequest.getEventId());
            reminder.setEventName(reminderRequest.getEventName());
            reminder.setScheduledTime(reminderRequest.getScheduledTime());
            reminder.setNotes(reminderRequest.getNotes());

            // Set creation timestamp
            reminder.setCreatedAt(java.time.LocalDateTime.now().toString());

            Reminder savedReminder = reminderRepository.save(reminder);
            return ResponseEntity.ok(savedReminder);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to create reminder: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping
    public ResponseEntity<List<Reminder>> getAllReminders() {
        List<Reminder> reminders = reminderRepository.findAll();
        return ResponseEntity.ok(reminders);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Reminder> getReminderById(@PathVariable Long id) {
        return reminderRepository.findById(id)
                .map(reminder -> ResponseEntity.ok(reminder))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Reminder>> getRemindersByUser(@PathVariable Long userId) {
        List<Reminder> reminders = reminderRepository.findByUserId(userId);
        return ResponseEntity.ok(reminders);
    }

    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<Reminder>> getRemindersByEvent(@PathVariable Long eventId) {
        List<Reminder> reminders = reminderRepository.findByEventId(eventId);
        return ResponseEntity.ok(reminders);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Reminder>> getRemindersByStatus(@PathVariable Reminder.ReminderStatus status) {
        List<Reminder> reminders = reminderRepository.findByStatus(status);
        return ResponseEntity.ok(reminders);
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<Reminder>> getRemindersByType(@PathVariable Reminder.ReminderType type) {
        List<Reminder> reminders = reminderRepository.findByType(type);
        return ResponseEntity.ok(reminders);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateReminderStatus(@PathVariable Long id, @RequestParam Reminder.ReminderStatus status) {
        try {
            Optional<Reminder> existingReminderOpt = reminderRepository.findById(id);

            if (existingReminderOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Reminder existingReminder = existingReminderOpt.get();
            existingReminder.setStatus(status);

            if (status == Reminder.ReminderStatus.SENT) {
                existingReminder.setSentTime(java.time.LocalDateTime.now().toString());
            }

            Reminder savedReminder = reminderRepository.save(existingReminder);
            return ResponseEntity.ok(savedReminder);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to update reminder status: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateReminder(@PathVariable Long id, @RequestBody Reminder reminderRequest) {
        try {
            Optional<Reminder> existingReminderOpt = reminderRepository.findById(id);

            if (existingReminderOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Reminder existingReminder = existingReminderOpt.get();

            // Update reminder fields
            existingReminder.setTitle(reminderRequest.getTitle());
            existingReminder.setMessage(reminderRequest.getMessage());
            existingReminder.setType(reminderRequest.getType());
            existingReminder.setStatus(reminderRequest.getStatus());
            existingReminder.setScheduledTime(reminderRequest.getScheduledTime());
            existingReminder.setNotes(reminderRequest.getNotes());

            Reminder savedReminder = reminderRepository.save(existingReminder);
            return ResponseEntity.ok(savedReminder);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to update reminder: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteReminder(@PathVariable Long id) {
        try {
            Optional<Reminder> reminder = reminderRepository.findById(id);

            if (reminder.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            reminderRepository.deleteById(id);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Reminder deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to delete reminder: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/send/{id}")
    public ResponseEntity<?> sendReminder(@PathVariable Long id) {
        try {
            Optional<Reminder> existingReminderOpt = reminderRepository.findById(id);

            if (existingReminderOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Reminder existingReminder = existingReminderOpt.get();

            // In a real application, you would integrate with email/SMS services here
            // For now, we'll just mark it as sent
            existingReminder.setStatus(Reminder.ReminderStatus.SENT);
            existingReminder.setSentTime(java.time.LocalDateTime.now().toString());

            Reminder savedReminder = reminderRepository.save(existingReminder);

            Map<String, String> response = new HashMap<>();
            response.put("message", "Reminder sent successfully");
            response.put("reminderId", id.toString());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to send reminder: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/pending")
    public ResponseEntity<List<Reminder>> getPendingReminders() {
        String now = java.time.LocalDateTime.now().toString();
        List<Reminder> pendingReminders = reminderRepository.findByScheduledTimeGreaterThanEqual(now)
                .stream()
                .filter(reminder -> reminder.getStatus() == Reminder.ReminderStatus.PENDING)
                .toList();
        return ResponseEntity.ok(pendingReminders);
    }
}
