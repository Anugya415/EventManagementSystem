package com.eventman;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReminderRepository extends JpaRepository<Reminder, Long> {

    List<Reminder> findByUserId(Long userId);

    List<Reminder> findByEventId(Long eventId);

    List<Reminder> findByStatus(Reminder.ReminderStatus status);

    List<Reminder> findByType(Reminder.ReminderType type);

    List<Reminder> findByUserIdAndStatus(Long userId, Reminder.ReminderStatus status);

    List<Reminder> findByScheduledTimeGreaterThanEqual(String scheduledTime);
}
