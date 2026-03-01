# 📋 Product Requirements Document (PRD)

## Product Name
**DoubleCheck** - Dual Attendance Automation

*Tagline: "One click. Two forms. Zero friction."*

---

## Product Context

**Organization:** Project Y x Capaciti  
**Primary User:** Single user (you)  
**Use Case:** Daily attendance tracking across two organizations

### Forms Overview
- **Form 1:** Project Y attendance (Airtable)
- **Form 2:** Capaciti attendance (Microsoft Forms)

---

## Problem Statement

You are required to complete two separate web-based attendance forms every morning:
- Project Y attendance form (Airtable)
- Capaciti attendance form (Microsoft Forms)

Both forms:
- Collect identical, static information
- Are accessed via URLs
- Require manual, repetitive data entry

This results in:
- **Wasted time** (5-10 minutes daily)
- **Cognitive friction** (context switching between forms)
- **Increased risk** of forgetting or inconsistent data entry
- **Productivity loss** (interrupts morning workflow)

---

## Objective

Create a web-based automation solution (**DoubleCheck**) that:
- ✅ Is accessible from any browser
- ✅ Requires no software installation
- ✅ Autofills all attendance fields on both forms
- ✅ Leaves final submission to the user (manual review step)
- ✅ Is triggered via one click
- ✅ Works reliably every day with zero maintenance

---

## Success Criteria

| Metric | Target |
|--------|--------|
| Time saved per day | 8-10 minutes → 30 seconds |
| Forms opened | 2 (automatic) |
| Fields autofilled | 100% of known fields |
| User actions required | Click launch button, then Submit on each form |
| Security/Privacy | All processing happens locally in browser |
| Reliability | Works consistently across days with no changes |

---

## Constraints & Assumptions

### Technical Constraints
- ❌ No backend services
- ❌ No APIs from Microsoft Forms or Airtable
- ✅ Automation must run **client-side only**
- ✅ Static data values (Option A1 from original requirements)
- ✅ Forms are publicly accessible (no authentication required)

### Design Decisions
- ✅ Manual submission is **required** (compliance/audit trail)
- ✅ Browser-based solution (no extensions)
- ✅ One-click launcher pattern

---

## Target User Profile

**Single user (you)** with the following characteristics:
- Uses Windows laptop
- Works from same office location daily
- Works across two organizations (Project Y + Capaciti)
- Comfortable using bookmarks/links
- Values automation but wants manual control over submission

---

## Functional Requirements

### FR-1: Launch Mechanism
**Description:** A public web page hosted on GitHub Pages

**Features:**
- Clean, branded landing page with "DoubleCheck" branding
- Single primary action button: **"Mark Attendance"**
- Brief explanation of what happens when clicked
- Visual indicators for Project Y and Capaciti forms

**Acceptance Criteria:**
- Page loads in under 1 second
- Button is clearly visible and accessible
- Works on bookmark or direct URL access

---

### FR-2: Form Launching
**Description:** When user clicks "Mark Attendance"

**Behavior:**
1. Open Project Y form (Airtable) in new tab
2. Open Capaciti form (Microsoft Forms) in new tab
3. Both tabs open simultaneously

**Acceptance Criteria:**
- Both tabs open within 1 second of click
- Each tab loads the correct form URL
- Original DoubleCheck tab remains open

---

### FR-3: Autofill Logic
**Description:** For each form, automatically populate all fields

**Process:**
1. Wait for page and form fields to load
2. Identify form fields using question label text
3. Fill fields using predefined static values

**Data to Autofill:**
- Name (your full name)
- Office location (your office)
- Department/role (Project Y or Capaciti specific)
- Date (current date, automatically generated)
- Any required checkboxes or radio buttons

**Field Detection Strategy (Priority Order):**
1. Match question text (innerText)
2. Match aria-label
3. Fallback by input type + index

**Timing Strategy:**
- Use polling (setInterval) to wait for fields to appear
- Max timeout: 10 seconds per form
- Fail gracefully if fields not found

**Acceptance Criteria:**
- All known fields populated within 2-5 seconds
- Correct values mapped to correct fields
- No duplicate or incorrect data

---

### FR-4: User Control
**Description:** User maintains control over submission

**Requirements:**
- ❌ **Do NOT auto-submit** (critical requirement)
- ✅ Visually indicate completion (e.g., console log, field highlight)
- ✅ User manually reviews data
- ✅ User manually clicks Submit on each form

**Acceptance Criteria:**
- Forms never submit automatically
- User can edit any field before submitting
- Clear indication when autofill is complete

---

### FR-5: Error Handling
**Description:** Graceful handling of edge cases

**Scenarios:**
- Field not found → Log warning in console, continue
- Form structure changed → Continue filling remaining fields
- Timeout reached → Log status, allow manual completion

**Requirements:**
- Never block page interaction
- Never show intrusive error messages
- Log all warnings to browser console for debugging

**Acceptance Criteria:**
- Solution never crashes or breaks form functionality
- User can always complete forms manually if automation fails
- Console logs provide clear debugging information

---

### FR-6: Security & Privacy
**Description:** Zero-trust, client-side only approach

**Guarantees:**
- ❌ No cookies stored
- ❌ No data sent externally
- ❌ No authentication handled
- ❌ No server-side components
- ✅ All logic runs in-browser
- ✅ All data stays on user's device

**Acceptance Criteria:**
- No network requests except form URLs
- No localStorage or sessionStorage usage
- Inspectable source code
- Transparent data handling

---

## Non-Functional Requirements

### Performance
- Autofill completes within **2-5 seconds** per form
- Page load time under **1 second**
- No noticeable lag or delay

### Compatibility
- **Browsers:** Chrome, Edge, Firefox (latest versions)
- **Platform:** Desktop browsers only
- **Screen sizes:** Optimized for laptop/desktop (1366px+)

### Maintainability
- Field mappings easy to update in `config.js`
- Clear separation of concerns:
  - **Config** (data values)
  - **Logic** (automation)
  - **UI** (presentation)
- Well-commented code
- Self-documenting variable names

### Reliability
- Works consistently across days
- Resilient to minor form updates
- Graceful degradation if changes occur

---

## Out of Scope

The following features are **explicitly excluded** from v1.0:

- ❌ Auto-submission of forms
- ❌ Mobile browser support
- ❌ Multi-user configuration
- ❌ Cloud automation services (Zapier, Make, etc.)
- ❌ Browser extension
- ❌ Database or backend storage
- ❌ Email notifications
- ❌ Analytics or usage tracking
- ❌ Dynamic location selection
- ❌ Time-based scheduling

---

## User Flow

```
┌─────────────────────────────────────────┐
│ 1. User opens DoubleCheck URL           │
│    (bookmarked or direct link)          │
└─────────────┬───────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│ 2. Clicks "Mark Attendance" button      │
└─────────────┬───────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│ 3. Two tabs open simultaneously:        │
│    → Tab 1: Project Y form (Airtable)   │
│    → Tab 2: Capaciti form (MS Forms)    │
└─────────────┬───────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│ 4. Autofill runs in each tab:           │
│    ✓ Name                                │
│    ✓ Office location                    │
│    ✓ Department/role                    │
│    ✓ Date (auto-generated)              │
│    ✓ Required checkboxes                │
└─────────────┬───────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│ 5. User reviews autofilled data         │
└─────────────┬───────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│ 6. User clicks Submit on each form      │
└─────────────┬───────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│ ✅ Done! (entire flow takes 30 seconds) │
└─────────────────────────────────────────┘
```

---

## 🛠 Development Plan (for Antigravity IDE)

### Tech Stack
- **Frontend:** HTML5 + Vanilla JavaScript (ES6+)
- **Hosting:** GitHub Pages
- **Dependencies:** None (zero npm packages)
- **Build Process:** None required

### Repository Structure
```
doublecheck/
├── index.html          # Main launcher page
├── main.js             # Automation engine
├── config.js           # Static data & field mappings
├── styles.css          # (Optional) Styling
├── README.md           # Documentation
└── assets/             # (Optional) Logo, icons
```

---

### Module Breakdown

#### 1. `config.js` — Static Data & Mappings
**Purpose:** Centralized configuration with zero logic

**Contents:**
```javascript
// User data
const USER_DATA = {
  name: "Your Full Name",
  officeLocation: "Your Office",
  projectYRole: "Your Project Y Role",
  capacitiRole: "Your Capaciti Role"
};

// Form URLs
const FORM_URLS = {
  projectY: "https://airtable.com/...",
  capaciti: "https://forms.office.com/..."
};

// Field mappings (question text → value)
const FIELD_MAPPINGS = {
  projectY: {
    "What is your name?": USER_DATA.name,
    "Office location?": USER_DATA.officeLocation,
    // ... more mappings
  },
  capaciti: {
    "Full Name": USER_DATA.name,
    "Location": USER_DATA.officeLocation,
    // ... more mappings
  }
};
```

**Responsibilities:**
- ✅ Store static user values
- ✅ Store form URLs
- ✅ Define field-label → value mappings
- ❌ No logic, no functions

---

#### 2. `index.html` — Launcher UI
**Purpose:** User-facing landing page

**Features:**
- "DoubleCheck" branding
- Clear description of functionality
- Single "Mark Attendance" button
- Privacy/security statement
- Instructions

**Responsibilities:**
- ✅ Display clean, professional UI
- ✅ Explain what will happen on click
- ✅ Trigger automation via button
- ✅ Load `config.js` and `main.js`

**Design Requirements:**
- Professional but minimal design
- High contrast for readability
- Clear call-to-action
- Mobile-responsive (bonus, but not required to work)

---

#### 3. `main.js` — Automation Engine
**Purpose:** Core automation logic

**Responsibilities:**
1. **Launch Handler**
   - Listen for button click
   - Open both form URLs in new tabs

2. **Injection Logic**
   - Inject autofill script into each tab
   - Handle cross-origin limitations

3. **Field Detection**
   - Wait for DOM readiness (polling)
   - Locate fields by multiple strategies
   - Match question text to config

4. **Autofill Execution**
   - Fill inputs programmatically
   - Set current date automatically
   - Handle checkboxes, radios, dropdowns

5. **Logging & Feedback**
   - Console log success/failures
   - Provide debugging information

**Key Functions:**
```javascript
// Pseudo-code structure
function launchForms() { ... }
function waitForElement(selector, timeout) { ... }
function fillField(fieldLabel, value) { ... }
function autofillForm(formType) { ... }
function getCurrentDate() { ... }
```

---

### Automation Logic Design

#### Field Detection Strategy (Priority Order)
1. **Match question text** (innerText)
   - Most reliable for Airtable/MS Forms
   - Example: Find label containing "What is your name?"

2. **Match aria-label**
   - Accessibility-first fallback
   - Example: `input[aria-label="Name"]`

3. **Fallback by input type + index**
   - Last resort if structure is predictable
   - Example: `input[type="text"]:nth-of-type(1)`

#### Timing Strategy
- Use `setInterval` polling to wait for elements
- Check every 200ms
- Max timeout: 10 seconds
- Clear interval on success or timeout
- Fail gracefully with console warnings

#### Date Handling
```javascript
function getCurrentDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`; // or format per form requirement
}
```

---

### GitHub Pages Setup

**Steps:**
1. Create public repository: `doublecheck`
2. Enable GitHub Pages on `main` branch
3. Set source to root directory
4. Access via: `https://[username].github.io/doublecheck`

**Requirements:**
- ✅ `index.html` at root
- ✅ No build step required
- ✅ All assets relative paths
- ✅ HTTPS by default

---

### README.md Content

**Sections to include:**

1. **Overview**
   - What is DoubleCheck?
   - Why it exists
   - Privacy guarantee

2. **How to Use**
   - Step-by-step instructions
   - Bookmark the page
   - Click, review, submit

3. **Setup Instructions**
   - How to update your data in `config.js`
   - How to update form URLs
   - How to deploy to GitHub Pages

4. **Privacy & Security**
   - Client-side only
   - No data leaves your browser
   - Inspect the code yourself

5. **Troubleshooting**
   - What if a field doesn't fill?
   - What if form structure changes?
   - How to debug

6. **Future Enhancements**
   - Potential features (out of scope for v1)

---

## Testing Plan

### Manual Test Cases

| Test ID | Test Case | Expected Result |
|---------|-----------|-----------------|
| TC-01 | First run on clean browser | Both forms open and autofill successfully |
| TC-02 | Run on Chrome | Full functionality works |
| TC-03 | Run on Edge | Full functionality works |
| TC-04 | Simulate missing field | Warning logged, other fields fill |
| TC-05 | Confirm no auto-submit | Forms filled but not submitted |
| TC-06 | Manually edit filled field | User can modify any field |
| TC-07 | Check console logs | Clear success/warning messages |
| TC-08 | Test date generation | Current date populated correctly |

### Pre-Launch Checklist
- [ ] All user data in `config.js` is accurate
- [ ] Both form URLs are correct and up-to-date
- [ ] Field mappings tested against live forms
- [ ] Works in Chrome, Edge, Firefox
- [ ] No auto-submit behavior
- [ ] Console logs are helpful and clear
- [ ] README is complete and accurate
- [ ] GitHub Pages deployed successfully

---

## Future Enhancements (Not in v1.0)

Ideas for later iterations:

1. **Auto-submit toggle** (optional user preference)
2. **Confirmation prompt** before opening forms
3. **Date logic override** (for backdating)
4. **Multi-location support** (if office changes)
5. **Form status indicator** (visual completion feedback)
6. **Export logs** (download autofill history)
7. **Mobile support** (responsive design + touch optimization)
8. **Browser extension** (if better cross-origin access needed)

---

## Handoff Instructions for Antigravity IDE

**Implementation Requirements:**

1. ✅ Implement the above PRD exactly as specified
2. ❌ Do NOT auto-submit forms (critical)
3. ✅ Use robust selectors (prioritize accessibility attributes)
4. ✅ Separate config from logic (modular architecture)
5. ✅ Keep solution framework-free (vanilla JS only)
6. ✅ Add clear console logging for debugging
7. ✅ Handle errors gracefully (never break form functionality)
8. ✅ Write clean, well-commented code
9. ✅ Create comprehensive README.md
10. ✅ Test with both Airtable and Microsoft Forms

**Code Quality Standards:**
- ES6+ syntax
- Descriptive variable names
- Inline comments for complex logic
- Consistent formatting (2-space indentation)
- No unnecessary dependencies

**Deliverables:**
- [ ] `index.html` - Launcher page
- [ ] `main.js` - Automation engine
- [ ] `config.js` - User data & mappings
- [ ] `README.md` - Full documentation
- [ ] `styles.css` - (Optional) Custom styling
- [ ] Deployed to GitHub Pages and working live

---

## Project Metadata

| Field | Value |
|-------|-------|
| **Project Name** | DoubleCheck |
| **Version** | 1.0.0 |
| **Author** | [Your Name] |
| **Organization** | Project Y x Capaciti |
| **Created** | January 2026 |
| **Status** | Ready for Development |
| **Priority** | High |
| **Estimated Dev Time** | 2-4 hours |

---

## Questions for Clarification

Before development begins, please confirm:

1. **User Data:**
   - Your full name (as it appears on forms)
   - Your office location (exact text)
   - Your role/department at Project Y
   - Your role/department at Capaciti

2. **Form URLs:**
   - Exact URL for Project Y Airtable form
   - Exact URL for Capaciti Microsoft Form

3. **Field Labels:**
   - Exact question text for each field (screenshot or list)
   - Required vs optional fields
   - Any dropdown options or radio button values

4. **Edge Cases:**
   - Do forms ever change structure?
   - Are there any date format preferences?
   - Any specific browser you prefer for testing?

---

**Ready to build! 🚀**

*This PRD is complete and ready for handoff to Antigravity IDE for implementation.*
