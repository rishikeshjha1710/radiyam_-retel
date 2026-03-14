# Firebase setup

## 1. Environment variables

Copy `.env.local.example` to `.env.local` and set:

- **NEXT_PUBLIC_ADMIN_EMAILS** – Comma-separated emails that can log in to the admin dashboard (e.g. `you@example.com`).
- **NEXT_PUBLIC_FIREBASE_*** – Your Firebase project config from [Firebase Console](https://console.firebase.google.com) → Project settings → Your apps.

## 2. Firebase Authentication

1. In Firebase Console → **Authentication** → **Sign-in method**, enable **Email/Password**.
2. Create a user (e.g. your admin email) and set a password.
3. Add that email to `NEXT_PUBLIC_ADMIN_EMAILS` in `.env.local`.

## 3. Firestore

1. Create a Firestore database (Native mode) if you haven’t already.
2. Deploy rules (optional but recommended):
   ```bash
   firebase deploy --only firestore:rules
   ```
   Rules in `firestore.rules` allow:
   - **products**: read by everyone, write by authenticated users (admin).
   - **orders**: create by everyone (checkout), read/update/delete by authenticated users (admin).

## 4. Firestore index (if prompted)

When you first load the dashboard or orders, Firestore may ask you to create an index. Open the link from the error message in the browser to create it, or in Firebase Console go to **Firestore** → **Indexes** and add:

- Collection: `products`, fields: `createdAt` (Descending).
- Collection: `orders`, fields: `createdAt` (Descending).

## 5. Run locally

```bash
npm install
npm run dev
```

- Store: http://localhost:3000  
- Admin: http://localhost:3000/admin (then sign in with an admin email).
