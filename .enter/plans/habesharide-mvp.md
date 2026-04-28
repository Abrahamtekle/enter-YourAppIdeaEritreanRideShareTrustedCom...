# HabeshaRide MVP — Implementation Plan

## Context
Build a trusted, community-first ride-sharing app for the Eritrean diaspora in Canada. It's a carpool marketplace (not a live GPS app) where drivers post scheduled rides and passengers book seats. Trust and community feel are the core differentiators.

This is a **frontend MVP** with realistic mock data, structured so that connecting a real backend (Enter Cloud) is easy as a next step.

---

## Design System
**Colors:** Deep Green (#1B6B3A) as primary, Warm Gold (#C9920A) as accent — Eritrean flag-inspired.

**Updates to:**
- `src/index.css` — new CSS variables (green/gold palette, trust badge tokens, chat bubble tokens, gradients, animations)
- `tailwind.config.ts` — add custom color tokens (trust, surface-brand, bubble colors, star-active)
- Install `Plus Jakarta Sans` font via Google Fonts in `index.html`

---

## File Structure

```
src/
├── data/
│   └── mockData.ts           # All mock rides, users, chats, bookings
├── types/
│   └── index.ts              # TypeScript types: User, Ride, Booking, Message, Chat
├── context/
│   └── AppContext.tsx         # Global state: currentUser, rides, chats, bookings
├── components/
│   ├── ui/                   # (existing shadcn components, customized)
│   ├── BottomNav.tsx         # Fixed bottom nav (Home, Post, Chat, Profile)
│   ├── RideCard.tsx          # Ride listing card with trust strip
│   ├── StarRating.tsx        # Star display component
│   ├── VerifiedBadge.tsx     # "Eritrean Community Verified" pill
│   ├── PhoneVerifiedBadge.tsx
│   └── AppShell.tsx          # Layout wrapper: top bar + bottom nav + scrollable content
├── pages/
│   ├── Home.tsx              # Hero + search (From / To / Date)
│   ├── RidesList.tsx         # Search results list
│   ├── RideDetail.tsx        # Full ride info + booking CTA + reviews
│   ├── PostRide.tsx          # 4-step form to post a ride
│   ├── ChatList.tsx          # All conversations
│   ├── ChatThread.tsx        # Individual chat with bubbles
│   ├── Profile.tsx           # Own profile (avatar, verified, rating, history)
│   ├── Login.tsx             # Phone number sign in
│   └── Signup.tsx            # Register + profile setup
└── router.tsx                # Updated with all routes
```

---

## Routes
| Path | Component |
|------|-----------|
| `/` | `Home` |
| `/rides` | `RidesList` (query params: from, to, date) |
| `/rides/:id` | `RideDetail` |
| `/post-ride` | `PostRide` |
| `/chat` | `ChatList` |
| `/chat/:id` | `ChatThread` |
| `/profile` | `Profile` |
| `/profile/:id` | `Profile` (view others) |
| `/login` | `Login` |
| `/signup` | `Signup` |

---

## Mock Data (no backend required for MVP)
- 3 sample users with avatars (placeholder images), verified status, ratings
- 5 sample rides (Calgary→Edmonton, Calgary→Red Deer, etc.)
- 2 sample chat conversations with messages
- 2 sample bookings

---

## Key Components Detail

### BottomNav
- 4 tabs: Home (MapPin), Post (Plus), Chat (MessageCircle), Profile (User)
- Active tab: white icon + gold dot indicator
- Background: `bg-surface-brand` (deep green)
- Hidden on /login and /signup

### RideCard
- Avatar with verified checkmark overlay
- Route: "Calgary → Edmonton" bold
- Date, seats remaining, price/seat
- Gold trust badge strip at bottom

### AppShell
- Top bar: app name "HabeshaRide" + notification bell (only when logged in)
- Bottom: BottomNav
- Scrollable content area between them

### Home Page
- Hero: gradient background (green), tagline "Ride Together. Trust Together."
- From/To city selectors with swap button
- Date picker
- "Find Rides" CTA button
- Featured rides below search (3 cards)

### PostRide (4-step form)
- Step 1: From city → To city (dropdown of major Canadian cities)
- Step 2: Date + departure time
- Step 3: Price per seat + seats available + optional notes
- Step 4: Review preview card → Publish

### ChatThread
- Messages list with incoming/outgoing bubbles
- Green bubbles (outgoing), white bubbles (incoming)
- Fixed input bar at bottom

### Profile
- Avatar (large, with edit button)
- Name + "Eritrean Community Verified" badge
- Phone verified chip
- Star rating display
- Tabs: "My Rides" (posted) / "Booked Rides" (taken)

---

## Customized shadcn Components
- `Button`: add `accent` variant (gold background, dark text) and `ghost-brand` variant
- `Badge`: add `trust`, `verified`, `phone` variants

---

## Implementation Order
1. Design tokens (index.css + tailwind.config.ts + font)
2. Types (types/index.ts)
3. Mock data (data/mockData.ts)
4. AppContext (context/AppContext.tsx)
5. Shared components (BottomNav, RideCard, StarRating, VerifiedBadge, AppShell)
6. Customize Button + Badge variants
7. Pages in order: Home → RidesList → RideDetail → PostRide → ChatList → ChatThread → Profile → Login → Signup
8. Router update

---

## Verification
- Home search → navigates to /rides with query params
- Ride card click → opens RideDetail
- PostRide 4 steps flow → "Publish" adds ride to context
- Chat list → click opens thread with bubble messages
- Profile shows ride history tabs
- BottomNav highlights active tab
- Responsive: mobile (375px), tablet (768px), desktop (1024px)
