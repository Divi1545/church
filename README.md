# Church Visitor Response App

A single-page Next.js app for church visitors. Scan a QR code → watch a welcome video → fill out a response form. Data is saved to Supabase.

## Tech Stack

- **Next.js 16** (App Router, TypeScript)
- **Tailwind CSS 4**
- **HTML5 Video** (local file in `/public/video/`)
- **Supabase** (PostgreSQL database)

## Quick Start

```bash
npm install
cp .env.local.example .env.local
# Fill in env vars (see below)
npm run dev
```

## Adding Your Video

1. Place your video file in the `public/video/` folder
2. Rename it to `welcome.mp4` (or update the path in `components/VideoPlayer.tsx`)
3. Supported formats: `.mp4` (H.264) is recommended for widest browser support

## Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon/public key |

## Setting Up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run:

```sql
create table responses (
  id bigint generated always as identity primary key,
  first_name text not null,
  phone text not null,
  describes text not null,
  other_description text,
  prayer_request text,
  submitted_at timestamptz default now()
);

-- Allow inserts from the browser using the anon key
alter table responses enable row level security;
create policy "Allow public inserts" on responses
  for insert with check (true);
```

3. Go to **Settings → API** and copy your **Project URL** and **anon public** key
4. Paste them into `.env.local`

## Deploy to Vercel

1. Push this repo to GitHub
2. Import the repo in [Vercel](https://vercel.com)
3. Add the two environment variables in Vercel's project settings
4. Deploy — Vercel auto-detects the Next.js framework

> **Note:** Your video file in `public/video/` will be deployed as a static asset. Keep file size reasonable (under 50 MB recommended) for fast page loads on mobile.

## Generating a QR Code

Point any QR code generator at your deployed Vercel URL (e.g. `https://your-app.vercel.app`). Print and place at your church welcome area.

## Form Data Collected

| Column | Type | Required |
|---|---|---|
| first_name | text | Yes |
| phone | text | Yes |
| describes | text | Yes |
| other_description | text | If "Other" selected |
| prayer_request | text | No |
| submitted_at | timestamptz | Auto (default now()) |
