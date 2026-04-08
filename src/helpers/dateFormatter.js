/**
 * Date Formatting Utilities
 * Helper functions for consistent date formatting across the application
 */

/**
 * Format date to long format (e.g., "Monday, December 22, 2025" or "Torsdag 19. mars 2026")
 * @param {Date} date - Date object to format
 * @param {string} lang - Optional language code ('en' or 'no')
 * @returns {string} Formatted date string
 */
export const formatLongDate = (dateInput, lang = '') => {
  if (!dateInput) return "";

  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (!(date instanceof Date) || isNaN(date)) {
    return "";
  }

  const currentLang = lang || (typeof document !== 'undefined' ? document.documentElement.lang : 'no');
  const locale = currentLang === 'no' ? 'no-NO' : 'en-US';

  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  // If it's a string from API (likely ISO), use UTC to avoid day-shifting
  if (typeof dateInput === 'string' && (dateInput.includes('T') || dateInput.includes('Z') || dateInput.match(/^\d{4}-\d{2}-\d{2}$/))) {
    options.timeZone = 'UTC';
  }

  let formattedDate = date.toLocaleDateString(locale, options);

  // For Norwegian, make sure day/month order and format is correct (e.g., "Torsdag 19. mars 2026")
  if (currentLang === 'no') {
    // Standard no-NO toLocaleDateString might be "torsdag 19. mars 2026"
    // We want to capitalize the first letter
    formattedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
  }

  return formattedDate;
};

/**
 * Format date to month and year (e.g., "December 2025" or "Desember 2025")
 * @param {Date|import('dayjs').Dayjs|string} dateInput - Date object, Dayjs instance, or string to format
 * @param {string} lang - Optional language code ('en' or 'no')
 * @returns {string} Formatted month and year string
 */
export const formatMonthYear = (dateInput, lang = '') => {
  if (!dateInput) return "";

  let date;
  let useUTC = false;

  if (typeof dateInput === 'string') {
    date = new Date(dateInput);
    useUTC = dateInput.includes('T') || dateInput.includes('Z') || !!dateInput.match(/^\d{4}-\d{2}-\d{2}$/);
  } else if (dateInput.toDate) {
    date = dateInput.toDate();
  } else {
    date = new Date(dateInput);
  }

  if (!(date instanceof Date) || isNaN(date)) return "";

  const currentLang = lang || (typeof document !== 'undefined' ? document.documentElement.lang : 'no');
  const locale = currentLang === 'no' ? 'no-NO' : 'en-US';

  const options = {
    year: "numeric",
    month: "long",
    ...(useUTC ? { timeZone: 'UTC' } : {})
  };

  let formattedDate = date.toLocaleDateString(locale, options);

  if (currentLang === 'no') {
    formattedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
  }

  return formattedDate;
};

/**
 * Check if a date is in the past
 * @param {Date} date - Date to check
 * @returns {boolean} True if date is before today
 */
export const isPastDate = (date) => {
  if (!date || !(date instanceof Date)) {
    return false;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const checkDate = new Date(date);
  checkDate.setHours(0, 0, 0, 0);

  return checkDate < today;
};

/**
 * Check if two dates are the same day
 * @param {Date} date1 - First date
 * @param {Date} date2 - Second date
 * @returns {boolean} True if dates are the same day
 */
export const isSameDay = (date1, date2) => {
  if (!date1 || !date2) {
    return false;
  }

  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};
