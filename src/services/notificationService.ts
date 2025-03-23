// API Base URL - replace with environment variable in production
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

/**
 * Interface for notification recipient
 */
interface NotificationRecipient {
  address: string;
  email?: string;
  name?: string;
}

/**
 * Types of notifications
 */
export enum NotificationType {
  CAPSULE_CREATED = 'CAPSULE_CREATED',
  WITNESS_INVITATION = 'WITNESS_INVITATION',
  CAPSULE_READY = 'CAPSULE_READY',
  SIGNATURE_REQUIRED = 'SIGNATURE_REQUIRED',
  CAPSULE_OPENED = 'CAPSULE_OPENED'
}

/**
 * Interface for notification payload
 */
interface NotificationPayload {
  type: NotificationType;
  recipients: NotificationRecipient[];
  capsuleId: number | string;
  message?: string;
  data?: any;
}

/**
 * Sends invitations to witnesses for a multisig capsule
 * @param witnesses - List of witnesses to invite
 * @param capsuleId - ID of the capsule
 * @returns Response from the notification service
 */
export const sendInvitations = async (
  witnesses: NotificationRecipient[],
  capsuleId: number | string
) => {
  try {
    const payload: NotificationPayload = {
      type: NotificationType.WITNESS_INVITATION,
      recipients: witnesses,
      capsuleId,
      message: 'You have been invited to witness a time capsule'
    };

    return await sendNotification(payload);
  } catch (error) {
    console.error("Error sending witness invitations:", error);
    throw error;
  }
};

/**
 * Notifies recipients that a capsule is ready to be opened
 * @param recipients - List of recipients to notify
 * @param capsuleId - ID of the capsule
 * @returns Response from the notification service
 */
export const notifyCapsuleReady = async (
  recipients: NotificationRecipient[],
  capsuleId: number | string
) => {
  try {
    const payload: NotificationPayload = {
      type: NotificationType.CAPSULE_READY,
      recipients,
      capsuleId,
      message: 'Your time capsule is ready to be opened'
    };

    return await sendNotification(payload);
  } catch (error) {
    console.error("Error notifying capsule ready:", error);
    throw error;
  }
};

/**
 * Requests signatures from witnesses for a multisig capsule
 * @param witnesses - List of witnesses to request signatures from
 * @param capsuleId - ID of the capsule
 * @returns Response from the notification service
 */
export const requestSignatures = async (
  witnesses: NotificationRecipient[],
  capsuleId: number | string
) => {
  try {
    const payload: NotificationPayload = {
      type: NotificationType.SIGNATURE_REQUIRED,
      recipients: witnesses,
      capsuleId,
      message: 'Your signature is required to open a time capsule'
    };

    return await sendNotification(payload);
  } catch (error) {
    console.error("Error requesting signatures:", error);
    throw error;
  }
};

/**
 * Notifies recipients that a capsule has been opened
 * @param recipients - List of recipients to notify
 * @param capsuleId - ID of the capsule
 * @returns Response from the notification service
 */
export const notifyCapsuleOpened = async (
  recipients: NotificationRecipient[],
  capsuleId: number | string
) => {
  try {
    const payload: NotificationPayload = {
      type: NotificationType.CAPSULE_OPENED,
      recipients,
      capsuleId,
      message: 'A time capsule has been opened'
    };

    return await sendNotification(payload);
  } catch (error) {
    console.error("Error notifying capsule opened:", error);
    throw error;
  }
};

/**
 * Generic function to send a notification
 * @param payload - Notification payload
 * @returns Response from the notification service
 */
const sendNotification = async (payload: NotificationPayload) => {
  try {
    // Use Blockchain notification if available for relevant addresses
    await sendBlockchainNotification(payload);

    // Use Email notification if available for relevant addresses
    await sendEmailNotification(payload);

    return { success: true };
  } catch (error) {
    console.error("Error sending notification:", error);
    throw error;
  }
};

/**
 * Sends notifications via blockchain (for addresses with on-chain subscriptions)
 * @param payload - Notification payload
 * @returns Response from the blockchain notification service
 */
const sendBlockchainNotification = async (payload: NotificationPayload) => {
  try {
    // Filter recipients that have blockchain addresses
    const blockchainRecipients = payload.recipients.filter(r => r.address);
    
    if (blockchainRecipients.length === 0) return;

    const response = await fetch(`${API_BASE_URL}/notifications/blockchain`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...payload,
        recipients: blockchainRecipients
      }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error sending blockchain notification:", error);
    // Don't throw here, try other methods
  }
};

/**
 * Sends notifications via email
 * @param payload - Notification payload
 * @returns Response from the email notification service
 */
const sendEmailNotification = async (payload: NotificationPayload) => {
  try {
    // Filter recipients that have email addresses
    const emailRecipients = payload.recipients.filter(r => r.email);
    
    if (emailRecipients.length === 0) return;

    const response = await fetch(`${API_BASE_URL}/notifications/email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...payload,
        recipients: emailRecipients
      }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error sending email notification:", error);
    // Don't throw here, try other methods
  }
};

/**
 * Subscribes to notifications for a specific capsule
 * @param capsuleId - ID of the capsule
 * @param address - Blockchain address
 * @param email - Email address (optional)
 * @returns Response from the subscription service
 */
export const subscribeToNotifications = async (
  capsuleId: number | string,
  address: string,
  email?: string
) => {
  try {
    const response = await fetch(`${API_BASE_URL}/notifications/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        capsuleId,
        address,
        email
      }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error subscribing to notifications:", error);
    throw error;
  }
};

/**
 * Unsubscribes from notifications for a specific capsule
 * @param capsuleId - ID of the capsule
 * @param address - Blockchain address
 * @returns Response from the unsubscription service
 */
export const unsubscribeFromNotifications = async (
  capsuleId: number | string,
  address: string
) => {
  try {
    const response = await fetch(`${API_BASE_URL}/notifications/unsubscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        capsuleId,
        address
      }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error unsubscribing from notifications:", error);
    throw error;
  }
};
