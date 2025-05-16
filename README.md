Google Review App
A lightweight, mobile-friendly application to help businesses collect more Google reviews from their customers.
Features

Send By Text - Opens SMS with a pre-filled review request message
Send By Email - Opens email with a pre-filled subject and message
Scan QR Code - Generates a scannable QR code that leads directly to Google reviews
Short Link - Creates a memorable URL for sharing anywhere

How It Works
This app creates a simple mobile interface that makes it easy for businesses to request reviews from their customers. Each business gets a unique URL where their customers can:

Click "Send By Text" to open their messaging app with a pre-filled message
Click "Send By Email" to open their email app with a pre-filled subject and message
Scan a QR code that takes them directly to the Google review form
Copy a short link to share in any context

Technologies Used

HTML5, CSS3, and JavaScript
Webpack for bundling
QRCode.js for QR code generation
Express.js (optional server for multi-business deployment)

Getting Started
Prerequisites

Node.js (v14 or higher)
npm (v6 or higher)

Installation

Clone this repository:

bashgit clone https://github.com/ansar-h/google-review-app.git
cd google-review-app

Install dependencies:

bashnpm install

Start the development server:

bashnpm run dev

Access the app at: http://localhost:3000

Configuration
The app can be configured in two ways:

Local Configuration (Development):

Double-click the business name or click the logo 10 times to access the admin panel
Enter the business name and Google Place ID
Save configuration


Server Configuration (Production):

Create JSON files in the configs folder
Each file should contain business details (name, placeId, customizations)
Deploy with server.js to handle multiple businesses



Deployment
Deploying to Netlify

Build your application:

bashnpm run build

Deploy to Netlify:

Connect your GitHub repository to Netlify
Or manually deploy the dist folder
Configure build settings: Build command: npm run build, Publish directory: dist


Set up redirects in netlify.toml:

toml[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
Deploying to Other Platforms
The app can be deployed to any static hosting service:

Vercel
GitHub Pages
Firebase Hosting
Any traditional web hosting

Business Distribution Model
This app is designed to be distributed to multiple businesses:

Each business gets a unique URL: yourdomain.com/businessname
Customers clicking this link are redirected to the business's Google review form
Businesses can also access their review app at: yourdomain.com/businessnameapp

Customization
You can customize various aspects of the app:

Colors and styling in styles.css
Default messages in index.js
Logo and branding

License
MIT
Acknowledgments

Inspired by the ThankAndRank concept
Uses QRCode.js for QR code generation