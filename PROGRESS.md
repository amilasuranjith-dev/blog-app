# Progress Log

### Day 2: Saturday, June 6 - Post CRUD + Storage

**Completed:**
- Built Admin post list page (integrated robust Server Actions for deletion).
- Built Create post form.
- Built Edit post form.
- Added Delete post with confirm dialog (`DeletePostButton` with Server Actions).
- Setup Supabase Storage bucket (`post-images`, public with strict RLS policies).
- Added cover image upload to Create/Edit form (generates public URLs and auto deletes old images).
- Add react toast notification for better UX

**Next Steps:**
- Complete Subscription system (Stripe webhook)

**Challenges:**
- Addressed `isAdmin` state lag due to delayed profile fetching upon initial login.
- Improved image handling by automatically deleting unused image files when a post is updated or removed.
- Enhanced UX by seamlessly replacing native browser alerts with `react-hot-toast` notifications.

**Status:** On Track

---

### Day 1: Friday, June 5 - Setup + Authentication

**Completed:**
- Set up the Next.js 16 blog app with TypeScript and Tailwind CSS v4
- Configured Supabase clients for browser and server usage
- Built signup and login pages with Supabase Auth
- Added a Navbar with auth state, login/signup links, and logout
- Protected `/admin` routes through `proxy.ts`

**Next Steps:**
- Start Task 3.1: build the reusable `PostCard` component
- Continue with public post listing and search features

**Challenges:**
- Fixed auth state refresh behavior in the Navbar
- Verified environment secrets are ignored and not committed

**Status:** On Track
