package com.eventman.security;

import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
public class PermissionService {

    // Define role hierarchy and permissions
    public enum Permission {
        // Event permissions
        CREATE_EVENT,
        READ_EVENT,
        UPDATE_EVENT,
        DELETE_EVENT,

        // User permissions
        MANAGE_USERS,
        VIEW_USERS,

        // Analytics permissions
        VIEW_ANALYTICS,
        VIEW_REVENUE,

        // System permissions
        SYSTEM_ADMIN
    }

    public enum Role {
        ADMIN,
        ORGANIZER,
        ATTENDEE,
        GUEST
    }

    // Role-based permissions mapping
    private static final java.util.Map<Role, List<Permission>> ROLE_PERMISSIONS = java.util.Map.of(
        Role.ADMIN, Arrays.asList(
            Permission.CREATE_EVENT,
            Permission.READ_EVENT,
            Permission.UPDATE_EVENT,
            Permission.DELETE_EVENT,
            Permission.MANAGE_USERS,
            Permission.VIEW_USERS,
            Permission.VIEW_ANALYTICS,
            Permission.VIEW_REVENUE,
            Permission.SYSTEM_ADMIN
        ),
        Role.ORGANIZER, Arrays.asList(
            Permission.CREATE_EVENT,
            Permission.READ_EVENT,
            Permission.UPDATE_EVENT,
            Permission.DELETE_EVENT,
            Permission.VIEW_ANALYTICS,
            Permission.VIEW_REVENUE
        ),
        Role.ATTENDEE, Arrays.asList(
            Permission.READ_EVENT
        ),
        Role.GUEST, Arrays.asList(
            Permission.READ_EVENT
        )
    );

    /**
     * Check if user has specific permission
     */
    public boolean hasPermission(String[] userRoles, Permission permission) {
        if (userRoles == null || userRoles.length == 0) {
            return false;
        }

        return Arrays.stream(userRoles)
                .map(this::stringToRole)
                .filter(role -> role != null)
                .anyMatch(role -> ROLE_PERMISSIONS.get(role).contains(permission));
    }

    /**
     * Check if user has any of the specified permissions
     */
    public boolean hasAnyPermission(String[] userRoles, Permission... permissions) {
        if (userRoles == null || userRoles.length == 0) {
            return false;
        }

        return Arrays.stream(permissions)
                .anyMatch(permission -> hasPermission(userRoles, permission));
    }

    /**
     * Check if user has all of the specified permissions
     */
    public boolean hasAllPermissions(String[] userRoles, Permission... permissions) {
        if (userRoles == null || userRoles.length == 0) {
            return false;
        }

        return Arrays.stream(permissions)
                .allMatch(permission -> hasPermission(userRoles, permission));
    }

    /**
     * Check if user has specific role
     */
    public boolean hasRole(String[] userRoles, Role role) {
        if (userRoles == null || userRoles.length == 0) {
            return false;
        }

        return Arrays.stream(userRoles)
                .map(this::stringToRole)
                .anyMatch(r -> r == role);
    }

    /**
     * Check if user has any of the specified roles
     */
    public boolean hasAnyRole(String[] userRoles, Role... roles) {
        if (userRoles == null || userRoles.length == 0) {
            return false;
        }

        return Arrays.stream(roles)
                .anyMatch(role -> hasRole(userRoles, role));
    }

    /**
     * Get all permissions for user's roles
     */
    public List<Permission> getUserPermissions(String[] userRoles) {
        if (userRoles == null || userRoles.length == 0) {
            return Arrays.asList();
        }

        return Arrays.stream(userRoles)
                .map(this::stringToRole)
                .filter(role -> role != null)
                .flatMap(role -> ROLE_PERMISSIONS.get(role).stream())
                .distinct()
                .collect(java.util.stream.Collectors.toList());
    }

    /**
     * Convert string role to enum
     */
    private Role stringToRole(String roleString) {
        if (roleString == null) {
            return null;
        }

        try {
            return Role.valueOf(roleString.toUpperCase());
        } catch (IllegalArgumentException e) {
            return null;
        }
    }

    /**
     * Check if user can create events
     */
    public boolean canCreateEvent(String[] userRoles) {
        return hasPermission(userRoles, Permission.CREATE_EVENT);
    }

    /**
     * Check if user can read events
     */
    public boolean canReadEvent(String[] userRoles) {
        return hasPermission(userRoles, Permission.READ_EVENT);
    }

    /**
     * Check if user can update events
     */
    public boolean canUpdateEvent(String[] userRoles) {
        return hasPermission(userRoles, Permission.UPDATE_EVENT);
    }

    /**
     * Check if user can delete events
     */
    public boolean canDeleteEvent(String[] userRoles) {
        return hasPermission(userRoles, Permission.DELETE_EVENT);
    }

    /**
     * Check if user can manage users
     */
    public boolean canManageUsers(String[] userRoles) {
        return hasPermission(userRoles, Permission.MANAGE_USERS);
    }

    /**
     * Check if user can view analytics
     */
    public boolean canViewAnalytics(String[] userRoles) {
        return hasPermission(userRoles, Permission.VIEW_ANALYTICS);
    }

    /**
     * Check if user can view revenue
     */
    public boolean canViewRevenue(String[] userRoles) {
        return hasPermission(userRoles, Permission.VIEW_REVENUE);
    }

    /**
     * Check if user is admin
     */
    public boolean isAdmin(String[] userRoles) {
        return hasRole(userRoles, Role.ADMIN);
    }

    /**
     * Check if user is organizer
     */
    public boolean isOrganizer(String[] userRoles) {
        return hasRole(userRoles, Role.ORGANIZER);
    }

    /**
     * Check if user is attendee
     */
    public boolean isAttendee(String[] userRoles) {
        return hasRole(userRoles, Role.ATTENDEE);
    }
}
