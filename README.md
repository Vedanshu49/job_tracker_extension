To optimize this specification for an AI agent (like ChatGPT, Claude, or GitHub Copilot), the content needs **structural rigidity**. AI models perform best when data is separated from prose, logic is defined in steps, and schemas are explicit.

Here is the comprehensive specification formatted as a **Markdown (`.md`)** file. It uses Code Blocks, Bulleted Lists, and bolded Constraints to ensure the AI parses the architecture and logic correctly without hallucinating dependencies.

-----

# Technical Specification: Job Application Tracker (v2.0)

## 1\. Project Overview

**Name:** Job Application Tracker Extension
**Version:** 2.0 (Manifest V3)
**Type:** Chrome Browser Extension
**Core Function:** Privacy-focused job search management via automated scraping and active dashboard management.

**Tech Stack:**

  * **Core:** Vanilla HTML, CSS, JavaScript (No frameworks like React/Vue).
  * **Storage:** `chrome.storage.local`.
  * **Visuals:** Chart.js (Local library, no CDN).
  * **Compliance:** Strict Content Security Policy (CSP) adherence.

-----

## 2\. Directory Structure

*Strict adherence to this modular structure is required.*

```text
job-tracker-extension/
├── manifest.json              # Configuration & Permissions (Manifest V3)
├── popup/                     # UI: Extension Icon Click
│   ├── index.html
│   └── logic.js
├── scripts/                   # Content Scripts (The "Spies")
│   ├── utils.js               # Shared Logic (Namespace: TrackerUtils)
│   ├── linkedin.js            # Target: LinkedIn
│   ├── indeed.js              # Target: Indeed (Capture Phase enabled)
│   ├── internshala.js         # Target: Internshala
│   └── glassdoor.js           # Target: Glassdoor
├── dashboard/                 # UI: Main Dashboard
│   ├── index.html             # Layout & Feature Modals
│   ├── style.css              # Global, Kanban, & Modal Styles
│   ├── logic.js               # Core Controller, State, & Event Delegation
│   └── chart.js               # Third-party library (minified)
├── analytics/                 # Module: Visual Data
│   └── logic.js               # Chart rendering logic
├── kanban/                    # Module: Workflow Management
│   ├── style.css              # Kanban-specific styles
│   └── logic.js               # Drag-and-Drop State Logic
├── reminders/                 # Module: Follow-ups
│   └── logic.js               # Stale Application Logic & Mailto Gen
└── calendar/                  # Module: Scheduling
    └── logic.js               # .ics Blob Generation Logic
```

-----

## 3\. Data Schema

**Storage Key:** `jobs`
**Type:** `Array<JobObject>`
**Persistence:** `chrome.storage.local`

### JobObject Definition

```json
{
  "id": "String",           // Unique: Date.now() + Math.random().toString(16)
  "company": "String",      // Scraped from DOM
  "role": "String",         // Scraped from DOM
  "url": "String",          // window.location.href
  "platform": "String",     // Enum: ['LinkedIn', 'Indeed', 'Internshala', 'Glassdoor']
  "date": "ISO String",     // YYYY-MM-DDTHH:mm:ss.sssZ
  "status": "String",       // Enum: ['Applied', 'Interviewing', 'Assignment', 'Offer', 'Rejected']
  "note": "String",         // User Input (Optional)
  "offerDetails": "String", // User Input (Conditional: Status === Offer)
  "description": "String"   // Scraped Full Text Job Description
}
```

-----

## 4\. Core Components

### A. Manifest Configuration (`manifest.json`)

  * **Version:** 3
  * **Permissions:** `storage`, `activeTab`, `scripting`
  * **Content Scripts:** Map specific domains (e.g., `*://*.linkedin.com/*`) to specific files in `/scripts/`.
  * **Security:** `content_security_policy` must restrict remote script loading.

### B. The Scrapers (Content Scripts)

**Location:** `/scripts/*.js`
**Constraint:** Must use `TrackerUtils` (defined in `utils.js`) to prevent global namespace pollution.

1.  **Standard Mode (LinkedIn/Glassdoor/Internshala):**
      * Event Listener: `document.addEventListener('click', ...)`
      * Logic: Detect "Easy Apply" or "Submit" buttons.
2.  **Capture Mode (Indeed):**
      * Event Listener: `document.addEventListener('click', ..., true)` (useCapture set to true).
      * Reasoning: Bypasses React/Angular event stopping propagation.
3.  **Data Extraction Strategy:**
      * Use aggressive fallback selectors (e.g., `h1` -\> `.job-title` -\> `meta[name="title"]`).
      * **Payload:** Role, Company, URL, Description.

### C. The Dashboard (Core Logic)

**Location:** `/dashboard/logic.js`

1.  **Event Delegation (CSP Compliance):**
      * **Rule:** NO inline HTML events (e.g., `<button onclick="...">`).
      * **Implementation:** Attach single listener to parent containers (e.g., `#job-table-body`) and check `event.target.closest('.action-btn')`.
2.  **State Management:**
      * `loadJobs()`: Fetch from storage.
      * `renderTable()`: Generate DOM elements based on current filter/sort.
      * `updateStats()`: Recalculate counters for Status bar.
3.  **Import/Export:**
      * **Export:** Generate CSV including the `description` column.
      * **Import:** Parse CSV -\> Check Duplicates (via URL) -\> Merge -\> Save.

-----

## 5\. Feature Modules (Pro Features)

### 1\. Visual Analytics

  * **Path:** `analytics/logic.js`
  * **Dependency:** Local `chart.js`.
  * **Charts:**
    1.  **Doughnut:** Jobs by `Platform`.
    2.  **Bar:** Jobs by `Status`.

### 2\. Kanban Board

  * **Path:** `kanban/logic.js`
  * **UI:** Horizontal scrolling columns corresponding to Status Enums.
  * **Interaction:** HTML5 Drag-and-Drop API.
  * **Logic:**
      * `ondragstart`: Store Job ID.
      * `ondrop`: Read Target Column ID -\> Update Job `status` in memory -\> Save to Storage -\> Refresh UI.

### 3\. Smart Reminders

  * **Path:** `reminders/logic.js`
  * **Logic:**
      * Filter: `status === 'Applied'` AND `date < (Today - 7 days)`.
  * **Action:** Generate `mailto:` link.
      * Subject: "Following up on my application for [Role]"
      * Body: Template placeholder text.

### 4\. Interview Scheduler

  * **Path:** `calendar/logic.js`
  * **Trigger:** Only active for jobs where `status === 'Interviewing'`.
  * **Action:** Create `.ics` file blob.
  * **Content:**
      * Event Title: Interview: [Role] at [Company]
      * Description: URL reference.

### 5\. Job Description Saver

  * **UI:** "View Desc" link in Dashboard Table.
  * **Action:** Open Modal.
  * **Content:** Read-only view of the `description` field stored in the JobObject.

-----

## 6\. Implementation Rules for AI Generation

1.  **Unique Identification:**
      * Do **not** use array indexes for identification.
      * Always use the `id` property generated at creation.
2.  **Optimistic UI:**
      * Update the DOM immediately upon user action.
      * Perform `chrome.storage.local.set` asynchronously in the background.
3.  **CSP Safety:**
      * Use `document.createElement` and `element.appendChild`.
      * Do not use `innerHTML` with unsanitized external data.
4.  **Error Handling:**
      * Wrap CSV parsing in `try-catch`.
      * Log storage errors to `console.error` via `TrackerUtils`.

-----

## 7\. Scalability Protocol

To add future modules (e.g., "Resume Analysis"):

1.  Create folder `resume-analysis/` with `logic.js` and `style.css`.
2.  Add script tag to `dashboard/index.html`.
3.  Initialize module in `dashboard/logic.js`.