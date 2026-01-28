/**
 * DoubleCheck Configuration File
 * 
 * This file contains all user-specific data and form field mappings.
 * Update this file with your personal information before deployment.
 * 
 * PRIVACY NOTE: All data stays in your browser. Nothing is sent to external servers.
 */

// ============================================================================
// USER DATA
// ============================================================================

const USER_DATA = {
    // Your email address (used for Airtable member search)
    email: "sewardrichardmupereri@gmail.com",

    // Your Capaciti email address (for Microsoft Forms)
    capacitiEmail: "seward.mupereri@capaciti.org.za",

    // Airtable hub password
    airtablePassword: "hub123"
};

// ============================================================================
// FORM URLS
// ============================================================================

const FORM_URLS = {
    // Project Y attendance form (Airtable)
    projectY: "https://airtable.com/appoQDLLWTpeIppta/pagQgjgKmZKq91RKF/form",

    // Capaciti attendance form (Microsoft Forms)
    capaciti: "https://forms.office.com/Pages/ResponsePage.aspx?id=IU_xo38jKEC5eEJet2inFjpmp5sE_9lMudrWnZ6RMwtUMzJDTVNGNkEzODM3UTQzRDZZVlkzSDVIOS4u&origin=QRCode"
};

// ============================================================================
// FIELD MAPPINGS
// ============================================================================

/**
 * Field mappings define how to match form questions to user data.
 * 
 * Structure:
 * "Exact question text from form": value to fill
 * 
 * The automation will search for these question texts and fill the corresponding values.
 * Update these mappings after inspecting the actual form fields.
 */

const FIELD_MAPPINGS = {
    // Project Y (Airtable) form mappings
    projectY: {
        // WORKFLOW STEPS (in order):
        // 1. Enter password
        // 2. Click "Add Member" button
        // 3. Search for email in popup
        // 4. Select user from search results
        // 5. Tick attendance confirmation checkbox
        // 6. User manually clicks "Confirm attendance" to submit

        // Step 1: Password field
        password: {
            value: USER_DATA.airtablePassword,
            selectors: [
                'input[type="password"]',
                'input[placeholder*="password" i]',
                'input[placeholder*="Password" i]',
                'input[name*="password" i]'
            ]
        },

        // Step 2: "Add Member" button
        addMemberButton: {
            text: "Add Member",
            selectors: [
                'button:contains("Add Member")',
                'a:contains("Add Member")',
                '[role="button"]:contains("Add Member")',
                'button[aria-label*="Add Member" i]'
            ]
        },

        // Step 3: Email search field in popup
        emailSearch: {
            value: USER_DATA.email,
            selectors: [
                'input[type="search"]',
                'input[type="text"][placeholder*="search" i]',
                'input[placeholder*="email" i]',
                'input[aria-label*="search" i]',
                '.search-input',
                '[role="searchbox"]'
            ]
        },

        // Step 4: Select user from results (will search for email in results)
        selectUser: {
            email: USER_DATA.email,
            selectors: [
                // Will look for element containing the email address
                `[data-email="${USER_DATA.email}"]`,
                `.user-item:contains("${USER_DATA.email}")`,
                `.member-result:contains("${USER_DATA.email}")`
            ]
        },

        // Step 5: Attendance confirmation checkbox
        confirmationCheckbox: {
            text: "I confirm that I am in attendance at the hub today.",
            selectors: [
                'input[type="checkbox"]',
                'input[role="checkbox"]',
                '[type="checkbox"][aria-label*="confirm" i]',
                '[type="checkbox"][aria-label*="attendance" i]'
            ]
        },

        // NOTE: User will manually click "Confirm attendance" button
        // This is intentionally NOT automated per requirements
    },

    // Capaciti (Microsoft Forms) form mappings
    capaciti: {
        // WORKFLOW STEPS (in order):
        // 1. Enter Capaciti email address
        // 2. Select location (JHB radio button)
        // 3. Select "Are you late?" = NO
        // 4. Leave "Why are you late?" blank
        // 5. User manually clicks Submit button

        // Step 1: Email address field
        emailField: {
            value: USER_DATA.capacitiEmail,
            selectors: [
                'input[type="email"]',
                'input[type="text"][aria-label*="email" i]',
                'input[placeholder*="email" i]',
                'input[name*="email" i]',
                'input[data-automation-id="textInput"]'
            ]
        },

        // Step 2: Location radio button (JHB)
        locationRadio: {
            value: "JHB",
            options: ["JHB", "CPT"],
            selectors: [
                'input[type="radio"][value="JHB"]',
                'input[type="radio"][aria-label*="JHB" i]',
                // Microsoft Forms often uses labels with specific text
                'label:contains("JHB") input[type="radio"]',
                // Or the input might be next to the label
                'span:contains("JHB") ~ input[type="radio"]'
            ]
        },

        // Step 3: "Are you late?" radio button (NO)
        lateStatusRadio: {
            value: "NO",
            questionText: "Are you late?",
            options: ["YES", "NO"],
            selectors: [
                'input[type="radio"][value="NO"]',
                'input[type="radio"][value="No"]',
                'input[type="radio"][aria-label*="No" i]',
                'label:contains("No") input[type="radio"]',
                'span:contains("No") ~ input[type="radio"]'
            ]
        },

        // Step 4: "Why are you late?" text field
        // This should remain BLANK by default (only fill if user is late)
        lateReasonField: {
            value: "", // Intentionally blank
            skipFill: true, // Flag to skip filling this field
            questionText: "Why are you late?",
            selectors: [
                'textarea[aria-label*="Why are you late" i]',
                'input[type="text"][aria-label*="late" i]',
                'textarea[placeholder*="reason" i]'
            ]
        },

        // NOTE: User will manually click Submit button
        // This is intentionally NOT automated per requirements
    }
};

// ============================================================================
// SELECTOR STRATEGIES
// ============================================================================

/**
 * Fallback selectors for when question text matching fails.
 * These are used as a last resort.
 */

const SELECTOR_STRATEGIES = {
    projectY: {
        // Example: First text input, second text input, etc.
        // Update these after inspecting the actual form structure
        nameField: 'input[type="text"]:nth-of-type(1)',
        locationField: 'input[type="text"]:nth-of-type(2)',
        dateField: 'input[type="date"]:nth-of-type(1)',
    },

    capaciti: {
        // Microsoft Forms typically uses specific data attributes
        nameField: 'input[data-automation-id="textInput"]',
        dateField: 'input[type="date"]',
    }
};

// ============================================================================
// AUTOMATION SETTINGS
// ============================================================================

const AUTOMATION_SETTINGS = {
    // Maximum time to wait for form elements to load (milliseconds)
    maxTimeout: 10000,

    // Polling interval for checking if elements are loaded (milliseconds)
    pollingInterval: 200,

    // Delay between filling fields (milliseconds) - helps with form validation
    fillDelay: 100,

    // Enable debug logging to console
    debugMode: true,

    // Highlight filled fields (for visual confirmation)
    highlightFields: true,

    // Highlight color and duration
    highlightColor: '#4CAF50',
    highlightDuration: 1000
};

// ============================================================================
// EXPORTS (for use in main.js)
// ============================================================================

// Make configuration available to other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        USER_DATA,
        FORM_URLS,
        FIELD_MAPPINGS,
        SELECTOR_STRATEGIES,
        AUTOMATION_SETTINGS
    };
}
