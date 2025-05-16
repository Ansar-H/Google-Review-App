import './styles.css';
const QRCode = require('qrcode');
const { createLogo } = require('./logo');
const { initializeRouter } = require('./routes');

// Initialize the router
initializeRouter();

document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded and ready');
  
  // Admin configuration
  const ADMIN_PASSWORD = "admin123"; // Change this to your secure password
  
  // Determine if we're on the homepage or a client page
  const pathSegments = window.location.pathname.split('/');
  const path = pathSegments[pathSegments.length - 1];
  
  // Elements from the landing page
  const landingPage = document.getElementById('landingPage');
  const clientApp = document.getElementById('clientApp');
  const appLogoPreview = document.getElementById('appLogoPreview');
  
  // Initialize logo for landing page if it exists
  if (appLogoPreview) {
    createLogo(appLogoPreview);
  }
  
  // Initialize the app logo for client app
  const logoContainer = document.getElementById('appLogo');
  if (logoContainer) {
    createLogo(logoContainer);
  }

  // Determine whether to show landing page or client app
  if (path && (path !== '' && path !== 'index.html')) {
    // Show client app for specific business path
    if (landingPage) landingPage.style.display = 'none';
    if (clientApp) clientApp.style.display = 'block';
    
    // Rest of your client app elements
    const businessNameDisplay = document.getElementById('businessNameDisplay');
    const shortLinkDisplay = document.getElementById('shortLinkDisplay');
    const sendTextBtn = document.getElementById('sendTextBtn');
    const sendEmailBtn = document.getElementById('sendEmailBtn');
    const showQRBtn = document.getElementById('showQRBtn');
    const qrModal = document.getElementById('qrModal');
    const closeModal = document.querySelector('.close');
    const qrCodeContainer = document.getElementById('qrCode');
    const configSection = document.getElementById('configSection');
    const adminLogin = document.getElementById('adminLogin');
    const configForm = document.getElementById('configForm');
    const saveConfigBtn = document.getElementById('saveConfig');
    const hideConfigBtn = document.getElementById('hideConfig');
    const copyLinkBtn = document.getElementById('copyLinkBtn');
    
    // Admin elements
    const adminPassword = document.getElementById('adminPassword');
    const loginBtn = document.getElementById('loginBtn');
    
    // Form Elements
    const businessNameInput = document.getElementById('businessName');
    const placeIdInput = document.getElementById('placeId');
    const serviceBasedCheckbox = document.getElementById('serviceBasedCheckbox');
    const alternativeReviewUrlGroup = document.getElementById('alternativeReviewUrlGroup');
    const alternativeReviewUrlInput = document.getElementById('alternativeReviewUrl');
    const shortPathInput = document.getElementById('shortPath');
    const emailSubjectInput = document.getElementById('emailSubject');
    const messageTextInput = document.getElementById('messageText');
    
    // Toast notification
    const toastElement = document.getElementById('toast');
    function showToast(message) {
      console.log("Showing toast:", message);
      if (toastElement) {
        toastElement.textContent = message;
        toastElement.className = 'toast show';
        setTimeout(function() { 
          toastElement.className = 'toast'; 
        }, 3000);
      }
    }

    // Default config
    let config = {
      businessName: 'Your Business Name',
      placeId: '',
      serviceBasedBusiness: false,
      alternativeReviewUrl: '',
      shortDomain: window.location.host || 'yourshortlink.com',
      shortPath: 'business',
      emailSubject: "We'd love your feedback!",
      messageText: "Thanks for choosing us! We'd appreciate if you could take a moment to leave us a review."
    };

    // Get business ID from URL path
    function getBusinessPathFromUrl() {
      const pathSegments = window.location.pathname.split('/');
      let businessPath = pathSegments[pathSegments.length - 1];
      // Remove 'app' suffix if present
      if (businessPath.endsWith('app')) {
        businessPath = businessPath.substring(0, businessPath.length - 3);
      }
      return businessPath || 'business';
    }

    // Try to extract business info from URL
    const businessPathFromUrl = getBusinessPathFromUrl();
    if (businessPathFromUrl !== 'business') {
      config.shortPath = businessPathFromUrl;
    }

    // Load config from localStorage if available
    if (localStorage.getItem('reviewAppConfig')) {
      try {
        config = JSON.parse(localStorage.getItem('reviewAppConfig'));
        updateUIFromConfig();
      } catch (e) {
        console.error('Error loading config:', e);
      }
    }

    // Show/hide alternative URL field based on checkbox
    if (serviceBasedCheckbox) {
      serviceBasedCheckbox.addEventListener('change', function() {
        if (this.checked) {
          if (alternativeReviewUrlGroup) {
            alternativeReviewUrlGroup.style.display = 'block';
          }
          // Make Place ID optional when this is checked
          if (placeIdInput && placeIdInput.parentElement.querySelector('label')) {
            placeIdInput.parentElement.querySelector('label').textContent = 'Google Place ID (optional):';
          }
        } else {
          if (alternativeReviewUrlGroup) {
            alternativeReviewUrlGroup.style.display = 'none';
          }
          // Make Place ID required again
          if (placeIdInput && placeIdInput.parentElement.querySelector('label')) {
            placeIdInput.parentElement.querySelector('label').textContent = 'Google Place ID:';
          }
        }
      });
      
      // Set initial state based on config
      serviceBasedCheckbox.checked = config.serviceBasedBusiness;
      if (config.serviceBasedBusiness && alternativeReviewUrlGroup) {
        alternativeReviewUrlGroup.style.display = 'block';
        if (alternativeReviewUrlInput) {
          alternativeReviewUrlInput.value = config.alternativeReviewUrl;
        }
        if (placeIdInput && placeIdInput.parentElement.querySelector('label')) {
          placeIdInput.parentElement.querySelector('label').textContent = 'Google Place ID (optional):';
        }
      }
    }

    // Fill form with current config
    function populateForm() {
      if (businessNameInput) businessNameInput.value = config.businessName;
      if (placeIdInput) placeIdInput.value = config.placeId;
      if (serviceBasedCheckbox) serviceBasedCheckbox.checked = config.serviceBasedBusiness;
      if (alternativeReviewUrlInput) alternativeReviewUrlInput.value = config.alternativeReviewUrl;
      if (shortPathInput) shortPathInput.value = config.shortPath;
      if (emailSubjectInput) emailSubjectInput.value = config.emailSubject;
      if (messageTextInput) messageTextInput.value = config.messageText;
    }

    // Update UI elements from config
    function updateUIFromConfig() {
      console.log("Updating UI from config:", config);
      
      if (businessNameDisplay) businessNameDisplay.textContent = config.businessName;
      
      // Determine the review URL - either Google or alternative
      let reviewUrl;
      if (config.serviceBasedBusiness && config.alternativeReviewUrl) {
        reviewUrl = config.alternativeReviewUrl;
      } else if (config.placeId) {
        reviewUrl = `https://search.google.com/local/writereview?placeid=${config.placeId}`;
      } else {
        // Fallback - can be a contact form URL
        reviewUrl = '#';
      }
      
      // Construct short link
      const shortLink = `${window.location.protocol}//${config.shortDomain}/${config.shortPath}`;
      
      if (shortLinkDisplay) {
        shortLinkDisplay.textContent = shortLink;
        shortLinkDisplay.href = reviewUrl;
      }
      
      // Update button actions
      const encodedSubject = encodeURIComponent(config.emailSubject);
      const messageWithLink = `${config.messageText}\n\n${shortLink}`;
      const encodedMessage = encodeURIComponent(messageWithLink);
      
      if (sendTextBtn) {
        sendTextBtn.href = `sms:?&body=${encodedMessage}`;
        console.log("SMS link set to:", sendTextBtn.href);
      }
      
      if (sendEmailBtn) {
        sendEmailBtn.href = `mailto:?subject=${encodedSubject}&body=${encodedMessage}`;
        console.log("Email link set to:", sendEmailBtn.href);
      }
      
      // Generate QR code for the review URL
      if (qrCodeContainer && reviewUrl && reviewUrl !== '#') {
        qrCodeContainer.innerHTML = '';
        try {
          QRCode.toCanvas(qrCodeContainer, reviewUrl, {
            width: 200,
            margin: 1,
            color: {
              dark: '#000000',
              light: '#ffffff'
            }
          }, function(error) {
            if (error) console.error('Error generating QR code', error);
          });
        } catch (error) {
          console.error('Error generating QR code:', error);
          qrCodeContainer.textContent = 'QR Code generation failed';
        }
      }
      
      populateForm();
    }

    // Admin login functionality
    if (loginBtn) {
      loginBtn.addEventListener('click', function() {
        if (adminPassword && adminPassword.value === ADMIN_PASSWORD) {
          // Show configuration form, hide login
          if (adminLogin) adminLogin.style.display = 'none';
          if (configForm) configForm.style.display = 'block';
          showToast('Admin access granted');
        } else {
          showToast('Incorrect password');
        }
      });
    }

    // Secret way to show admin section (click logo 10 times)
    let logoClickCount = 0;
    let logoClickTimer;
    if (logoContainer) {
      logoContainer.addEventListener('click', function() {
        logoClickCount++;
        clearTimeout(logoClickTimer);
        
        logoClickTimer = setTimeout(() => {
          logoClickCount = 0;
        }, 2000);
        
        if (logoClickCount >= 10) {
          if (configSection) configSection.style.display = 'block';
          logoClickCount = 0;
        }
      });
    }

    // Save config button
    if (saveConfigBtn) {
      saveConfigBtn.addEventListener('click', function() {
        console.log("Save button clicked");
        
        // For service-based businesses, Place ID is optional
        if (serviceBasedCheckbox && !serviceBasedCheckbox.checked && (!placeIdInput || !placeIdInput.value)) {
          showToast('Please enter a Google Place ID or check "This is a service-based business"');
          return;
        }
        
        // If it's a service-based business, alternative URL is required
        if (serviceBasedCheckbox && serviceBasedCheckbox.checked && 
            (!alternativeReviewUrlInput || !alternativeReviewUrlInput.value)) {
          showToast('Please provide an alternative review URL');
          return;
        }

        config.businessName = businessNameInput ? businessNameInput.value : config.businessName;
        config.placeId = placeIdInput ? placeIdInput.value : '';
        config.serviceBasedBusiness = serviceBasedCheckbox ? serviceBasedCheckbox.checked : false;
        config.alternativeReviewUrl = alternativeReviewUrlInput ? alternativeReviewUrlInput.value : '';
        config.shortPath = shortPathInput && shortPathInput.value ? shortPathInput.value : 'business';
        config.emailSubject = emailSubjectInput ? emailSubjectInput.value : config.emailSubject;
        config.messageText = messageTextInput ? messageTextInput.value : config.messageText;
        
        localStorage.setItem('reviewAppConfig', JSON.stringify(config));
        updateUIFromConfig();
        showToast('Configuration saved!');
      });
    }

    // Show QR code button
    if (showQRBtn) {
      showQRBtn.addEventListener('click', function() {
        console.log("QR button clicked");
        
        let canShowQR = true;
        
        if (!config.serviceBasedBusiness && !config.placeId) {
          showToast('Please set your Google Place ID in the configuration section first');
          canShowQR = false;
        }
        
        if (config.serviceBasedBusiness && !config.alternativeReviewUrl) {
          showToast('Please set an alternative review URL in the configuration section');
          canShowQR = false;
        }
        
        if (canShowQR && qrModal) {
          qrModal.style.display = 'block';
          console.log("QR modal shown");
        }
      });
    }

    // Copy link button
    if (copyLinkBtn) {
      copyLinkBtn.addEventListener('click', function() {
        const linkText = shortLinkDisplay ? shortLinkDisplay.textContent : '';
        
        navigator.clipboard.writeText(linkText)
          .then(() => {
            showToast('Link copied to clipboard!');
          })
          .catch(err => {
            console.error('Error copying text: ', err);
            showToast('Failed to copy. Try selecting and copying manually.');
          });
      });
    }

    // Close modal button
    if (closeModal) {
      closeModal.addEventListener('click', function() {
        if (qrModal) qrModal.style.display = 'none';
      });
    }

    // Hide config section
    if (hideConfigBtn) {
      hideConfigBtn.addEventListener('click', function() {
        if (configSection) configSection.style.display = 'none';
      });
    }
    
    // When clicking outside of the modal, close it
    window.addEventListener('click', function(event) {
      if (event.target == qrModal) {
        qrModal.style.display = 'none';
      }
    });
    
    // Double-click on business name to show config (another admin access method)
    if (businessNameDisplay) {
      let dbClickCount = 0;
      let dbClickTimer;
      
      businessNameDisplay.addEventListener('click', function() {
        dbClickCount++;
        clearTimeout(dbClickTimer);
        
        dbClickTimer = setTimeout(() => {
          dbClickCount = 0;
        }, 500);
        
        if (dbClickCount >= 3) {
          if (configSection) configSection.style.display = 'block';
          dbClickCount = 0;
        }
      });
    }
    
    // Initialize
    populateForm();
    updateUIFromConfig();
    console.log("Client app initialized");
    
  } else {
    // Show landing page for root domain
    if (landingPage) landingPage.style.display = 'block';
    if (clientApp) clientApp.style.display = 'none';
    console.log("Landing page initialized");
  }
});