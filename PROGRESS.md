# Progress Log

### Day 3: Sunday, June 7 - Stripe Payments, Editor, and Deployment

**Completed:**
- Connected Stripe so users can pay to subscribe.
- Set up a Stripe Webhook to automatically update the database when a user pays.
- Built a Subscriber Dashboard for paying members.
- Added a Rich Text Editor (Tiptap) so admins can format blog posts and upload images inside the text.
- Made the Footer smart so it hides the "Subscribe" link if you are already a paid member or an admin.
- Successfully deployed the live app to Vercel!

**Next Steps:**
- Complete final manual testing of the live app.
- Launch the blog!

**Challenges:**
- Navigating the complexities of the Stripe Webhook integration proved to be exceptionally challenging.
- Resolving the intricate issues with the Stripe payment redirection was highly demanding.
- Fixed a bug where the Footer was looking for the wrong database column for subscriptions.
- Figured out how to safely update the Stripe live webhook secret in Vercel.

**Status:** Completed!

---

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
