// industry.ts

export type Industry = {
  name: string;
  value: string; // snake_case canonical key
};

/**
 * Canonical industry list (deduped + normalized).
 * Names are human-friendly; values are stable snake_case keys.
 */
export const CANONICAL_INDUSTRIES: Industry[] = [
  { name: 'Accounting & Finance', value: 'accounting_and_finance' },
  { name: 'Art, Photography & Creative Services', value: 'art_photography_and_creative_services' },
  { name: 'Beauty & Wellness', value: 'beauty_and_wellness' },
  { name: 'Cleaning & Property Maintenance', value: 'cleaning_and_property_maintenance' },
  { name: 'Construction & Trades', value: 'construction_and_trades' },
  { name: 'Consulting & Professional Services', value: 'consulting_and_professional_services' },
  { name: 'Digital Products', value: 'digital_products' },
  { name: 'Education & Training', value: 'education_and_training' },
  { name: 'Energy & Utilities', value: 'energy_and_utilities' },
  { name: 'Entertainment & Recreation', value: 'entertainment_and_recreation' },
  { name: 'Farming & Agriculture', value: 'farming_and_agriculture' },
  { name: 'Health & Care Services', value: 'health_and_care_services' },
  { name: 'Manufacturing & Production', value: 'manufacturing_and_production' },
  { name: 'Membership Organisation', value: 'membership_organisation' },
  { name: 'Non-profit & Charity', value: 'non_profit_and_charity' },
  { name: 'Retail & Wholesale', value: 'retail_and_wholesale' },
  { name: 'Food & Beverage', value: 'food_and_beverage' },
  { name: 'Technology & Digital Services', value: 'technology_and_digital_services' },
  { name: 'Tourism & Accommodation', value: 'tourism_and_accommodation' },
  { name: 'Transport & Delivery', value: 'transport_and_delivery' },
  { name: 'Other', value: 'other' },
];

/**
 * Quick lookup from value to display name.
 */
const VALUE_TO_NAME = new Map(CANONICAL_INDUSTRIES.map(i => [i.value, i.name]));

/**
 * Aliases from both apps -> canonical values.
 * - Includes numeric codes ("100", "200", ..., "1000", "000")
 * - Includes various wording variants & slugs from both sources
 */
const ALIAS_TO_CANONICAL: Record<string, string> = {
  // Numeric codes (App A)
  '000': 'other',
  '0': 'other',
  '100': 'art_photography_and_creative_services',
  '200': 'construction_and_trades',
  '300': 'cleaning_and_property_maintenance',
  '400': 'consulting_and_professional_services',
  '500': 'education_and_training',
  '600': 'farming_and_agriculture',
  '700': 'beauty_and_wellness',
  '800': 'retail_and_wholesale',
  '900': 'transport_and_delivery',
  '1000': 'technology_and_digital_services',

  // App A label text (robust text aliases)
  'art, photography & creative services': 'art_photography_and_creative_services',
  'construction & trades': 'construction_and_trades',
  'cleaning & property maintenance': 'cleaning_and_property_maintenance',
  'consulting & professional services': 'consulting_and_professional_services',
  'education, non-profits & associations': 'education_and_training',
  'farming & agriculture': 'farming_and_agriculture',
  'hair, spa & beauty': 'beauty_and_wellness',
  'retailers, sales & food': 'retail_and_wholesale',
  'transport, travel & recreation': 'transport_and_delivery',
  'web, tech & media': 'technology_and_digital_services',
  'other': 'other',

  // App B slugs (as given)
  'building_construction_and_trade': 'construction_and_trades',
  'personal_services': 'beauty_and_wellness',
  'professional_services': 'consulting_and_professional_services',
  'transportation': 'transport_and_delivery',
  'digital_products': 'digital_products',
  'education': 'education_and_training',
  'farming_and_agriculture': 'farming_and_agriculture',
  'membership_organisation': 'membership_organisation',
  'retail_food_and_drink': 'retail_and_wholesale',
  'financial_services': 'accounting_and_finance',
  'travel_and_lodging': 'tourism_and_accommodation',
  'medical_services': 'health_and_care_services',
  'entertainment_and_recreation': 'entertainment_and_recreation',
  'regulated_and_age_restricted_products': 'retail_and_wholesale',
  'non_profit_and_charity': 'non_profit_and_charity',
  'accounting_and_finance': 'accounting_and_finance',
  'arts_and_recreation': 'entertainment_and_recreation',
  'beauty_and_wellness': 'beauty_and_wellness',
  'cleaning_and_maintenance': 'cleaning_and_property_maintenance',
  'construction_and_trades': 'construction_and_trades',
  'consulting_and_business_services': 'consulting_and_professional_services',
  'education_and_training': 'education_and_training',
  'energy_and_utilities': 'energy_and_utilities',
  'food_and_beverage': 'food_and_beverage',
  'health_and_care_services': 'health_and_care_services',
  'manufacturing_and_production': 'manufacturing_and_production',
  'retail_and_wholesale': 'retail_and_wholesale',
  'technology_and_digital_services': 'technology_and_digital_services',
  'tourism_and_accommodation': 'tourism_and_accommodation',
  'transport_and_delivery': 'transport_and_delivery',

  // App B display-name style (if ever passed)
  'building construction and trade': 'construction_and_trades',
  'retail food and drink': 'retail_and_wholesale',
  'travel and lodging': 'tourism_and_accommodation',
  'regulated and age restricted products': 'retail_and_wholesale',
  'non-profit and charity': 'non_profit_and_charity',
  'arts & recreation': 'entertainment_and_recreation',
  'cleaning & maintenance': 'cleaning_and_property_maintenance',
  'consulting & business services': 'consulting_and_professional_services',

  // Legacy fallbacks
  'technology': 'technology_and_digital_services',
  'retail': 'retail_and_wholesale',
  'healthcare': 'health_and_care_services',
  'finance': 'accounting_and_finance',
  'hospitality': 'tourism_and_accommodation',
  'manufacturing': 'manufacturing_and_production',
};

/**
 * Normalize incoming tokens (numbers, labels, slugs) to a consistent key.
 */
function normalizeToken(input: string | number): string {
  if (typeof input === 'number') return String(input);
  const s = String(input).trim();

  // if it's purely numeric, keep it (handles "900", 900)
  if (/^\d+$/.test(s)) return s.replace(/^0+$/, '0'); // "000" -> "0"

  // lower-case, collapse spaces, strip punctuation commonly seen in labels
  return s
    .toLowerCase()
    .replace(/\s*&\s*/g, ' & ')        // keep ampersands spaced
    .replace(/[,/]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Resolve any industry token (e.g., "900", "transport_and_delivery", "Construction & Trades")
 * to the canonical { name, value }. Falls back to "Other" when unknown.
 */
export function getIndustry(token: string | number | null | undefined): Industry {
  if (token == null || token === '') {
    return { name: VALUE_TO_NAME.get('other')!, value: 'other' };
  }

  const normalized = normalizeToken(token);

  // Direct hit on a canonical value?
  if (VALUE_TO_NAME.has(normalized)) {
    return { name: VALUE_TO_NAME.get(normalized)!, value: normalized };
  }

  // Known alias?
  const canonical = ALIAS_TO_CANONICAL[normalized];
  if (canonical && VALUE_TO_NAME.has(canonical)) {
    return { name: VALUE_TO_NAME.get(canonical)!, value: canonical };
  }

  // Try converting numeric like "000" → "0" mapping we added above
  if (ALIAS_TO_CANONICAL['0'] && (normalized === '000' || normalized === '0')) {
    const val = ALIAS_TO_CANONICAL['0'];
    return { name: VALUE_TO_NAME.get(val)!, value: val };
  }

  // Fallback
  return { name: VALUE_TO_NAME.get('other')!, value: 'other' };
}

/** Convenience: returns just the canonical value (or 'other'). */
export function getIndustryValue(token: string | number | null | undefined): string {
  return getIndustry(token).value;
}

/** Convenience: returns just the display name (or 'Other'). */
export function getIndustryName(token: string | number | null | undefined): string {
  return getIndustry(token).name;
}
