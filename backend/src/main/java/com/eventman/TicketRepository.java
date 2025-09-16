package com.eventman;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {

    List<Ticket> findByEventId(Long eventId);

    List<Ticket> findByEventIdAndStatus(Long eventId, Ticket.TicketStatus status);

    List<Ticket> findByStatus(Ticket.TicketStatus status);
}
