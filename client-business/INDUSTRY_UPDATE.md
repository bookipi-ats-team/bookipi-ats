# Industry Management Update ✨

## Overview
Updated the ATS to use a canonical industry list with comprehensive alias support. This ensures consistent industry handling across the platform and supports legacy numeric codes and various naming formats.

---

## What's New

### 1. **Canonical Industry List** (`/src/utils/industry.ts`)

21 standardized industries with snake_case values:
- Accounting & Finance
- Art, Photography & Creative Services
- Beauty & Wellness
- Cleaning & Property Maintenance
- Construction & Trades
- Consulting & Professional Services
- Digital Products
- Education & Training
- Energy & Utilities
- Entertainment & Recreation
- Farming & Agriculture
- Health & Care Services
- Manufacturing & Production
- Membership Organisation
- Non-profit & Charity
- Retail & Wholesale
- Food & Beverage
- Technology & Digital Services
- Tourism & Accommodation
- Transport & Delivery
- Other

### 2. **Alias Resolution System**

Automatically converts legacy formats to canonical values:

#### Numeric Codes (App A)
```typescript
'900' → 'transport_and_delivery'
'1000' → 'technology_and_digital_services'
'700' → 'beauty_and_wellness'
// ... etc
```

#### Various Text Formats
```typescript
'Transport & Delivery' → 'transport_and_delivery'
'transportation' → 'transport_and_delivery'
'travel_and_lodging' → 'tourism_and_accommodation'
'Technology' → 'technology_and_digital_services'
// ... and many more
```

### 3. **Updated Components**

✅ **OnboardingPage**
- Industry dropdown with all 21 canonical options
- Query parameter alias resolution (e.g., `?industry=900` → Transport & Delivery)
- Pre-fills with resolved canonical value

✅ **NewJobPage**
- Added industry dropdown (3-column layout)
- Pre-fills with business industry
- Defaults to 'Technology & Digital Services'

✅ **EditJobPage**
- Industry dropdown with current value pre-selected
- 3-column layout for better UX

✅ **JobSummaryPage**
- Displays human-friendly industry names
- Uses `getIndustryName()` utility

✅ **Mock Data**
- Updated to use canonical values (`technology_and_digital_services`)

---

## Utility Functions

### `getIndustry(token)`
Resolves any format to canonical `{ name, value }` object:
```typescript
getIndustry('900')
// → { name: 'Transport & Delivery', value: 'transport_and_delivery' }

getIndustry('technology')
// → { name: 'Technology & Digital Services', value: 'technology_and_digital_services' }

getIndustry('construction & trades')
// → { name: 'Construction & Trades', value: 'construction_and_trades' }
```

### `getIndustryValue(token)`
Returns just the canonical value:
```typescript
getIndustryValue('900') // → 'transport_and_delivery'
getIndustryValue('Technology') // → 'technology_and_digital_services'
```

### `getIndustryName(token)`
Returns just the display name:
```typescript
getIndustryName('transport_and_delivery') // → 'Transport & Delivery'
getIndustryName('900') // → 'Transport & Delivery'
```

---

## Query Parameter Examples

### Onboarding URL with Prefill

#### Using Numeric Code
```
https://bookipi-ats-business.vercel.app/onboarding?name=My+Business&industry=900
```
✅ Industry auto-resolves to "Transport & Delivery"

#### Using Snake Case
```
https://bookipi-ats-business.vercel.app/onboarding?name=My+Business&industry=transport_and_delivery
```
✅ Industry displays as "Transport & Delivery"

#### Using Legacy Format
```
https://bookipi-ats-business.vercel.app/onboarding?name=Tech+Co&industry=technology
```
✅ Industry auto-resolves to "Technology & Digital Services"

---

## API Integration

### Business Creation
```typescript
POST /business
Body: {
  name: "My Business",
  industry: "transport_and_delivery"  // Always use canonical value
}
```

### Job Creation/Update
```typescript
POST /jobs
Body: {
  businessId: "b-1",
  title: "Delivery Driver",
  industry: "transport_and_delivery"  // Canonical value
  // ... other fields
}
```

---

## Migration Guide

### For Existing Data

If you have existing businesses/jobs with old industry values:

1. **On Display**: Use `getIndustryName()`
   ```typescript
   <div>{getIndustryName(job.industry)}</div>
   ```

2. **On Save**: Values are automatically normalized
   ```typescript
   // Input: "900" or "Technology" or "transport_and_delivery"
   // Stored: "transport_and_delivery" (canonical)
   ```

3. **No Migration Needed**: Old values resolve automatically through alias system

---

## Supported Formats

The system recognizes:

1. ✅ **Canonical Values**: `transport_and_delivery`, `technology_and_digital_services`
2. ✅ **Numeric Codes**: `0`, `100`, `200`, ..., `1000`
3. ✅ **Display Names**: `Transport & Delivery`, `Technology & Digital Services`
4. ✅ **Snake Case Variants**: `retail_food_and_drink`, `building_construction_and_trade`
5. ✅ **Legacy Names**: `Technology`, `Retail`, `Healthcare`, `Finance`
6. ✅ **Alternative Formats**: `transportation`, `medical_services`, `financial_services`

---

## Testing

### Manual Test Cases

#### Onboarding with Aliases
- [ ] Visit `/onboarding?industry=900` → Should pre-select "Transport & Delivery"
- [ ] Visit `/onboarding?industry=technology` → Should pre-select "Technology & Digital Services"
- [ ] Visit `/onboarding?industry=transport_and_delivery` → Should pre-select "Transport & Delivery"

#### Job Creation
- [ ] Create job → Select industry from dropdown → Verify canonical value saved
- [ ] Edit job → Industry pre-selected correctly → Update works

#### Display
- [ ] Job summary shows human-friendly name (not snake_case)
- [ ] Jobs list shows proper industry names

---

## Benefits

1. **🔄 Backward Compatible**: All legacy formats supported
2. **📝 Standardized**: One canonical list for entire app
3. **🎯 User-Friendly**: Shows nice names, stores stable values
4. **🔗 URL-Safe**: Works with query parameters
5. **🌐 Multi-Source**: Handles formats from different systems
6. **🛡️ Type-Safe**: Full TypeScript support

---

## Files Modified

✅ **Created**:
- `/src/utils/industry.ts` - Industry utilities and canonical list

✅ **Updated**:
- `/src/pages/OnboardingPage.tsx` - Added alias resolution for query params
- `/src/pages/NewJobPage.tsx` - Added industry dropdown, 3-column layout
- `/src/pages/EditJobPage.tsx` - Added industry dropdown, 3-column layout
- `/src/pages/JobSummaryPage.tsx` - Use `getIndustryName()` for display
- `/src/api/mockData.ts` - Updated to use canonical values

---

## Next Steps

1. **Deploy**: Push changes to trigger Vercel rebuild
2. **Test**: Try various query parameters on onboarding
3. **Data Audit**: Review existing business/job data for industry values
4. **Backend**: Ensure API accepts canonical snake_case values

---

## Example Usage in Code

```typescript
import { 
  CANONICAL_INDUSTRIES, 
  getIndustry, 
  getIndustryValue, 
  getIndustryName 
} from '../utils/industry';

// Dropdown options
<select>
  {CANONICAL_INDUSTRIES.map(industry => (
    <option value={industry.value}>{industry.name}</option>
  ))}
</select>

// Resolve from URL
const industryParam = searchParams.get('industry');
const canonical = getIndustryValue(industryParam); // Always get canonical value

// Display
const displayName = getIndustryName(job.industry); // Always get nice name
```

---

**Status**: ✅ Complete and Ready to Deploy

All industry handling is now centralized, consistent, and supports legacy formats seamlessly! 🎉
