/**
 * DoubleCheck - Main Automation Engine
 * 
 * This script handles the core automation logic for filling both attendance forms.
 * It runs in the browser and interacts with DOM elements to autofill fields.
 */

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Logs messages to console with DoubleCheck prefix
 * @param {string} message - Message to log
 * @param {string} type - Log type: 'info', 'success', 'warning', 'error'
 */
function log(message, type = 'info') {
    const prefix = '🔄 DoubleCheck:';
    const styles = {
        info: 'color: #2196F3',
        success: 'color: #4CAF50; font-weight: bold',
        warning: 'color: #FF9800',
        error: 'color: #F44336; font-weight: bold'
    };

    console.log(`%c${prefix} ${message}`, styles[type]);
}

/**
 * Wait for an element to appear in the DOM
 * @param {Array} selectors - Array of CSS selectors to try
 * @param {number} timeout - Maximum time to wait in milliseconds
 * @returns {Promise<Element|null>} - Found element or null
 */
function waitForElement(selectors, timeout = AUTOMATION_SETTINGS.maxTimeout) {
    return new Promise((resolve) => {
        const startTime = Date.now();

        const checkElement = () => {
            // Try each selector
            for (const selector of selectors) {
                const element = document.querySelector(selector);
                if (element) {
                    log(`Found element with selector: ${selector}`, 'success');
                    return resolve(element);
                }
            }

            // Check timeout
            if (Date.now() - startTime > timeout) {
                log(`Timeout waiting for element. Tried selectors: ${selectors.join(', ')}`, 'warning');
                return resolve(null);
            }

            // Try again
            setTimeout(checkElement, AUTOMATION_SETTINGS.pollingInterval);
        };

        checkElement();
    });
}

/**
 * Wait for elements containing specific text
 * @param {string} text - Text to search for
 * @param {string} tagName - Tag name to search (e.g., 'button', 'label')
 * @param {number} timeout - Maximum time to wait
 * @returns {Promise<Element|null>}
 */
function waitForElementByText(text, tagName = '*', timeout = AUTOMATION_SETTINGS.maxTimeout) {
    return new Promise((resolve) => {
        const startTime = Date.now();

        const checkElement = () => {
            const elements = Array.from(document.querySelectorAll(tagName));
            const found = elements.find(el =>
                el.textContent.trim().includes(text) ||
                el.innerText?.trim().includes(text)
            );

            if (found) {
                log(`Found element with text: "${text}"`, 'success');
                return resolve(found);
            }

            if (Date.now() - startTime > timeout) {
                log(`Timeout waiting for element with text: "${text}"`, 'warning');
                return resolve(null);
            }

            setTimeout(checkElement, AUTOMATION_SETTINGS.pollingInterval);
        };

        checkElement();
    });
}

/**
 * Highlight an element (visual feedback)
 * @param {Element} element - Element to highlight
 */
function highlightElement(element) {
    if (!AUTOMATION_SETTINGS.highlightFields) return;

    const originalBorder = element.style.border;
    const originalBackground = element.style.backgroundColor;

    element.style.border = `2px solid ${AUTOMATION_SETTINGS.highlightColor}`;
    element.style.backgroundColor = `${AUTOMATION_SETTINGS.highlightColor}20`;

    setTimeout(() => {
        element.style.border = originalBorder;
        element.style.backgroundColor = originalBackground;
    }, AUTOMATION_SETTINGS.highlightDuration);
}

/**
 * Fill a text input field
 * @param {Element} element - Input element
 * @param {string} value - Value to fill
 */
async function fillTextInput(element, value) {
    if (!element || !value) return false;

    try {
        element.focus();
        element.value = value;

        // Trigger input events to ensure form validation
        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
        element.dispatchEvent(new Event('blur', { bubbles: true }));

        highlightElement(element);
        log(`Filled text field with: ${value}`, 'success');

        await delay(AUTOMATION_SETTINGS.fillDelay);
        return true;
    } catch (error) {
        log(`Error filling text field: ${error.message}`, 'error');
        return false;
    }
}

/**
 * Click a checkbox
 * @param {Element} element - Checkbox element
 */
async function clickCheckbox(element) {
    if (!element) return false;

    try {
        if (!element.checked) {
            element.click();
            element.dispatchEvent(new Event('change', { bubbles: true }));
            highlightElement(element);
            log('Checkbox checked', 'success');
        }

        await delay(AUTOMATION_SETTINGS.fillDelay);
        return true;
    } catch (error) {
        log(`Error clicking checkbox: ${error.message}`, 'error');
        return false;
    }
}

/**
 * Click a radio button
 * @param {Element} element - Radio button element
 */
async function clickRadio(element) {
    if (!element) return false;

    try {
        element.click();
        element.dispatchEvent(new Event('change', { bubbles: true }));
        highlightElement(element);
        log(`Radio button selected`, 'success');

        await delay(AUTOMATION_SETTINGS.fillDelay);
        return true;
    } catch (error) {
        log(`Error clicking radio button: ${error.message}`, 'error');
        return false;
    }
}

/**
 * Click a button
 * @param {Element} element - Button element
 */
async function clickButton(element) {
    if (!element) return false;

    try {
        element.click();
        log('Button clicked', 'success');

        await delay(AUTOMATION_SETTINGS.fillDelay);
        return true;
    } catch (error) {
        log(`Error clicking button: ${error.message}`, 'error');
        return false;
    }
}

/**
 * Delay execution
 * @param {number} ms - Milliseconds to wait
 */
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ============================================================================
// AIRTABLE FORM AUTOMATION
// ============================================================================

async function autofillAirtableForm() {
    log('Starting Airtable form automation...', 'info');

    try {
        // Step 1: Enter password
        log('Step 1: Looking for password field...', 'info');
        const passwordField = await waitForElement(FIELD_MAPPINGS.projectY.password.selectors);
        if (passwordField) {
            await fillTextInput(passwordField, FIELD_MAPPINGS.projectY.password.value);

            // Look for Enter button or press Enter
            const enterKey = new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', keyCode: 13, bubbles: true });
            passwordField.dispatchEvent(enterKey);
            await delay(1000); // Wait for form to load after password
        } else {
            log('Password field not found. Form may already be unlocked.', 'warning');
        }

        // Step 2: Click "Add Member" button
        log('Step 2: Looking for "Add Member" button...', 'info');
        await delay(500);
        const addMemberButton = await waitForElementByText('Add Member', 'button');
        if (addMemberButton) {
            await clickButton(addMemberButton);
            await delay(1000); // Wait for popup to open
        } else {
            log('Add Member button not found', 'error');
            return;
        }

        // Step 3: Search for email in popup
        log('Step 3: Looking for search field...', 'info');
        const searchField = await waitForElement(FIELD_MAPPINGS.projectY.emailSearch.selectors);
        if (searchField) {
            await fillTextInput(searchField, FIELD_MAPPINGS.projectY.emailSearch.value);
            await delay(1000); // Wait for search results
        } else {
            log('Search field not found', 'error');
            return;
        }

        // Step 4: Select user from search results
        log('Step 4: Looking for user in search results...', 'info');
        const userElement = await waitForElementByText(USER_DATA.email, 'div');
        if (userElement) {
            // Click the parent element that contains the email
            const clickableParent = userElement.closest('button, a, [role="button"], .selectable, .user-item, .member-result') || userElement;
            await clickButton(clickableParent);
            await delay(500);
        } else {
            log('User not found in search results', 'error');
            return;
        }

        // Step 5: Tick attendance confirmation checkbox
        log('Step 5: Looking for confirmation checkbox...', 'info');
        const checkbox = await waitForElement(FIELD_MAPPINGS.projectY.confirmationCheckbox.selectors);
        if (checkbox) {
            await clickCheckbox(checkbox);
        } else {
            // Try finding by label text
            const checkboxLabel = await waitForElementByText('I confirm that I am in attendance', 'label');
            if (checkboxLabel) {
                const checkboxInput = checkboxLabel.querySelector('input[type="checkbox"]') ||
                    document.querySelector(`#${checkboxLabel.getAttribute('for')}`);
                if (checkboxInput) {
                    await clickCheckbox(checkboxInput);
                }
            } else {
                log('Confirmation checkbox not found', 'warning');
            }
        }

        log('✅ Airtable form automation complete! Please review and click "Confirm attendance"', 'success');

    } catch (error) {
        log(`Error in Airtable automation: ${error.message}`, 'error');
    }
}

// ============================================================================
// MICROSOFT FORMS AUTOMATION
// ============================================================================

async function autofillMicrosoftForm() {
    log('Starting Microsoft Forms automation...', 'info');

    try {
        // Wait for form to load
        await delay(1000);

        // Step 1: Fill email field
        log('Step 1: Looking for email field...', 'info');
        const emailField = await waitForElement(FIELD_MAPPINGS.capaciti.emailField.selectors);
        if (emailField) {
            await fillTextInput(emailField, FIELD_MAPPINGS.capaciti.emailField.value);
        } else {
            log('Email field not found', 'error');
        }

        // Step 2: Select JHB location
        log('Step 2: Looking for JHB location radio button...', 'info');
        let locationRadio = await waitForElement(FIELD_MAPPINGS.capaciti.locationRadio.selectors);

        // Alternative: Find by label text
        if (!locationRadio) {
            const jhbLabel = await waitForElementByText('JHB', 'label');
            if (jhbLabel) {
                locationRadio = jhbLabel.querySelector('input[type="radio"]');
            }
        }

        if (locationRadio) {
            await clickRadio(locationRadio);
        } else {
            log('JHB location radio button not found', 'warning');
        }

        // Step 3: Select "Are you late?" = NO
        log('Step 3: Looking for "Are you late?" NO option...', 'info');
        let lateRadio = await waitForElement(FIELD_MAPPINGS.capaciti.lateStatusRadio.selectors);

        // Alternative: Find by label text
        if (!lateRadio) {
            // Find all radio buttons and look for "No" option
            const labels = Array.from(document.querySelectorAll('label'));
            const noLabel = labels.find(label =>
                label.textContent.trim().toLowerCase() === 'no' ||
                label.textContent.trim().toLowerCase() === 'no '
            );

            if (noLabel) {
                lateRadio = noLabel.querySelector('input[type="radio"]');
            }
        }

        if (lateRadio) {
            await clickRadio(lateRadio);
        } else {
            log('"Are you late? NO" radio button not found', 'warning');
        }

        // Step 4: Leave "Why are you late?" blank (skip)
        log('Step 4: Skipping "Why are you late?" field (intentionally blank)', 'info');

        log('✅ Microsoft Forms automation complete! Please review and click Submit', 'success');

    } catch (error) {
        log(`Error in Microsoft Forms automation: ${error.message}`, 'error');
    }
}

// ============================================================================
// FORM DETECTION AND LAUNCHER
// ============================================================================

/**
 * Detect which form we're on and run appropriate automation
 */
function detectAndAutofill() {
    const currentUrl = window.location.href;

    if (currentUrl.includes('airtable.com')) {
        log('Detected Airtable form', 'info');
        autofillAirtableForm();
    } else if (currentUrl.includes('forms.office.com')) {
        log('Detected Microsoft Forms', 'info');
        autofillMicrosoftForm();
    } else {
        log('Unknown form URL. Automation not triggered.', 'warning');
    }
}

/**
 * Launch both forms in new tabs (called from index.html)
 */
function launchForms() {
    log('Launching attendance forms...', 'info');

    // Open both forms in new tabs
    const airtableTab = window.open(FORM_URLS.projectY, '_blank');
    const capacitiTab = window.open(FORM_URLS.capaciti, '_blank');

    if (airtableTab && capacitiTab) {
        log('✅ Both forms opened successfully!', 'success');
        log('Automation will run automatically in each tab.', 'info');
    } else {
        log('⚠️ Pop-up blocker may have prevented forms from opening. Please allow pop-ups.', 'warning');
    }
}

// ============================================================================
// AUTO-INITIALIZATION
// ============================================================================

// If we're on a form page, auto-run the appropriate automation
if (window.location.href !== FORM_URLS.projectY &&
    window.location.href !== FORM_URLS.capaciti) {
    // We're on the launcher page - do nothing, wait for button click
    log('DoubleCheck ready. Click "Mark Attendance" to launch forms.', 'info');
} else {
    // We're on one of the form pages - run automation
    log('Form page detected. Starting automation in 2 seconds...', 'info');
    setTimeout(detectAndAutofill, 2000);
}
