# PWA Setup Guide for Meditation App

Your meditation app has been successfully converted into a Progressive Web App (PWA)! 🎉

## What's Been Implemented

### 1. Core PWA Files
- ✅ `app/manifest.json` - Web app manifest with app metadata
- ✅ `public/sw.js` - Service worker for push notifications
- ✅ PWA metadata in `app/layout.tsx`
- ✅ Security headers in `next.config.ts`

### 2. Components
- ✅ `PushNotificationManager` - Manages push notification subscriptions
- ✅ `InstallPrompt` - Shows installation instructions for iOS/Android

### 3. Server Actions
- ✅ `app/actions.ts` - Handles subscription management and sending notifications

### 4. Dependencies
- ✅ Installed `web-push` and `@types/web-push`

## Setup Instructions

### Step 1: Configure VAPID Keys

You need to set up VAPID keys for push notifications. Your keys have been generated:

**Generated VAPID Keys:**
```
Public Key: ...
Private Key: ...
```

1. Create a `.env.local` file in the root directory:
```bash
touch .env.local
```

2. Add your VAPID keys to `.env.local`:
```env
NEXT_PUBLIC_VAPID_PUBLIC_KEY=...
VAPID_PRIVATE_KEY=...
```

⚠️ **Important:** Never commit `.env.local` to version control! It's already in `.gitignore`.

### Step 2: Create PWA Icons

Replace the placeholder icon files with actual PNG images:
- `/public/icon-192x192.png` (192x192 pixels)
- `/public/icon-512x512.png` (512x512 pixels)

**Tools to create icons:**
- [Favicon Generator](https://favicon.io/)
- [PWA Asset Generator](https://www.npmjs.com/package/pwa-asset-generator)
- Design tools: Figma, Canva, Photoshop

**Quick tip:** Use a meditation-themed icon (lotus flower, zen circle, etc.)

### Step 3: Update Email in Actions

Edit `app/actions.ts` and replace the email with your actual email:
```typescript
webpush.setVapidDetails(
  'mailto:your-email@example.com',  // 👈 Change this!
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
)
```

### Step 4: Run in Development Mode with HTTPS

PWAs require HTTPS. For local testing, use:
```bash
bun run dev -- --experimental-https
```

Or update your `package.json`:
```json
{
  "scripts": {
    "dev": "next dev --turbopack --experimental-https"
  }
}
```

### Step 5: Test Your PWA

1. **Start the development server:**
   ```bash
   bun run dev
   ```

2. **Open your browser** (Chrome, Edge, or Safari)
   - Navigate to `https://localhost:3000`
   - Accept the self-signed certificate warning (only for local dev)

3. **Test Push Notifications:**
   - Click "Subscribe" in the Push Notifications section
   - Allow notifications when prompted
   - Enter a test message and click "Send Test Notification"
   - You should receive a notification!

4. **Test Installation:**
   - **Desktop:** Look for the install icon in the browser's address bar
   - **iOS:** Follow the instructions shown in the InstallPrompt component
   - **Android:** You'll see an "Add to Home Screen" prompt

## Production Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Add PWA functionality"
   git push
   ```

2. **Deploy to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your repository
   - Add environment variables:
     - `NEXT_PUBLIC_VAPID_PUBLIC_KEY`
     - `VAPID_PRIVATE_KEY`
   - Deploy!

3. **Update Service Worker URL:**
   In `public/sw.js`, update the notification click handler if needed:
   ```javascript
   event.waitUntil(clients.openWindow('https://your-domain.com'))
   ```

### Vercel Environment Variables Setup

In your Vercel project settings:
1. Go to Settings → Environment Variables
2. Add both VAPID keys (marked as Secret for the private key)
3. Apply to all environments (Production, Preview, Development)

## Features Included

### 🔔 Push Notifications
- Subscribe/unsubscribe functionality
- Send test notifications
- Custom notification messages
- Works even when app is closed (on supported devices)

### 📱 Install to Home Screen
- Works on iOS (via Safari instructions)
- Works on Android (automatic prompt)
- Works on Desktop (Chrome, Edge)
- Standalone app experience

### 🔒 Security Headers
- X-Content-Type-Options
- X-Frame-Options
- Referrer-Policy
- Content-Security-Policy for service worker

### ⚡ Offline-Ready Structure
- Service worker registered
- Manifest configured
- Ready to add offline caching (see extension ideas below)

## Testing Checklist

- [ ] VAPID keys added to `.env.local`
- [ ] Icons replaced with actual images (192x192 and 512x512)
- [ ] Email updated in `app/actions.ts`
- [ ] App runs with `--experimental-https` flag
- [ ] Browser allows notifications
- [ ] Can subscribe to notifications
- [ ] Can send and receive test notifications
- [ ] Install prompt appears (or iOS instructions show)
- [ ] Can install app to home screen
- [ ] Installed app opens in standalone mode

## Browser Support

| Feature | Chrome | Safari | Firefox | Edge |
|---------|--------|--------|---------|------|
| PWA Install | ✅ | ✅ (iOS 16.4+) | ✅ | ✅ |
| Push Notifications | ✅ | ✅ (iOS 16.4+) | ✅ | ✅ |
| Service Worker | ✅ | ✅ | ✅ | ✅ |

## Next Steps & Enhancements

### 1. Add Offline Support
Install [Serwist](https://serwist.pages.dev/) for offline caching:
```bash
bun add @serwist/next
```

### 2. Store Subscriptions in Database
Currently, subscriptions are stored in memory. For production:
- Add a database (Supabase, Prisma + PostgreSQL, MongoDB)
- Store subscriptions with user IDs
- Send notifications to multiple users

### 3. Scheduled Notifications
Add meditation reminders:
- Create a cron job (Vercel Cron)
- Schedule daily meditation reminders
- Allow users to set custom times

### 4. Background Sync
Add offline form submissions that sync when online

### 5. Better Icons & Splash Screens
- Create splash screens for iOS
- Add more icon sizes
- Add maskable icons for Android

## Troubleshooting

### Notifications Not Working
- ✅ Check browser permissions (Settings → Notifications)
- ✅ Verify VAPID keys are correct in `.env.local`
- ✅ Ensure you're using HTTPS (even localhost needs `--experimental-https`)
- ✅ Check browser console for errors
- ✅ Try a different browser

### Service Worker Not Updating
- Clear cache: DevTools → Application → Service Workers → Unregister
- Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
- Check `sw.js` cache headers in `next.config.ts`

### Install Prompt Not Showing
- ✅ Ensure `manifest.json` is accessible at `/manifest.json`
- ✅ Check icons exist and are valid PNG files
- ✅ Try on mobile device (easier to test)
- ✅ Clear site data and reload

### VAPID Key Errors
- ✅ Regenerate keys: `npx web-push generate-vapid-keys`
- ✅ Ensure no extra quotes or spaces in `.env.local`
- ✅ Restart the dev server after changing `.env.local`

## Resources

- [Next.js PWA Guide](https://nextjs.org/docs/app/guides/progressive-web-apps)
- [Web Push Protocol](https://web.dev/push-notifications-web-push-protocol/)
- [PWA Builder](https://www.pwabuilder.com/)
- [Serwist (Offline Support)](https://serwist.pages.dev/)

## Support

If you encounter issues:
1. Check the browser console for errors
2. Verify all setup steps were completed
3. Test in a different browser
4. Try on a mobile device

---

**Happy meditating! 🧘‍♀️**

