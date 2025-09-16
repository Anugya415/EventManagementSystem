package com.eventman;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    List<Payment> findByUserId(Long userId);

    List<Payment> findByEventId(Long eventId);

    List<Payment> findByStatus(Payment.PaymentStatus status);

    List<Payment> findByUserIdAndStatus(Long userId, Payment.PaymentStatus status);

    List<Payment> findByEventIdAndStatus(Long eventId, Payment.PaymentStatus status);
}
