# Cloudflare Pages Deployment Guide

This repository is configured for deployment on Cloudflare Pages with no build command and no framework.

## Structure

- **`/functions/api`** - Cloudflare Pages Functions (backend API endpoints)
- **`/frontend`** - React frontend source code
- **`/frontend/build`** - Static build output (should be committed or built before deployment)

## Deployment Steps

### Option 1: Deploy with Pre-built Static Files

1. Build the frontend locally:
   ```bash
   cd frontend
   npm install
   npm run build
   ```

2. Copy the build output to the root `public` directory (or configure Cloudflare Pages to use `frontend/build` as the output directory)

3. Deploy to Cloudflare Pages:
   - Connect your repository to Cloudflare Pages
   - Set **Build command**: (leave empty)
   - Set **Build output directory**: `frontend/build`
   - Set **Root directory**: (leave as root)

### Option 2: Configure Build in Cloudflare Pages

1. In Cloudflare Pages dashboard:
   - **Build command**: `cd frontend && npm install && npm run build`
   - **Build output directory**: `frontend/build`
   - **Root directory**: (leave as root)

2. However, note that the requirement is "no build command", so Option 1 is preferred.

## Environment Variables

Set these in Cloudflare Pages dashboard under Settings > Environment Variables:

- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` - Your Supabase anonymous key

## API Endpoints

All API endpoints are available under `/api/*`:

- `GET /api/health` - Health check
- `GET /api/malls` - Get all available malls
- `GET /api/categories?mall_id=<mall_id>` - Get categories for a mall
- `GET /api/restaurants?categories=<categories>&mall_id=<mall_id>` - Get restaurants
- `POST /api/spin` - Spin the wheel
- `GET /api/users` - Get users (example endpoint)

## Functions Directory

The `/functions` directory contains Cloudflare Pages Functions:
- Each file in `/functions/api/` becomes an endpoint at `/api/<filename>`
- Shared libraries are in `/functions/api/lib/`
- Functions use the Fetch API format with `onRequest(context)` export

## Static Files

Static files (images, sounds) are served from `/frontend/public/` and will be available at the root after building.

## Notes

- No Node.js backend is required - all backend logic is in Cloudflare Pages Functions
- The frontend uses relative API paths (`/api/*`) to work on the same domain
- CORS is handled automatically by the functions
- The `_redirects` file ensures client-side routing works correctly

