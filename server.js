const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Create configs directory if it doesn't exist
const configsDir = path.join(__dirname, 'configs');
if (!fs.existsSync(configsDir)) {
    fs.mkdirSync(configsDir);
}

// Business configurations
let businessConfigs = {};

// Load business configs from JSON files
function loadBusinessConfigs() {
    businessConfigs = {};
    try {
        const configFiles = fs.readdirSync(configsDir);
        configFiles.forEach(file => {
            if (file.endsWith('.json')) {
                try {
                    const businessData = JSON.parse(
                        fs.readFileSync(path.join(configsDir, file), 'utf8')
                    );
                    businessConfigs[businessData.shortPath] = businessData;
                } catch (err) {
                    console.error(`Error reading config file ${file}:`, err);
                }
            }
        });
        console.log(`Loaded ${Object.keys(businessConfigs).length} business configurations`);
    } catch (err) {
        console.error('Error loading business configs:', err);
    }
}

// Load configs on startup
loadBusinessConfigs();

// Handle business-specific routes
app.get('/:businessPath', (req, res) => {
    const { businessPath } = req.params;
    
    // If this is a review link, redirect to Google
    if (businessConfigs[businessPath]) {
        const config = businessConfigs[businessPath];
        return res.redirect(`https://search.google.com/local/writereview?placeid=${config.placeId}`);
    }
    
    // If this is an app path (ends with 'app'), serve the app
    if (businessPath.endsWith('app')) {
        const basePath = businessPath.substring(0, businessPath.length - 3);
        if (businessConfigs[basePath]) {
            // Serve app with preloaded config
            return res.sendFile(path.join(__dirname, 'dist', 'index.html'));
        }
    }
    
    // Default: serve the app
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Endpoint to get business config
app.get('/api/config/:businessPath', (req, res) => {
    const { businessPath } = req.params;
    
    // Strip 'app' suffix if present
    const basePath = businessPath.endsWith('app') 
        ? businessPath.substring(0, businessPath.length - 3) 
        : businessPath;
    
    if (businessConfigs[basePath]) {
        return res.json(businessConfigs[basePath]);
    }
    
    res.status(404).json({ error: 'Business not found' });
});

// Admin API to add new business (would add authentication in production)
app.post('/api/config', express.json(), (req, res) => {
    const businessData = req.body;
    
    if (!businessData.shortPath || !businessData.placeId || !businessData.businessName) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Save to file
    try {
        fs.writeFileSync(
            path.join(configsDir, `${businessData.shortPath}.json`),
            JSON.stringify(businessData, null, 2)
        );
        
        // Reload configs
        loadBusinessConfigs();
        
        res.json({ success: true, message: 'Business configuration saved' });
    } catch (err) {
        console.error('Error saving business config:', err);
        res.status(500).json({ error: 'Failed to save business config' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});