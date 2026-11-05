/**
 * Discount calculation utility
 * Priority: Product discount > Global discount > Original price
 * Never stack discounts.
 */

export interface ProductDiscount {
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
}

export interface GlobalDiscount {
  id: string;
  is_active?: boolean;
  isEnabled?: boolean;
  discount_type?: 'percentage' | 'fixed';
  discount_value?: number;
  type?: 'percentage' | 'fixed';
  value?: number;
  apply_to?: 'all' | 'categories';
  applyTo?: string;
  category_ids?: string[] | null;
  categoryIds?: string[] | null;
  start_date?: string;
  end_date?: string;
  startDate?: string;
  endDate?: string;
}

export function calculateFinalPrice(
  basePrice: number,
  productDiscount: ProductDiscount | null | undefined,
  globalDiscount: GlobalDiscount | null | undefined,
  categoryId?: string
): { finalPrice: number; discountAmount: number; appliedDiscount: 'product' | 'global' | null } {
  const now = new Date().toISOString();

  const pdType = productDiscount?.discount_type;
  const pdValue = productDiscount?.discount_value;
  if (pdType && pdValue !== undefined) {
    const discountAmount =
      pdType === 'percentage'
        ? basePrice * (pdValue / 100)
        : pdValue;
    return {
      finalPrice: Math.max(0, basePrice - discountAmount),
      discountAmount,
      appliedDiscount: 'product',
    };
  }

  const gdActive = globalDiscount?.is_active ?? globalDiscount?.isEnabled;
  const gdStart = globalDiscount?.start_date ?? globalDiscount?.startDate;
  const gdEnd = globalDiscount?.end_date ?? globalDiscount?.endDate;
  const gdApplyTo = globalDiscount?.apply_to ?? globalDiscount?.applyTo;
  const gdCategoryIds = globalDiscount?.category_ids ?? globalDiscount?.categoryIds;
  const gdType = globalDiscount?.discount_type ?? globalDiscount?.type;
  const gdValue = globalDiscount?.discount_value ?? globalDiscount?.value;

  if (gdActive && gdStart && gdEnd && gdStart <= now && gdEnd >= now) {
    const applies =
      gdApplyTo === 'all' ||
      (gdApplyTo === 'categories' && categoryId && gdCategoryIds?.includes(categoryId));

    if (applies && gdType && gdValue !== undefined) {
      const discountAmount =
        gdType === 'percentage'
          ? basePrice * (gdValue / 100)
          : gdValue;
      return {
        finalPrice: Math.max(0, basePrice - discountAmount),
        discountAmount,
        appliedDiscount: 'global',
      };
    }
  }

  return {
    finalPrice: basePrice,
    discountAmount: 0,
    appliedDiscount: null,
  };
}
