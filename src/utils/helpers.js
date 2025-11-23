/**
 * Utility helper functions for TechyRide
 */

/**
 * Generate a unique ID using crypto-based random values
 * Falls back to timestamp-based ID if crypto is not available
 * @returns {string} Unique identifier
 */
export const generateUniqueId = () => {
  try {
    // Try to use crypto for better randomness
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    
    // Fallback: Generate a random ID using timestamp and random values
    const timestamp = Date.now().toString(36);
    const randomPart = Math.random().toString(36).substring(2, 15);
    return `${timestamp}-${randomPart}`;
  } catch (error) {
    // Final fallback to timestamp
    return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  }
};

/**
 * Validate email format
 * @param {string} email - Email address to validate
 * @returns {boolean} True if valid email format
 */
export const validateEmail = (email) => {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailPattern.test(email);
};

/**
 * Validate UPI ID format
 * @param {string} upiId - UPI ID to validate
 * @returns {boolean} True if valid UPI ID format
 */
export const validateUpiId = (upiId) => {
  const upiPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/;
  return upiPattern.test(upiId);
};

/**
 * Format currency for display
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount) => {
  return `₹${Math.round(amount).toLocaleString('en-IN')}`;
};

/**
 * Format date for display
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

/**
 * Format time for display
 * @param {string|Date} date - Date/time to format
 * @returns {string} Formatted time string
 */
export const formatTime = (date) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });
};
