# Vercel Deployment Guide

## Issue Resolution

The "vite build" command exiting with code 127 on Vercel has been resolved by:

1. **Moving build dependencies to production dependencies**: Vite and related build tools were moved from `devDependencies` to `dependencies` in `package.json`
2. **Adding vercel.json configuration**: Created explicit build configuration for Vercel

## What Was Fixed

### 1. Dependencies Issue
**Problem**: Vite was in `devDependencies`, but Vercel only installs production dependencies by default during deployment.

**Solution**: Moved these packages to `dependencies`:
- `vite` (4.5.14)
- `@vitejs/plugin-react` (4.0.4)
- `autoprefixer` (^10.4.22)
- `postcss` (^8.5.6)
- `tailwindcss` (^3.4.0)
- `typescript` (5.2.2)

### 2. Vercel Configuration
**Problem**: No explicit build configuration for Vercel.

**Solution**: Added `vercel.json` with:
- Explicit build command
- Output directory specification
- Framework detection

## Deployment Steps

1. **Commit the changes**:
   ```bash
   git add package.json vercel.json
   git commit -m "fix: resolve Vercel build issue - move build dependencies to production"
   git push
   ```

2. **Deploy to Vercel**:
   - Push to your main branch, or
   - Use Vercel CLI: `vercel --prod`
   - Or trigger deployment through Vercel dashboard

## Future Prevention

To avoid similar issues:

### 1. Dependency Management
- **Build tools** (vite, webpack, rollup, etc.) should be in `dependencies` for deployment platforms
- **Development tools** (eslint, prettier, nodemon, etc.) can remain in `devDependencies`
- **Type definitions** can stay in `devDependencies`

### 2. Platform-Specific Requirements
- **Vercel**: Needs build tools in production dependencies
- **Netlify**: Same requirement
- **Traditional servers**: Can use devDependencies for build tools

### 3. Testing Locally
Always test the build process locally:
```bash
npm run build
```

## Current Build Output

The build now successfully creates:
- `dist/index.html` (2.99 kB)
- `dist/assets/index-2126c6a0.js` (419.84 kB)
- `dist/assets/index-ecb27d99.css` (0.77 kB)
- Additional chunked assets for optimal loading

## Build Performance
- **Build time**: ~21 seconds
- **Total bundle size**: ~419 kB (gzipped: 102 kB)
- **Code splitting**: Implemented with 17 chunks

## Environment Variables

Ensure your `.env` file (or Vercel environment variables) includes:
```
VITE_SURREALDB_URL=your_surrealdb_url
VITE_SURREALDB_TOKEN=your_surrealdb_token
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
```

## Troubleshooting

If you encounter build issues:

1. **Check dependencies**: Ensure all build tools are in `dependencies`
2. **Verify Node version**: Vercel uses Node.js 18.x by default
3. **Check build logs**: Look for specific error messages
4. **Test locally**: Run `npm run build` to reproduce issues

## Support

For Vercel-specific issues:
- Check Vercel documentation: https://vercel.com/docs
- Review build logs in Vercel dashboard
- Ensure all environment variables are properly configured
