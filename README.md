# TechBlog: Modern Full-Stack Publishing Platform

![Next.js](https://img.shields.io/badge/Next.js-16.2.7-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38B2AC?style=for-the-badge&logo=tailwind-css)
![Supabase](https://img.shields.io/badge/Supabase-Auth_%26_DB-3ECF8E?style=for-the-badge&logo=supabase)
![Stripe](https://img.shields.io/badge/Stripe-Payments-6772E5?style=for-the-badge&logo=stripe)

A production-grade, highly responsive blog publication platform built for modern web architectures. TechBlog features role-based access control, premium content gating, and a seamless Stripe subscription flow.

## ✨ Key Features

- **Public & Premium Content Separation:** Robust content gating. Non-subscribers get blurred previews of premium articles, while active subscribers gain full access.
- **Admin Dashboard & CMS:** Dedicated protected routes for admins to perform full CRUD operations on posts.
- **Rich Text Editing:** Integrated with **Tiptap** for a seamless WYSIWYG editing experience, supporting inline image uploads.
- **Secure Image Storage:** Supabase Storage integration for uploading and automatically managing article cover images and inline editor images.
- **Role-Based Authentication:** Complete authentication flow via Supabase Auth, differentiating between public visitors, paid subscribers, and administrators.
- **Automated Subscriptions:** Stripe Checkout and Webhooks integration ensures the database is automatically kept perfectly in sync with active subscriber statuses.
- **Modern UI/UX:** Built with Tailwind CSS v4, featuring dark mode support, glassmorphism UI elements, and sleek micro-animations.

---

## 🛠️ Tech Stack

* **Framework:** [Next.js](https://nextjs.org/) (App Router)
* **Language:** [TypeScript](https://www.typescriptlang.org/)
* **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
* **Database & Auth:** [Supabase](https://supabase.com/) (PostgreSQL)
* **Payments:** [Stripe](https://stripe.com/)
* **Editor:** [Tiptap](https://tiptap.dev/)
* **Icons:** [Lucide React](https://lucide.dev/)
* **Deployment:** [Vercel](https://vercel.com/)

---

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have the following installed and configured:
- Node.js (v18.17 or higher)
- A Supabase Project (Database, Auth, and a `post-images` Storage bucket configured)
- A Stripe Developer Account (with a recurring Subscription Product created)

### 2. Environment Variables
Clone the repository, create a `.env.local` file in the root directory, and add the following keys:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID=price_...

# Application Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Database Initialization
Before running the app, you need to set up your Supabase database structure:
1. Open your Supabase Dashboard and navigate to the **SQL Editor**.
2. Copy the contents of the `supabase/schema.sql` file from this repository.
3. Paste and run the SQL script to automatically create all tables, triggers, and Row Level Security policies.

### 4. Installation
Install the project dependencies using your preferred package manager:
```bash
npm install
# or
yarn install
# or
pnpm install
```

### 5. Run the Development Server
Start the local development server:
```bash
npm run dev
```
Navigate to `http://localhost:3000` to view the application.

---

## 🏗️ Architecture & Infrastructure

### Database Schema Map
* **`profiles`:** Tied directly to Supabase Auth. Stores `role` (e.g., `admin`, `user`).
* **`posts`:** Stores all publication content. Key columns include `is_premium` (boolean) and `status` (published/draft).
* **`subscriptions`:** Managed entirely by the Stripe Webhook. Stores the active Stripe subscription ID, Stripe Customer ID, and the `current_period_end` timestamp.

### Security (Row Level Security)
Row Level Security (RLS) is heavily utilized to ensure data integrity:
- Unauthenticated users can only `SELECT` published free posts.
- Authenticated users can `SELECT` their own subscriptions and profile data.
- Only users with the `admin` role can `INSERT`, `UPDATE`, or `DELETE` posts and images from the Storage bucket.

---

## 🌍 Deployment

This project is optimized for deployment on **Vercel**. 

1. Connect your GitHub repository to Vercel.
2. Populate all the Environment Variables in the Vercel dashboard.
3. Once deployed, update your `NEXT_PUBLIC_SITE_URL` to match your production domain.
4. Update your Stripe Webhook destination to point to `https://your-production-url.com/api/stripe/webhook` and ensure your `STRIPE_WEBHOOK_SECRET` is updated in Vercel.

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
