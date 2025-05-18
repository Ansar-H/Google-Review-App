const QRCode = require('qrcode');
const businesses = require('./business.json');

function initializeRouter() {
    // Get the path from the URL
    const path = window.location.pathname.substr(1); // Remove leading slash
    const isAppInterface = path.endsWith('app');
    const businessPath = isAppInterface ? path.slice(0, -3) : path;

    if (businessPath && businesses[businessPath]) {
        if (isAppInterface) {
            // Show the app interface
            // ...

            // Set branded short link (for SMS/email)
            const brandedShortLink = `${window.location.protocol}//${window.location.host}/${businessPath}`;
            const messageText = `Thanks for choosing us! We'd appreciate if you could take a moment to leave us a review.`;
            const messageWithLink = `${messageText}\n\n${brandedShortLink}\n\nThank you for your support!`.replace(/\n/g, '\r\n');
            const encodedMessage = encodeURIComponent(messageWithLink);
            const sendTextBtn = document.getElementById('sendTextBtn');
            if (sendTextBtn) {
                sendTextBtn.href = `sms:?&body=${encodedMessage}`;
            }
            
            // Configure email button
            const encodedSubject = encodeURIComponent(`We'd love your feedback on ${businesses[businessPath].name}!`);
            const sendEmailBtn = document.getElementById('sendEmailBtn');
            if (sendEmailBtn) {
                sendEmailBtn.href = `mailto:?subject=${encodedSubject}&body=${encodedMessage}`;
            }
            
            // Generate QR code for the review URL
            const qrCodeContainer = document.getElementById('qrCode');
            if (qrCodeContainer) {
                qrCodeContainer.innerHTML = ''; // Clear previous content
                
                // Create a new canvas element
                const canvas = document.createElement('canvas');
                qrCodeContainer.appendChild(canvas);
                
                try {
                    QRCode.toCanvas(canvas, businesses[businessPath].directUrl || businesses[businessPath].placeId ? `https://search.google.com/local/writereview?placeid=${businesses[businessPath].placeId}` : '#', {
                        width: 200,
                        margin: 1,
                        color: {
                            dark: '#000000',
                            light: '#ffffff'
                        }
                    });
                } catch (error) {
                    console.error('Error generating QR code:', error);
                    qrCodeContainer.innerHTML = 'QR Code generation failed: ' + error.message;
                }
            }
        } else {
            // This is the short link, which should redirect (handled by __redirects)
            // No app interface here!
        }
    }
}

module.exports = {
    initializeRouter
};