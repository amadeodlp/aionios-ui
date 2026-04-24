// Notification service — backend replaced by Supabase.
// Email/blockchain notifications are no-ops for now.
// Replace with Supabase Edge Functions or a third-party service when needed.

export enum NotificationType {
  CAPSULE_CREATED    = 'CAPSULE_CREATED',
  WITNESS_INVITATION = 'WITNESS_INVITATION',
  CAPSULE_READY      = 'CAPSULE_READY',
  SIGNATURE_REQUIRED = 'SIGNATURE_REQUIRED',
  CAPSULE_OPENED     = 'CAPSULE_OPENED',
}

const noop = async () => ({ success: true });

export const sendInvitations           = noop;
export const notifyCapsuleReady        = noop;
export const requestSignatures         = noop;
export const notifyCapsuleOpened       = noop;
export const subscribeToNotifications  = noop;
export const unsubscribeFromNotifications = noop;
