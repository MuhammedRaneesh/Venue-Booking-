# PRD: Admin Management System

## Overview
Build a comprehensive administration portal for the venue booking platform (Venuo) to manage users, venue listings, category taxonomies, owner onboarding applications, platform bookings, and revenue analytics.

## Task 1: Authentication & Access Control
Implement role-based administration access and session control.
- Protected admin routes restricted to `admin` role (`/admin/*`)
- Sidebar layout with dynamic page title and notification bell
- Real-time socket notification connection
- POST /api/auth/logout with token cleanup and cache invalidation

## Task 2: Dashboard Overview & Analytics
Implement high-level KPI aggregation and recent activity tracking.
- GET /api/admin/dashboard/summary?period={all|this_month|this_year}
- Metrics cards: Total Users, Total Venues, Total Bookings, and Total Revenue with platform fee calculations
- Action alerts: Pending Owner Applications counter, Pending Venues counter
- Recent Bookings overview table with status badges and quick navigation to bookings

## Task 3: User Management
Build user directory with account moderation controls.
- GET /api/admin/users/allusers with pagination (`page`, `limit`)
- Search users by name or email
- Filter users by role (`user`, `venue_owner`, `admin`)
- Filter users by status (`active`, `blocked`)
- PATCH /api/admin/users/:id/status-change (block / unblock account)
- GET /api/admin/users/:id/details (view user profile, contact details, and account creation date)

## Task 4: Category Management
Implement venue category and occasion taxonomy management.
- GET /api/categories/admin-categori with pagination, search, and status filters
- POST /api/categories (create category with name, description, image upload, and status)
- PATCH /api/categories/:id (update category details and banner image)
- DELETE /api/categories/:id (delete category with linked-venue safety check)
- PATCH /api/categories/:id/toggle-status (toggle category active/inactive status)

## Task 5: Venue Management & Moderation
Build venue catalog review and listing moderation workflow.
- GET /api/admin/venues with pagination
- Search venues by name or city
- Filter venues by approval status (`pending`, `approved`, `rejected`, `suspended`)
- Filter venues by operational status (`active`, `inactive`)
- Filter venues by category and Kerala district
- GET /api/admin/venues/:id (detailed modal with photo gallery, amenities, capacity, pricing, and owner details)
- PATCH /api/admin/venues/:id/status (approve venue or reject venue with mandatory rejection reason)
- PATCH /api/admin/venues/:id/toggle-status (activate/deactivate venue listing)

## Task 6: Venue Owner Applications
Implement verification and onboarding approval pipeline for prospective venue owners.
- GET /api/admin/owner-applications with pagination
- Search applications by business name, applicant name, email, or phone
- Filter applications by review status (`PENDING`, `APPROVED`, `REJECTED`, `ALL`)
- GET /api/admin/owner-applications/:id (review business details, address, city, state, pincode, and GSTIN)
- PATCH /api/admin/owner-applications/:id (approve application to grant `venue_owner` role, or reject application with rejection reason)

## Task 7: Booking Management
Build centralized reservation tracking and dispute/status management.
- GET /api/admin/bookings with pagination
- Filter bookings by status (`pending`, `approved`, `rejected`, `cancelled`, `completed`, `expired`)
- Filter bookings by payment status (`unpaid`, `fully_paid`, `refunded`)
- Date range filtering (`startDate`, `endDate`) with calendar date picker popovers
- Booking details inspection (customer details, venue details, event dates, pricing, platform fee, and payment records)

