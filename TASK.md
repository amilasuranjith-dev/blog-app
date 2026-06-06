# TASKS.md — Simple Blog Publication App

## Project Overview
A blog publication app built with Next.js, Supabase, and Stripe.
- **Admin (owner)** can create, edit, and delete posts (free + premium)
- **Readers** can view free posts publicly and subscribe for premium content
- **Stripe** handles subscription payments

---

## Requirement Mapping

| Requirement (from brief)         | What I will build                                       |
|----------------------------------|---------------------------------------------------------|
| Public post viewing              | Home page — all published free posts, no login needed   |
| Post listing and search          | Home page list + search page with keyword filter        |
| Simple navigation                | Navbar with links: Home, Search, Login, Subscribe       |
| Post creation interface          | Admin panel — create post form (title, content, toggle) |
| Content editing capabilities     | Admin panel — edit existing post form                   |
| Post visibility controls         | is_premium toggle + draft/published status per post     |
| Protected premium content        | Premium posts locked — active subscriber only           |
| Subscription system              | Stripe checkout + webhook → subscription table          |
| Enhanced user experience         | Clean UI, blur effect on locked posts, dashboard page   |

---

## Tech Stack
- **Framework:** Next.js 16.2.7 (App Router, TypeScript)
- **UI Runtime:** React 19.2.4
- **Styling:** Tailwind CSS v4
- **Database + Auth:** Supabase (PostgreSQL + Supabase Auth)
- **Payments:** Stripe (Subscription / Checkout)
- **Deployment:** Vercel

---

## Task Breakdown

---

### 🗓️ DAY 1 (8 hours) — Setup + Auth

#### Phase 1 — Project Setup
| #   | Task                                        | Est. Time | Buffer | Status      |
|-----|---------------------------------------------|-----------|--------|-------------|
| 1.1 | Create Next.js project (TS + Tailwind)      | 15 min    | 15 min | [x] Done    |
| 1.2 | Create Supabase project + run SQL tables    | 30 min    | 30 min | [x] Done    |
| 1.3 | Configure .env.local with API keys          | 10 min    | 15 min | [x] Done    |
| 1.4 | Install dependencies (supabase-js, stripe)  | 10 min    | 10 min | [x] Done    |
| 1.5 | Setup folder structure (lib/, components/)  | 15 min    | 15 min | [x] Done    |
| 1.6 | Push initial commit + TASKS.md to GitHub    | 15 min    | 10 min | [x] Done    |
| 1.7 | Create PROGRESS.md + write Day 1 entry      | 15 min    | 10 min | [x] Done    |

**Phase 1 Total: ~2 hours** (task: 1h 30min + buffer: 55min)

---

#### Phase 2 — Authentication
| #   | Task                                        | Est. Time | Buffer | Status      |
|-----|---------------------------------------------|-----------|--------|-------------|
| 2.1 | Create Supabase client (lib/supabase.ts)    | 20 min    | 20 min | [x] Done    |
| 2.2 | Build Signup page (email + password form)   | 40 min    | 20 min | [x] Done    |
| 2.3 | Build Login page                            | 30 min    | 15 min | [x] Done    |
| 2.4 | Add Navbar with auth state (login/logout)   | 40 min    | 20 min | [x] Done    |
| 2.5 | Protect /admin routes via middleware.ts     | 30 min    | 20 min | [x] Done    |

**Phase 2 Total: ~3 hours** (task: 2h 40min + buffer: 1h 15min)

---

#### Buffer / Catch-up time (Day 1)
| #   | Task                                        | Est. Time |
|-----|---------------------------------------------|-----------|
| —   | Fix setup / auth bugs if any                | 45 min    |
| —   | Code cleanup + folder structure review      | 45 min    |

**✅ Day 1 Total: ~8 hours**

---

### 🗓️ DAY 2 (8 hours) — Public Posts + Search + Admin Panel

#### Phase 3 — Public Posts (Free Section)
| #   | Task                                            | Est. Time | Buffer | Status      |
|-----|-------------------------------------------------|-----------|--------|-------------|
| 3.1 | Build PostCard component                        | 25 min    | 15 min | [x] Done    |
| 3.2 | Build Home page — fetch + list published posts  | 40 min    | 20 min | [x] Done    |
| 3.3 | Build Single post page (app/posts/[id])         | 40 min    | 20 min | [x] Done    |
| 3.4 | Add premium post blur + Subscribe CTA           | 25 min    | 15 min | [x] Done    |
| 3.5 | Build Search page (keyword filter)              | 45 min    | 20 min | [x] Done    |

**Phase 3 Total: ~4 hours** (task: 2h 55min + buffer: 1h 10min)

---

#### Phase 4 — Admin / Content Management
| #   | Task                                        | Est. Time | Buffer | Status      |
|-----|---------------------------------------------|-----------|--------|-------------|
| 4.1 | Build Admin post list page                  | 40 min    | 20 min | [x] Done    |
| 4.2 | Build Create post form                      | 50 min    | 30 min | [x] Done    |
| 4.3 | Build Edit post form (pre-fill existing)    | 40 min    | 25 min | [x] Done    |
| 4.4 | Add Delete post with confirm dialog         | 25 min    | 15 min | [x] Done    |
| 4.5 | Setup Supabase Storage bucket               | 20 min    | 20 min | [x] Done    |
| 4.6 | Add cover image upload to Create/Edit form  | 50 min    | 30 min | [x] Done    |
| 4.7 | Update PROGRESS.md Day 2 entry + push       | 15 min    | 10 min | [x] Done    |

**Phase 4 Total: ~5 hours** (task: 4h + buffer: 2h 10min)

**Mid-day checkpoint: Admin CRUD working with test data**

#### Buffer / Catch-up time (Day 2)
| #   | Task                                        | Est. Time |
|-----|---------------------------------------------|-----------|
| —   | Fix bugs from Day 1 if any                  | 45 min    |

**✅ Day 2 Total: ~8 hours**

---

### 🗓️ DAY 3 (8 hours) — Stripe + Deploy + Docs

#### Phase 5 — Premium / Stripe Subscription
| #   | Task                                              | Est. Time | Buffer | Status      |
|-----|---------------------------------------------------|-----------|--------|-------------|
| 5.1 | Stripe account setup + product/price create       | 25 min    | 15 min | [ ] Pending |
| 5.2 | Install Stripe + create lib/stripe.ts             | 15 min    | 10 min | [ ] Pending |
| 5.3 | Build Stripe checkout API route                   | 40 min    | 25 min | [ ] Pending |
| 5.4 | Build SubscribeButton component                   | 25 min    | 15 min | [ ] Pending |
| 5.5 | Build Stripe webhook handler                      | 50 min    | 30 min | [ ] Pending |
| 5.6 | Build subscriber dashboard page                   | 40 min    | 20 min | [ ] Pending |
| 5.7 | Premium access check on single post page          | 25 min    | 15 min | [ ] Pending |

**Phase 5 Total: ~5 hours** (task: 3h 40min + buffer: 1h 50min)

---

#### Phase 6 — Deploy + Final Docs
| #   | Task                                        | Est. Time | Buffer | Status      |
|-----|---------------------------------------------|-----------|--------|-------------|
| 6.1 | Deploy to Vercel + add all env variables    | 25 min    | 20 min | [ ] Pending |
| 6.2 | Update Stripe webhook URL to Vercel URL     | 10 min    | 10 min | [ ] Pending |
| 6.3 | End-to-end test (signup, subscribe, post)   | 40 min    | 20 min | [ ] Pending |
| 6.4 | Finalize README.md with live URL + setup    | 25 min    | 10 min | [ ] Pending |
| 6.5 | Update PROGRESS.md Day 3 entry + final push | 15 min    | 10 min | [ ] Pending |

**Phase 6 Total: ~3 hours** (task: 1h 55min + buffer: 1h)

**✅ Day 3 Total: ~8 hours**

---
---

## Summary

| Day   | Phases covered   | Focus                             | Total      |
|-------|------------------|-----------------------------------|------------|
| Day 1 | Phase 1 + 2      | Setup, Auth                       | 8 hrs      |
| Day 2 | Phase 3 + 4      | Public Posts, Search, Admin CRUD  | 8 hrs      |
| Day 3 | Phase 5 + 6      | Stripe, Deploy, Final docs        | 8 hrs      |
| **Total** |              |                                   | **24 hrs** |

> ⚠️ Buffer time is included per task — this accounts for reading docs,
> debugging errors, and learning new concepts for the first time.

---

## Status Key
- `[ ] Pending` — not started
- `[~] In Progress` — currently working
- `[x] Done` — completed
- `[!] Blocked` — waiting on something / stuck


