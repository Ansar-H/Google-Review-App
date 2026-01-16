# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A multi-tenant SaaS application for businesses to collect Google reviews via SMS, email, and QR codes. Built with vanilla JavaScript (no frontend framework), Express.js backend, and Webpack build system.

## Development Commands

### Local Development
```bash
npm run dev      # Start Webpack dev server on localhost:3000 with hot reload
npm run build    # Production build to dist/ directory
npm start        # Start Express server (serves dist/ and handles routing)
```

### Building for Production
The build process:
1. Webpack bundles `src/index.js` → `dist/bundle.js`
2. CSS extracted to `dist/styles.css`
3. Copies `src/business.json` and `src/favicons/` to `dist/`
4. Generates `dist/index.html` from template

## Architecture

### Dual-Mode Application

The app operates in two modes based on URL path:

1. **Landing Page** (`/` or `/index.html`)
   - Marketing page showcasing features
   - Controlled by `landingPage` element in [src/index.html](src/index.html)

2. **Client App** (`/businessname` or `/businessnameapp`)
   - Review collection interface with SMS/Email/QR code buttons
   - Controlled by `clientApp` element in [src/index.html](src/index.html)

### URL Routing Pattern

The app uses a specific URL structure for business-specific pages:

- `/businessname` → Server redirects to Google review form (handled by [server.js](server.js:46-53))
- `/businessnameapp` → Shows client app interface with admin configuration

**Implementation details:**
- [server.js](server.js:46-66) handles server-side routing and redirects
- [src/index.js](src/index.js:61-75) determines which UI to show based on URL path
- Business path extracted by removing trailing `app` suffix if present

### Business Configuration System

Configurations are managed through three sources (in priority order):

1. **Server-side persistent configs** (`configs/*.json`)
   - Loaded by [server.js](server.js:20-40) on startup
   - API endpoint: `GET /api/config/:businessPath` ([server.js](server.js:69-82))
   - Admin API: `POST /api/config` ([server.js](server.js:85-107))

2. **Static frontend configs** ([src/business.json](src/business.json))
   - Bundled with frontend, fetched at runtime
   - Contains 6 businesses with either `placeId` or `directUrl`

3. **Client-side temporary configs** (localStorage)
   - Key: `reviewAppConfig`
   - Saved when admin updates configuration via UI

**Config schema:**
```javascript
{
  businessName: string,           // Display name
  placeId: string,                // Google Place ID (for standard businesses)
  serviceBasedBusiness: boolean,  // If true, use alternativeReviewUrl instead
  alternativeReviewUrl: string,   // Custom review URL (for service businesses)
  shortDomain: string,            // Domain for short links
  shortPath: string,              // URL path (e.g., "businessname")
  emailSubject: string,           // Email subject line template
  messageText: string             // SMS/Email message template
}
```

### Admin Access Methods

There are three ways to access the admin configuration panel:

1. **Logo clicks**: Click the logo 10 times within 2 seconds ([src/index.js](src/index.js:322-339))
2. **Business name clicks**: Click business name 3 times within 500ms ([src/index.js](src/index.js:438-456))
3. **Admin button**: Click the `.admin-link` button ([src/index.js](src/index.js:35-38))

**Admin password**: Hardcoded as `"admin123"` in [src/index.js](src/index.js:29)

### Review Collection Flow

When a customer interacts with the app:

1. **SMS**: Opens messaging app with pre-filled message containing short link ([src/index.js](src/index.js:262-265))
2. **Email**: Opens email client with pre-filled subject and message ([src/index.js](src/index.js:267-270))
3. **QR Code**: Generates scannable code linking directly to review form ([src/index.js](src/index.js:273-303))

All methods use the short link format: `https://yourdomain.com/businesspath`

The actual review URL is determined by:
- `alternativeReviewUrl` if `serviceBasedBusiness` is true
- Otherwise: `https://search.google.com/local/writereview?placeid=${placeId}`

### Key Files and Their Roles

- **[server.js](server.js)**: Express server, serves static files, handles business routing and redirects, provides config API
- **[src/index.js](src/index.js)**: Main frontend logic, determines landing vs client app, handles admin auth, manages config loading/saving, generates QR codes
- **[src/routes.js](src/routes.js)**: Legacy routing logic (mostly superseded by index.js)
- **[webpack.config.js](webpack.config.js)**: Build configuration, entry point, loaders for JS/CSS/images, dev server setup
- **[src/business.json](src/business.json)**: Static business database (6 pre-configured businesses)
- **[src/index.html](src/index.html)**: Single-page template containing both landing page and client app HTML

### Tech Stack Details

- **Build**: Webpack 5 + Babel 7 (ES6+ transpilation)
- **Frontend**: Vanilla JavaScript (no React/Vue/etc), QRCode.js library
- **Backend**: Express.js 4.18.2
- **Styling**: Pure CSS with CSS variables, no preprocessor
- **Deployment**: Netlify (static) or Node.js server (dynamic)

## Common Development Patterns

### Adding a New Business

**Option 1: Via Admin UI (Development)**
1. Visit `/businessnameapp`
2. Access admin panel (logo clicks or business name clicks)
3. Enter password "admin123"
4. Fill in business details and save
5. Config saved to localStorage only

**Option 2: Server Config (Production)**
1. Create `configs/businessname.json`:
```json
{
  "businessName": "Business Name",
  "placeId": "ChIJ...",
  "shortPath": "businessname"
}
```
2. Server auto-loads on next restart or via config reload

**Option 3: Static Bundle (Pre-deployment)**
1. Edit [src/business.json](src/business.json)
2. Add business entry with `name` and either `placeId` or `directUrl`
3. Rebuild with `npm run build`

### Modifying Review Messages

Message templates are in [src/index.js](src/index.js:122-132):
- `config.emailSubject` - Email subject line
- `config.messageText` - SMS and email body text
- Short link automatically appended to messages

### Working with QR Codes

QR generation happens in [src/index.js](src/index.js:273-303):
- Uses `qrcode` npm package
- Renders to canvas element in modal
- Links to either `alternativeReviewUrl` or Google Place ID URL

## Important Notes

- **No framework dependencies**: The frontend uses vanilla JavaScript with direct DOM manipulation
- **Client-side routing**: Path detection happens in browser, not server (except for redirects)
- **Security caveat**: Admin password is hardcoded and client-side only. POST `/api/config` endpoint lacks authentication
- **Two deployment modes**: Static (Netlify) vs dynamic (Express server with configs/ folder)
- **Mobile-first design**: CSS uses responsive design patterns optimized for mobile devices
