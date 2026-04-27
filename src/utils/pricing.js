/**
 * Pricing Utility
 * Calculates the dynamic price for a service based on area and pricing rules
 */

/**
 * Calculates the total price based on service rules and area
 * @param {Object} service - The selected service object
 * @param {number} area - The selected area in sqm
 * @param {boolean} isRecurring - Whether a recurring interval is selected
 * @returns {number} The calculated total price
 */
/**
 * Finds the most appropriate BASE rule based on service configuration and selected interval
 * @param {Object} service - The full service object
 * @param {boolean} isRecurring - Whether a recurring interval is selected
 * @returns {Object|null} The found base rule
 */
const findBaseRule = (service, isRecurring = false) => {
  const { pricingRules, allowRecurringBookings, allowOneTimeBookings } = service || {};
  if (!pricingRules || !Array.isArray(pricingRules)) return null;

  let targetType;
  if (allowRecurringBookings && !allowOneTimeBookings) {
    targetType = "RECURRING";
  } else if (allowOneTimeBookings && !allowRecurringBookings) {
    targetType = "ONE_TIME";
  } else {
    // Both true or both false — use selection-based logic
    targetType = isRecurring ? "RECURRING" : "ONE_TIME";
  }

  // 1. Try target type
  let rule = pricingRules.find(
    (r) => r.serviceType?.toUpperCase() === targetType && r.ruleType?.toUpperCase() === "BASE"
  );

  // 2. Fallback to any BASE rule if target not found
  if (!rule) {
    rule = pricingRules.find((r) => r.ruleType?.toUpperCase() === "BASE");
  }

  return rule;
};

/**
 * Calculates the total price based on service rules and area
 * @param {Object} service - The selected service object
 * @param {number} area - The selected area in sqm
 * @param {boolean} isRecurring - Whether a recurring interval is selected
 * @returns {number} The calculated total price
 */
export const calculateServicePrice = (service, area, isRecurring = false) => {
  if (!service || !service.pricingRules) return 0;

  const baseRule = findBaseRule(service, isRecurring);
  if (!baseRule) return 0;

  let totalPrice = parseFloat(baseRule.price);
  const baseAreaLimit = baseRule.maxAreaLimit;

  if (area <= baseAreaLimit) {
    return totalPrice;
  }

  // Handle step pricing for area above base limit
  const childRules = [...(baseRule.childRules || [])].sort(
    (a, b) => a.maxAreaLimit - b.maxAreaLimit
  );

  let currentBaseLimit = baseAreaLimit;

  for (let i = 0; i < childRules.length; i++) {
    const rule = childRules[i];
    const ruleLimit = rule.maxAreaLimit;
    const stepSize = rule.stepSize || 1;
    const incrementPrice = parseFloat(rule.price);

    // Calculate how much area in this rule's range
    const areaInRange = Math.min(area, ruleLimit) - currentBaseLimit;

    if (areaInRange > 0) {
      const steps = Math.ceil(areaInRange / stepSize);
      totalPrice += steps * incrementPrice;
    }

    currentBaseLimit = ruleLimit;
    if (area <= currentBaseLimit) break;
  }

  // If area exceeds the last child rule's limit
  if (area > currentBaseLimit) {
    const lastRule = childRules[childRules.length - 1];
    if (lastRule) {
      const areaBeyond = area - currentBaseLimit;
      const stepSize = lastRule.stepSize || 1;
      const incrementPrice = parseFloat(lastRule.price);
      const steps = Math.ceil(areaBeyond / stepSize);
      totalPrice += steps * incrementPrice;
    }
  }

  return totalPrice;
};

/**
 * Gets the pricing info for the current area to display in tooltip
 * @param {Object} service - The selected service object
 * @param {number} area - The selected area in sqm
 * @param {boolean} isRecurring - Whether a recurring interval is selected
 * @returns {Object} { limit, maxLimit, price, step }
 */
export const getPricingTooltipInfo = (service, area, isRecurring = false) => {
  if (!service || !service.pricingRules) return null;

  const baseRule = findBaseRule(service, isRecurring);
  if (!baseRule) return null;

  const childRules = [...(baseRule.childRules || [])].sort(
    (a, b) => a.maxAreaLimit - b.maxAreaLimit
  );

  // If area is within base limit, show info for first child (next step)
  if (area <= baseRule.maxAreaLimit) {
    const nextRule = childRules[0];
    return {
      limit: baseRule.maxAreaLimit,
      maxLimit: nextRule ? nextRule.maxAreaLimit : 500,
      price: nextRule ? parseFloat(nextRule.price) : 0,
      step: nextRule ? nextRule.stepSize : 0
    };
  }

  // Find the current active child rule
  let prevLimit = baseRule.maxAreaLimit;
  for (let i = 0; i < childRules.length; i++) {
    const rule = childRules[i];
    if (area <= rule.maxAreaLimit) {
      return {
        limit: prevLimit,
        maxLimit: rule.maxAreaLimit,
        price: parseFloat(rule.price),
        step: rule.stepSize
      };
    }
    prevLimit = rule.maxAreaLimit;
  }

  // If area is beyond all child rules
  const lastRule = childRules[childRules.length - 1];
  return {
    limit: prevLimit,
    maxLimit: 500,
    price: lastRule ? parseFloat(lastRule.price) : 0,
    step: lastRule ? lastRule.stepSize : 0
  };
};

/**
 * Gets the base price for a service (prefers ONE_TIME BASE rule, falls back to RECURRING)
 * @param {Object} service - The service object
 * @returns {number} The base price
 */
export const getServiceBasePrice = (service) => {
  if (!service) return 0;

  // For initial display, we prefer ONE_TIME but if only RECURRING exists, we must use it
  const baseRule = findBaseRule(service, false);

  const priceStr = baseRule ? baseRule.price : service.basePrice;
  const price = parseFloat(priceStr);
  return !isNaN(price) ? price : 0;
};

/**
 * Gets the total price for an extra service line based on price and quantity
 * @param {Object} extra - The extra service object from priceBreakdown.extras
 * @returns {number} The total price for this extra
 */
export const getExtraServiceTotal = (extra) => {
  if (!extra) return 0;
  const quantity = extra.quantity || 1;
  const unitPrice = parseFloat(extra.price || 0);
  return quantity * unitPrice;
};

/**
 * Formats the name of an extra service to include quantity if greater than 1
 * @param {Object} extra - The extra service object
 * @param {Function} t - The translation function
 * @returns {string} The formatted name
 */
export const formatExtraServiceName = (extra, t) => {
  if (!extra) return "";
  const baseName =
    extra.name ||
    (t
      ? t("bookingFlow.extraServiceLabel", { fallback: "Extra Service" })
      : "Extra Service");
  const quantity = extra.quantity || 1;
  const unitPrice = parseFloat(extra.price || 0);

  if (quantity > 1) {
    return `${baseName} (${quantity} x ${unitPrice.toFixed(0)})`;
  }
  return baseName;
};
