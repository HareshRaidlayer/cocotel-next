# Next.js Route Structure Implementation

## Overview
This implementation creates a Laravel-style URL structure for your Next.js hotel booking application using dynamic routes.

## Route Structure

### 1. Hotel Details Routes
- **Simple Hotel Page**: `/ph/rsam-beach-resort-by-cocotel`
- **Hotel with Booking Params**: `/ph/rsam-beach-resort-by-cocotel/23-03-2026/25-03-2026/1/2/0`

### 2. Booking Routes
- **Booking with Popup Open**: `/ph/3/3/1/23-03-2026/25-03-2026/2/0/0`
- **Booking with Full Details**: `/ph/3/3/2/2026-03-23/2026-03-25/2/0/0/jayashri/patil/test@gmail.com/9582587425/1`

## File Structure

```
src/app/[locale]/
├── [...params]/
│   └── page.tsx          # Catch-all dynamic route handler
├── [slug]/
│   ├── page.tsx          # Hotel details page
│   └── HotelPageClient.tsx
├── booking/
│   └── page.tsx          # Booking page (moved from [slug]/booking/)
└── test-routes/
    └── page.tsx          # Test page for route verification
```

## Route Logic

### Catch-all Route (`[...params]/page.tsx`)
Handles all dynamic URL patterns and determines the appropriate action:

1. **Pattern 1** (1 param): Hotel slug only → Render hotel details
2. **Pattern 2** (6 params): Hotel slug + booking params → Render hotel details with params
3. **Pattern 3** (8 params): Booking with popup → Redirect to booking page with popup=1
4. **Pattern 4** (14 params): Booking with full details → Redirect to booking page with all params

### Hotel Details (`[slug]/page.tsx`)
Handles traditional hotel detail pages with optional search parameters.

### Booking Page (`booking/page.tsx`)
Moved to locale level to handle all booking requests via query parameters.

## Parameter Mapping

### Hotel Details with Params
- `slug`: Hotel slug (e.g., "rsam-beach-resort-by-cocotel")
- `checkin`: Check-in date (DD-MM-YYYY)
- `checkout`: Check-out date (DD-MM-YYYY)
- `rooms`: Number of rooms
- `guests`: Number of guests
- `children`: Number of children

### Booking Parameters
- `roomid`: Room ID
- `hotelid`: Hotel ID
- `noofroom`: Number of rooms
- `checkin`: Check-in date
- `checkout`: Check-out date
- `no_of_guests`: Number of guests
- `noofchild`: Number of children
- `withbreakfast`: Breakfast option (0/1)
- `firstname`: Guest first name (optional)
- `lastname`: Guest last name (optional)
- `email`: Guest email (optional)
- `phone`: Guest phone (optional)
- `popup`: Show modal (0/1)

## Navigation Updates

### From Hotel Page to Booking
Updated `HotelPageClient.tsx` to use new route structure:
```typescript
router.push(`/${locale}/booking?${params.toString()}`);
```

### URL Parameter Handling
Booking page now reads parameters from URL search params instead of path segments.

## Testing

Visit `/ph/test-routes` to see route analysis and verify the implementation works correctly.

## Benefits

1. **Laravel-style URLs**: Clean, SEO-friendly URLs matching your Laravel backend
2. **Flexible Routing**: Handles multiple URL patterns with single catch-all route
3. **Backward Compatibility**: Existing hotel detail pages continue to work
4. **Clean Architecture**: Separates concerns between hotel details and booking
5. **Easy Maintenance**: Centralized route logic in catch-all handler

## Migration Notes

- Old booking routes (`/[locale]/[slug]/booking`) are removed
- Booking functionality moved to `/[locale]/booking`
- Hotel page navigation updated to use new structure
- All existing hotel detail functionality preserved