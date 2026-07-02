
# Smart Transportation & Logistics Management System — Build Plan

Full frontend build with all 3 roles (Customer, Driver, Admin), mock data seeded in-memory, Leaflet + OpenStreetMap for tracking. Blue/green SaaS aesthetic per spec. No backend.

## Tech & foundations

- TanStack Start (already scaffolded) + TypeScript + Tailwind v4 + shadcn/ui
- Recharts (analytics), Leaflet + react-leaflet (maps), lucide-react (icons)
- Inter font via `<link>` in `__root.tsx`
- Zustand for lightweight cross-page state (mock auth, notifications, cart of shipments)
- All data comes from `src/mocks/` seed files: 50 customers, 20 drivers, 30 vehicles, 200 shipments, notifications, analytics series
- Dark mode via `class` on `<html>`, toggle in settings + top nav
- Design tokens in `src/styles.css`: primary `#2563EB`, success `#22C55E`, warning `#F97316`, radius 16px, soft shadows

## Route architecture (`src/routes/`)

```
__root.tsx                    (providers, theme, toaster)
index.tsx                     (splash → redirect based on mock auth)
welcome.tsx
auth.login.tsx
auth.register.tsx
auth.forgot-password.tsx
auth.reset-password.tsx
auth.verify-email.tsx
auth.otp.tsx

_customer.tsx                 (layout: top nav + mobile bottom nav)
_customer.customer.tsx        (dashboard)
_customer.customer.book.tsx
_customer.customer.shipments.tsx
_customer.customer.shipments.$id.tsx
_customer.customer.track.$id.tsx
_customer.customer.payments.tsx
_customer.customer.profile.tsx
_customer.customer.support.tsx

_driver.tsx                   (layout)
_driver.driver.tsx            (dashboard)
_driver.driver.deliveries.tsx
_driver.driver.deliveries.$id.tsx
_driver.driver.earnings.tsx
_driver.driver.profile.tsx

_admin.tsx                    (sidebar layout)
_admin.admin.tsx              (dashboard)
_admin.admin.shipments.tsx
_admin.admin.drivers.tsx
_admin.admin.vehicles.tsx
_admin.admin.customers.tsx
_admin.admin.assignments.tsx
_admin.admin.reports.tsx
_admin.admin.notifications.tsx
_admin.admin.settings.tsx
```

Role gating is mock: pathless layouts check the mock auth store and redirect to `/auth/login` if role mismatch. No real security — this is a demo.

## Shared components (`src/components/`)

- `layout/` — TopNav (logo, search, notifications bell, profile menu, theme toggle), MobileBottomNav, AdminSidebar, PageHeader with breadcrumbs
- `shipment/` — ShipmentCard, ShipmentTimeline (6-step vertical), StatusBadge, VehicleCard, PriorityPicker, BookingForm (multi-step)
- `map/` — TrackingMap (Leaflet), animated truck marker moving along polyline via `setInterval`, pickup/destination pins, ETA overlay
- `analytics/` — KpiCard, RevenueChart, ShipmentsChart, DriverPerformanceTable, TopRoutesList
- `common/` — SearchBar, FilterBar, DataTable (sortable + paginated), EmptyState, LoadingSkeleton, ConfirmDialog, NotificationDrawer, FAB

## Mock data (`src/mocks/`)

- `customers.ts`, `drivers.ts`, `vehicles.ts`, `shipments.ts`, `notifications.ts`, `analytics.ts`
- `store.ts` — Zustand store wrapping the seed arrays with actions: bookShipment, updateStatus, assignDriver, addVehicle, etc. Persists to localStorage so the demo survives refresh.
- `auth.ts` — mock auth store; register/login just create a session with a chosen role. Three demo shortcut buttons on the login page ("Continue as Customer/Driver/Admin") so graders can jump in.

## Feature coverage checklist

Every section in your spec maps to one of the routes/components above:

- Auth flow (8 pages) → `auth.*` routes with form validation via zod
- Customer dashboard, KPI cards, quick actions, mobile bottom nav → `_customer.customer.tsx`
- Multi-step booking with vehicle cards, priority, live-calculated distance/ETA/cost → `_customer.customer.book.tsx`
- Shipment details + timeline + invoice download (client-side jsPDF) → `_customer.customer.shipments.$id.tsx`
- Live tracking with animated truck, route polyline, ETA/speed/traffic → `_customer.customer.track.$id.tsx`
- Driver dashboard, accept/reject, status updates with photo/signature (canvas) → `_driver.*`
- Admin dashboards for vehicles, drivers, shipments, customers, assignments → `_admin.*`
- Reports & analytics with Recharts, PDF/Excel/print export → `_admin.admin.reports.tsx`
- Notifications drawer (bell + unread badge) — same store powers all roles
- Payments module (mock methods, invoice, receipt, history) → customer payments route
- Settings (language stub, theme, notifications, password change, privacy, about)
- Help Center (FAQ accordion, live chat mock, tickets, feedback)

## Animations & polish

- Route transitions with a small fade+slide via a shared layout wrapper
- Animated KPI counters (rAF-based hook)
- Card hover lift, button shine on hover
- Recharts default animations enabled
- Skeleton loaders on first mount of each dashboard (200–400ms simulated latency)
- Toast notifications via sonner

## Out of scope for v1

- Real backend, real auth, real payments
- Real-time WebSockets (tracking animation is client-side interpolation)
- i18n beyond a language switcher stub
- Accessibility audit beyond shadcn defaults

## Delivery order (single build)

1. Design tokens, fonts, theme toggle, mock stores, seed data
2. Auth pages + role-based redirect
3. Customer flow (dashboard → book → shipments → details → tracking → payments → profile)
4. Driver flow (dashboard → deliveries → status update → earnings)
5. Admin flow (dashboard → shipments/drivers/vehicles/customers → assignments → reports → notifications → settings)
6. Help Center + final polish pass (animations, empty states, mobile check)

Given the scope, expect this to land as a large initial build with subsequent turns for refinement of specific screens.
