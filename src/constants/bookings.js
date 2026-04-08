/**
 * Booking status constants for the KLYRA web app.
 */

export const BookingStatus = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  EXPIRED: 'EXPIRED',
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
};

export const BookingStatusColors = {
  PENDING: '#FAAD14',
  CONFIRMED: '#297160',
  IN_PROGRESS: '#1890FF',
  COMPLETED: '#1890FF',
  CANCELLED: '#FF4D4F',
  EXPIRED: '#8c8c8c',
  ACTIVE: '#52C41A',
  INACTIVE: '#8c8c8c',
};

// Based on screenshot 3: 
// "Booked" (Confirmed) has a teal header.
// "Completed" has a yellow header.
// Actually, let's look closer at the screenshots.
  