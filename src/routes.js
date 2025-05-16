function initializeRouter() {
    // Get the path from the URL
    const path = window.location.pathname.substr(1); // Remove leading slash

    if (path && path !== 'index.html') {
        // This might be a short URL, check if it's in our database
        handleShortUrl(path);
    }
}

function handleShortUrl(path) {
    // Check if this is an 'app' path
    if (path.endsWith('app')) {
        // This is an app URL, just load the app
        return;
    }
    
    // For now, we'll check localStorage for any matching paths
    try {
        const config = JSON.parse(localStorage.getItem('reviewAppConfig'));
        
        if (config && config.shortPath === path) {
            // This is a match! Redirect to the Google review URL
            const reviewUrl = `https://search.google.com/local/writereview?placeid=${config.placeId}`;
            window.location.href = reviewUrl;
            return;
        }
        
        // No match found, just continue loading the app
        console.log('No matching short URL found for path:', path);
    } catch (error) {
        console.error('Error checking for short URL:', error);
    }
}

module.exports = {
    initializeRouter
};