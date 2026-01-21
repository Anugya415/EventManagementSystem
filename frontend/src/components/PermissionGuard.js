'use client';

import { useAuth } from './AuthContext';

/**
 * PermissionGuard component for role-based access control
 * @param {Object} props
 * @param {string|string[]} props.roles - Required roles to access the content
 * @param {React.ReactNode} props.children - Content to render if user has permission
 * @param {React.ReactNode} props.fallback - Content to render if user doesn't have permission (optional)
 * @param {boolean} props.requireAll - Whether user needs ALL specified roles (default: false - needs ANY)
 */
export default function PermissionGuard({
  roles,
  children,
  fallback = null,
  requireAll = false
}) {
  const { user, hasRole, hasAnyRole, isAuthenticated } = useAuth();

  // If no roles specified, allow access
  if (!roles || (Array.isArray(roles) && roles.length === 0)) {
    return children;
  }

  // Check if user is authenticated
  if (!isAuthenticated) {
    return fallback;
  }

  // Convert single role to array
  const roleArray = Array.isArray(roles) ? roles : [roles];

  // Check permissions
  const hasPermission = requireAll
    ? roleArray.every(role => hasRole(role))
    : hasAnyRole(roleArray);

  return hasPermission ? children : fallback;
}

/**
 * Higher-order component for role-based rendering
 * @param {string|string[]} roles - Required roles
 * @param {React.Component} Component - Component to wrap
 * @param {React.ReactNode} fallback - Fallback content
 * @param {boolean} requireAll - Whether user needs ALL roles
 */
export function withPermission(roles, Component, fallback = null, requireAll = false) {
  return function WrappedComponent(props) {
    return (
      <PermissionGuard roles={roles} fallback={fallback} requireAll={requireAll}>
        <Component {...props} />
      </PermissionGuard>
    );
  };
}

/**
 * Hook for checking permissions programmatically
 * @param {string|string[]} roles - Roles to check
 * @param {boolean} requireAll - Whether user needs ALL roles
 * @returns {boolean} Whether user has permission
 */
export function usePermission(roles, requireAll = false) {
  const { hasRole, hasAnyRole } = useAuth();

  if (!roles || (Array.isArray(roles) && roles.length === 0)) {
    return true;
  }

  const roleArray = Array.isArray(roles) ? roles : [roles];

  return requireAll
    ? roleArray.every(role => hasRole(role))
    : hasAnyRole(roleArray);
}

/**
 * ActionButton component with role-based visibility
 * @param {Object} props
 * @param {string|string[]} props.roles - Required roles to show button
 * @param {string} props.action - Action name (for permission checking)
 * @param {function} props.onClick - Click handler
 * @param {React.ReactNode} props.children - Button content
 * @param {boolean} props.requireAll - Whether user needs ALL roles
 * @param {Object} props.buttonProps - Additional button props
 */
export function ActionButton({
  roles,
  action,
  onClick,
  children,
  requireAll = false,
  disabled = false,
  ...buttonProps
}) {
  const hasPermission = usePermission(roles, requireAll);

  if (!hasPermission) {
    return null;
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      {...buttonProps}
    >
      {children}
    </button>
  );
}

/**
 * Role-based content renderer
 * @param {Object} props
 * @param {Object} props.content - Object with role keys and content values
 * @param {React.ReactNode} props.defaultContent - Default content if no role matches
 */
export function RoleBasedContent({ content, defaultContent = null }) {
  const { user } = useAuth();

  if (!user?.roles || user.roles.length === 0) {
    return defaultContent;
  }

  // Check for exact role matches first
  for (const role of user.roles) {
    if (content[role]) {
      return content[role];
    }
  }

  // Check for role hierarchies (ADMIN can access ORGANIZER content, etc.)
  if (user.roles.includes('ADMIN')) {
    if (content.ORGANIZER) return content.ORGANIZER;
    if (content.ATTENDEE) return content.ATTENDEE;
  }

  if (user.roles.includes('ORGANIZER')) {
    if (content.ATTENDEE) return content.ATTENDEE;
  }

  return defaultContent;
}
