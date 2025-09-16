package com.eventman;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {

    List<Event> findByStatus(Event.EventStatus status);

    List<Event> findByType(Event.EventType type);

    List<Event> findByCategory(String category);

    List<Event> findByOrganizerId(Long organizerId);

    List<Event> findByNameContainingIgnoreCase(String name);
}
