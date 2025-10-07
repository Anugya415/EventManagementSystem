package com.eventman;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoleRequestRepository extends JpaRepository<RoleRequest, Long> {

    // Find all role requests by user
    List<RoleRequest> findByUserId(Long userId);

    // Find all role requests by status
    List<RoleRequest> findByStatus(RoleRequest.RequestStatus status);

    // Find all role requests by user and status
    List<RoleRequest> findByUserIdAndStatus(Long userId, RoleRequest.RequestStatus status);

    // Find all pending requests
    @Query("SELECT r FROM RoleRequest r WHERE r.status = 'PENDING' ORDER BY r.requestedAt DESC")
    List<RoleRequest> findAllPendingRequests();

    // Find all approved requests
    @Query("SELECT r FROM RoleRequest r WHERE r.status = 'APPROVED' ORDER BY r.reviewedAt DESC")
    List<RoleRequest> findAllApprovedRequests();

    // Find all rejected requests
    @Query("SELECT r FROM RoleRequest r WHERE r.status = 'REJECTED' ORDER BY r.reviewedAt DESC")
    List<RoleRequest> findAllRejectedRequests();

    // Check if user has any pending requests for a specific role
    boolean existsByUserIdAndRequestedRoleAndStatus(Long userId, String requestedRole, RoleRequest.RequestStatus status);

    // Find role request by user and requested role with pending status
    Optional<RoleRequest> findByUserIdAndRequestedRoleAndStatus(Long userId, String requestedRole, RoleRequest.RequestStatus status);
}

