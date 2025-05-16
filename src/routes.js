const QRCode = require('qrcode');
const businesses = require('./business.json');

function initializeRouter() {
    // Get the path from the URL
    const path = window.location.pathname.substr(1); // Remove leading slash

    if (path && path !== 'index.html') {
        if (businesses[path]) {
            // Found a business match
            const business = businesses[path];
            
            // Update page for this specific business
            const landingPage = document.getElementById('landingPage');
            const clientApp = document.getElementById('clientApp');
            
            if (landingPage) landingPage.style.display = 'none';
            if (clientApp) clientApp.style.display = 'block';
            
            const businessNameDisplay = document.getElementById('businessNameDisplay');
            if (businessNameDisplay) businessNameDisplay.textContent = business.name;
            
            // Set Google review URL - either using placeId or directUrl
            let reviewUrl;
            if (business.directUrl) {
                reviewUrl = business.directUrl;
            } else if (business.placeId) {
                reviewUrl = `https://search.google.com/local/writereview?placeid=${business.placeId}`;
            } else {
                reviewUrl = '#'; // Fallback
            }
            
            // Set short link
            const shortLink = `${window.location.protocol}//${window.location.host}/${path}`;
            const shortLinkDisplay = document.getElementById('shortLinkDisplay');
            if (shortLinkDisplay) {
                shortLinkDisplay.textContent = shortLink;
                shortLinkDisplay.href = reviewUrl;
            }
            
            // Configure text button
            const messageText = `Thanks for choosing us! We'd appreciate if you could take a moment to leave us a review.`;
            
            // For text messages - use multiple types of line breaks
            const textMessageWithLink = `${messageText}\r\n\r\n${reviewUrl}\r\n\r\n\r\nThank you for your support!`;
            const encodedTextMessage = encodeURIComponent(textMessageWithLink);
            
            // For email - use HTML formatting
            const emailBody = `${messageText}<br><br><a href="${reviewUrl}">${reviewUrl}</a><br><br>Thank you for your support!`;
            const encodedEmailBody = encodeURIComponent(emailBody);
            
            const sendTextBtn = document.getElementById('sendTextBtn');
            if (sendTextBtn) {
                sendTextBtn.href = `sms:?&body=${encodedTextMessage}`;
            }
            
            // Email
            const encodedSubject = encodeURIComponent(`We'd love your feedback on ${business.name}!`);
            const sendEmailBtn = document.getElementById('sendEmailBtn');
            if (sendEmailBtn) {
                sendEmailBtn.href = `mailto:?subject=${encodedSubject}&html=${encodedEmailBody}`;
            }
            
            // Generate QR code for the review URL
            const qrCodeContainer = document.getElementById('qrCode');
            if (qrCodeContainer) {
                qrCodeContainer.innerHTML = ''; // Clear previous content
                
                // Create a new canvas element
                const canvas = document.createElement('canvas');
                qrCodeContainer.appendChild(canvas);
                
                try {
                    QRCode.toCanvas(canvas, reviewUrl, {
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
        }
    }
}

module.exports = {
    initializeRouter
};