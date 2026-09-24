# GLORON — Shared Customer Reviews Setup

The website now uses **Supabase** instead of browser localStorage. This means a review submitted by one customer is stored online and can be shown to every customer after you approve it.

## 1. Create the database
1. Create a Supabase project.
2. Open **SQL Editor**.
3. Paste everything from `supabase_reviews.sql`.
4. Run it.

## 2. Connect the website
Open `js/main.js` and replace:

```js
const SUPABASE_URL='YOUR_SUPABASE_PROJECT_URL';
const SUPABASE_ANON_KEY='YOUR_SUPABASE_ANON_KEY';
```

with your project's **Project URL** and **anon/public key** from Supabase Project Settings > API.

Use the anon/public key in the website. **Never put a Supabase service-role key in website JavaScript.**

## 3. How reviews work
- Customer opens the website.
- Customer enters name, rating and genuine review.
- Review is saved online as `pending`.
- It is NOT publicly visible yet.
- You open Supabase > Table Editor > `reviews`.
- Change `status` from `pending` to `approved` for genuine reviews.
- The approved review then appears to all website visitors.

## 4. Important
This setup does not require customers to create accounts. It uses a public review form with moderation.

For a production store, add stronger anti-spam/rate-limiting or CAPTCHA before launch if review spam becomes a problem.
