/**
 * useServicePricing Hook
 * Provides dynamic price calculation and tooltip info for the current booking state
 */

import { useTranslation } from "@/hooks/useTranslation";
import { calculateServicePrice, getPricingTooltipInfo } from "@/utils/pricing";
import { useMemo } from "react";
import { useSelector } from "react-redux";

export const useServicePricing = () => {
  const selectedService = useSelector((state) => state.booking.selectedService);
  const areaSqm = useSelector((state) => state.booking.areaSqm);
  const recurringInterval = useSelector((state) => state.booking.recurringInterval);
  const { t } = useTranslation();

  const currentPrice = useMemo(() => {
    return calculateServicePrice(selectedService, areaSqm, !!recurringInterval);
  }, [selectedService, areaSqm, recurringInterval]);

  const areaTooltipContent = useMemo(() => {
    const info = getPricingTooltipInfo(selectedService, areaSqm, !!recurringInterval);
    if (!info || info.price === 0) {
      const limit = selectedService?.pricingRules?.find(r => r.ruleType === 'BASE')?.maxAreaLimit || 50;
      let msg = t('bookingFlow.basePriceCoversUpTo', { fallback: "The base price covers up to {limit} sqm." });
      return msg.replace('{limit}', limit);
    }

    if (areaSqm <= info.limit) {
      let msg = t('bookingFlow.basePriceCoversAddPrice', { fallback: "The base price covers up to {limit} sqm. Each additional {step} sqm will add {price} NOK to the price." });
      return msg.replace('{limit}', info.limit).replace('{step}', info.step).replace('{price}', info.price);
    }

    let msg = t('bookingFlow.basePriceCoversExceeded', { fallback: "The base price covers up to {limit} sqm. In this range (up to {maxLimit} sqm), an additional {price} NOK is added for every {step} sqm exceeded." });
    return msg.replace('{limit}', info.limit).replace('{maxLimit}', info.maxLimit).replace('{price}', info.price).replace('{step}', info.step);
  }, [selectedService, areaSqm, recurringInterval, t]);

  return {
    currentPrice,
    areaTooltipContent,
    selectedService,
    areaSqm,
    isRecurring: !!recurringInterval,
    recurringInterval
  };
};
