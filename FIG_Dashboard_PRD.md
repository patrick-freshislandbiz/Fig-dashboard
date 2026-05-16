# Product Requirements Document: Fresh Island Global Operations Dashboard

Owner: Patrick King  
Business: Fresh Island Global  
Prepared: May 14, 2026  
Primary Client: Hopkinson Mining Logistics  
Service Location: Eugene Correia International Airport, Ogle, East Coast Demerara, Guyana  
Contract Reference: FIG-CSA-2026-001  

## 1. Purpose

Fresh Island Global needs a dynamic operations dashboard that ties together service delivery, finance, staff scheduling, document management, task tracking, calendar planning, and client-ready reporting for its professional cleaning services.

The dashboard should replace scattered spreadsheets, paper forms, loose PDFs, and manual follow-ups with one central workspace that can be hosted without an external backend. It must support day-to-day operations for the Hopkinson Mining Logistics cleaning contract and be flexible enough to support future clients.

## 2. Source Documents Reviewed

The PRD is based on the documents in the `FIG DOCUMENTS` folder:

- `FIG_Complete_Session_History_Cowork_Handoff.docx`
- `FIG_Complete_Session_History_Cowork_Handoff 2.docx`
- `business_plan.docx`
- `setup_fig_system.py`
- `FreshIslandGlobal WorkOrder Template.docx`
- `FreshIslandGlobal_WorkOrder_Template.pdf`
- `FreshIslandGlobal_WorkOrder_Template 2.pdf`
- `FreshIslandGlobal Invoice Template.pdf`
- `FIG_Invoice_Template.pdf`
- `Supplemental FIG_Invoice INV_2026_031b.docx`
- `01_Monthly_Completion_Summary.pdf`
- `03_Staff_Assignment_Sheet.pdf`
- `FIG Business Registration .pdf`
- `Scanned Document.pdf`

Note: `FIG Business Registration .pdf` and `Scanned Document.pdf` are scanned copies of the same business registration certificate. Text extraction was not available, but visual review confirms business identity and registration details.

## 3. Business Context

Fresh Island Global provides professional cleaning services in Guyana. The current priority is managing the Hopkinson Mining Logistics contract at Eugene Correia International Airport.

Known operating constants:

- Business name: Fresh Island Global
- Owner: Patrick King
- Address: Lot 612 / 612 Mocha New Scheme, East Bank Demerara, Guyana
- Phone: 592-651-2827
- Email: patrick@freshislandbiz.com
- Business registration certificate no.: 278040
- Business registration date: January 19, 2026
- Registration certificate date: January 22, 2026
- Registration renewal due: January 19, 2027
- Client: Hopkinson Mining Logistics
- Contract reference: FIG-CSA-2026-001
- Service schedule: Monday, Wednesday, Friday
- Staffing model: 2 cleaners per visit
- Visit length: 3 hours
- Standard monthly visit count: 12 visits
- Standard monthly fee: GYD 186,000
- Hourly cleaner rate: GYD 1,500
- Labour cost: GYD 108,000
- Operating cost: GYD 35,000
- Margin: GYD 43,000, approximately 30%
- Payment terms: 14 days
- Late payment fee: 2% per month after due date
- NIS employer contribution: 8.4%
- NIS employee contribution: 5.6%

## 4. Product Vision

The dashboard should be the operating command center for Fresh Island Global. It should show what work is scheduled, what has been completed, what is signed off, what is billed, what is paid, who is assigned, what tasks are overdue, what documents exist, and what needs Patrick's attention next.

The product should feel professional, modern, and easy to scan. It should be visually engaging without sacrificing clarity. Color coding, charts, status badges, animations, and calendar views should help Patrick understand the business at a glance.

## 5. Goals

1. Track all cleaning visits from schedule through client sign-off.
2. Track invoices, payment status, due dates, collections, outstanding balances, and late items.
3. Track staff assignments, weekly hours, roles, NIS details, and labour allocation.
4. Maintain a document library for contracts, invoices, work orders, completion summaries, staff records, templates, and registration documents.
5. Provide task management for operational follow-ups, compliance items, supplies, client communication, and internal admin.
6. Provide calendar planning for visits, invoice due dates, task deadlines, and future work.
7. Enable data entry and file capture from the dashboard and, where feasible, from Slack.
8. Operate without a custom external backend by using browser storage plus Google Drive/Google Sheets as the live database.
9. Support demo mode when Google integration is not connected.
10. Prepare the system for multi-client expansion.

## 6. Non-Goals For Version 1

- Full accounting system replacement.
- Payroll processing or statutory filing submission.
- Native mobile app.
- Custom hosted backend or database server.
- Real-time multi-user collaboration beyond what Google Sheets/Drive can support.
- Full WhatsApp Business API or Telegram integration, unless added later through a supported provider.
- Automated legal compliance decisions.

## 7. Users

Primary user:

- Patrick King, owner/operator, responsible for oversight, billing, client follow-up, compliance, and planning.

Secondary users:

- Supervisors or staff who may submit visit updates, tasks, notes, photos, or work order information.
- Client representatives who sign off on completed work, either physically or digitally in a future version.

Named staff defaults from source documents:

- Marcus Thomas, Senior Cleaner, 592-621-3456, NIS-10234
- Keisha Rodrigues, Cleaner, 592-614-7891, NIS-10235
- Devon James, Cleaner, 592-633-9012, NIS-10289

## 8. Core User Journeys

### 8.1 Daily Operations Check

Patrick opens the dashboard and immediately sees:

- Today's scheduled visits
- Pending signatures
- Overdue tasks
- Upcoming invoice due dates
- Unread staff or bot messages
- Recent work order activity

### 8.2 Create And Complete A Work Order

Patrick or a supervisor creates a work order with:

- WO number
- Client
- Location
- Contract reference
- Date and day of week
- Visit number for month
- Arrival time
- Departure time
- Staff member 1
- Staff member 2
- Cleaning checklist
- Notes, incidents, access issues, missing supplies, or damage
- Service provider sign-off
- Client representative sign-off

### 8.3 Monthly Billing

At month end, Patrick reviews:

- Actual visits completed
- Total hours contracted vs delivered
- Missed, rescheduled, or incomplete visits
- Signed work orders
- Monthly completion summary
- Invoice amount
- Invoice status and due date

The system should make it easy to attach or reference signed work orders and a completion summary when issuing the invoice.

### 8.4 Payment Follow-Up

Patrick views finance KPIs and invoice tables to identify:

- Sent but unpaid invoices
- Overdue invoices
- Payment collection rate
- Paid date
- Late fees, if any
- Notes and follow-up tasks

### 8.5 Staff Scheduling

Patrick uses the staff view and calendar to:

- Assign staff to Monday, Wednesday, and Friday visits
- Track weekly hours
- See substitutions or schedule changes
- Maintain staff contact and NIS information
- Estimate NIS contributions

### 8.6 Document Management

Patrick uploads or organizes:

- Contracts
- Work order templates
- Signed work orders
- Invoices
- Monthly completion summaries
- Staff assignment sheets
- Business registration documents
- Client onboarding documents
- Equipment and supplies checklists
- Incident and damage reports

### 8.7 Messaging App Capture

Staff can send quick updates through a connected Slack workspace or channel. Version 1 should prioritize Slack for operational messages, while Google Sheets and Google Drive remain the live data and document storage layer.

Example commands:

- `/task <description>` creates a task.
- `/wo <date> <staff1> <staff2>` creates a work order entry.
- `/note <text>` saves an operational note.
- `/status` returns a dashboard summary.

## 9. Information Architecture

Version 1 should include these main views:

1. Dashboard Overview
2. Calendar
3. Finance
4. Work Orders
5. Tasks
6. Staff
7. Documents
8. Messages
9. Settings

The navigation should be persistent, with clear status indicators for demo mode, Google connection, and messaging connection.

## 10. Functional Requirements

### 10.1 Dashboard Overview

The overview must include:

- Greeting and contract summary
- KPI cards:
  - Monthly billed
  - Total collected
  - Outstanding amount
  - Visits this month
  - Pending client sign-offs
  - Overdue tasks
  - Unread messages
- Revenue chart showing billed vs collected
- Recent activity feed
- Pending sign-offs table
- Priority tasks table
- Invoice status summary
- Visual status colors for paid, sent, overdue, completed, pending, and draft

### 10.2 Calendar

The calendar must include:

- Monthly grid with previous, next, and today controls
- Color-coded event types:
  - Work orders
  - Tasks
  - Invoice due dates
  - Registration/compliance renewal dates
- Right-side detail panel for selected day
- Upcoming 7 days list
- Add visit modal
- Ability to create planned visits for Monday, Wednesday, and Friday schedules

### 10.3 Finance

The finance view must include:

- Total billed
- Total collected
- Outstanding
- Collection rate
- Revenue trend chart
- Payment status breakdown
- Invoice table with filters:
  - All
  - Draft
  - Sent
  - Paid
  - Overdue
- New invoice form:
  - Invoice number
  - Client
  - Period
  - Invoice date
  - Due date
  - Amount
  - Status
  - Work order references
  - Notes
- Edit invoice form:
  - Change status
  - Mark paid
  - Paid date
  - Payment notes
- Late payment visibility for invoices past due

Default invoice records should include:

- INV-2026-001, February 2026, GYD 186,000, due February 15, 2026
- INV-2026-031, April 2026, GYD 175,900, due April 15, 2026
- INV-2026-031b, February 2026 supplemental, GYD 22,800, due April 15, 2026

The prior handoff also references older mock invoice records for January, February, and March 2026. Version 1 should allow these to be imported or replaced with verified records.

### 10.4 Work Orders

The work order view must include:

- Work order table:
  - WO number
  - Date
  - Day
  - Arrival
  - Departure
  - Staff 1
  - Staff 2
  - Status
  - Client representative
  - Signed date
  - Notes
- Search by WO number, staff, date, or client representative
- Filters:
  - All
  - Draft
  - Scheduled
  - Completed
  - Pending signature
  - Signed
  - Issue reported
- New work order modal
- Sign-off modal
- Cleaning checklist based on the work order template:
  - Floor sweeping
  - Floor mopping / wet cleaning
  - Dusting surfaces, furniture, fixtures
  - Restroom toilets, urinals, sinks
  - Restroom mirrors and counters
  - Restock restroom consumables, if supplied by client
  - High-touch door handles and light switches
  - High-touch countertops and handrails
  - Waste collection
  - Waste disposal
  - Common areas and reception
  - Interior windows/glass, if in scope
- Incident, damage, missing supplies, and access issue notes
- Export or print-ready work order record in a later version

### 10.5 Tasks

The task view must include:

- Kanban columns:
  - To do
  - In progress
  - Done
- Task fields:
  - Title
  - Description
  - Priority
  - Status
  - Due date
  - Assigned to
  - Created date
  - Completed date
  - Related client
  - Related work order or invoice
- Priority badges:
  - High
  - Medium
  - Low
- Overdue highlighting
- Add, edit, complete, and delete task actions

Default tasks should include:

- Obtain airport security passes for Devon James
- Send invoice follow-up
- Order restroom consumables
- Schedule quarterly equipment maintenance
- Submit NIS contributions
- Review and sign work orders
- Client check-in call
- Renew business registration before January 19, 2027

### 10.6 Staff

The staff view must include:

- Staff count
- Active staff count
- Monthly labour allocation
- Staff cards with:
  - Name
  - Role
  - Phone
  - NIS number
  - Hire date
  - Status
  - Visit count
- Staff detail modal
- Add staff modal
- Weekly hours summary
- NIS contribution estimate:
  - Estimated wage
  - Employer NIS 8.4%
  - Employee NIS 5.6%
  - Total contribution
- Ability to assign staff to work orders and calendar visits

### 10.7 Documents

The document view must include:

- Total document count
- Document type counts:
  - PDF
  - Word
  - Spreadsheet or data
  - Other
- Storage/status indicator
- Drag-and-drop upload
- Google Drive upload when authenticated
- Demo/local mode warning when not authenticated
- Document list with:
  - File name
  - Category
  - File type
  - Size
  - Modified date
  - Source folder/path or Drive URL
- Search by file name
- Filter by category:
  - Contract
  - Finance
  - Operations
  - HR
  - Marketing
  - Compliance
  - Template
- Preload the current FIG documents as known records

### 10.8 Messages

The messages view must include:

- Slack connection status
- Connect/disconnect demo control
- Message feed grouped by date
- Unread message highlighting
- Slack command reference
- Demo message composer
- Slack setup guidance for webhook/channel configuration
- Processing rules:
  - `/task` creates task
  - `/wo` creates work order
  - `/note` saves note
  - `/status` replies with summary
- Store Slack webhook/channel configuration locally in browser storage

Slack should be the default messaging integration for Version 1. Telegram and WhatsApp can be revisited later if needed.

### 10.9 Settings

Settings must include:

- Integration status:
  - Google Auth
  - Google Sheets
  - Google Drive
  - Slack
- Google OAuth Client ID field
- Google Spreadsheet ID field
- Save configuration button
- Connect to Google button
- Slack webhook URL field
- Slack channel ID field
- Save Slack configuration button
- App version and data privacy note
- Reset demo data action
- Export all data action
- Import data action

## 11. Data Model

Google Sheets should be the live database. The app should create or expect these sheets:

### 11.1 `clients`

- id
- name
- contact_name
- phone
- email
- address
- service_location
- contract_ref
- status
- notes

### 11.2 `visits`

- id
- wo_number
- client_id
- date
- day
- arrival
- departure
- staff1
- staff2
- client_signed
- client_rep
- client_signed_date
- notes
- status

### 11.3 `work_orders`

- id
- wo_number
- client_id
- contract_ref
- date
- day
- visit_number
- arrival
- departure
- staff1
- staff2
- checklist_json
- issue_notes
- status
- service_provider_signed
- client_rep
- signed_date
- file_url

### 11.4 `invoices`

- id
- invoice_no
- client_id
- date
- due_date
- period
- amount_gyd
- status
- paid_date
- work_order_refs
- late_fee_amount
- notes
- file_url

### 11.5 `tasks`

- id
- title
- description
- priority
- status
- due_date
- assigned_to
- related_type
- related_id
- created_at
- completed_at

### 11.6 `staff`

- id
- name
- phone
- nis
- role
- hire_date
- wage_estimate
- status
- notes

### 11.7 `documents`

- id
- filename
- category
- type
- size
- modified_date
- source
- drive_file_id
- url
- related_type
- related_id
- notes

### 11.8 `messages`

- id
- source
- sender
- text
- timestamp
- file_url
- processed
- action_created
- related_id

### 11.9 `settings`

- key
- value

## 12. Reporting Requirements

The dashboard should support:

- Monthly completion summary
- Invoice support package:
  - Invoice
  - Signed work orders
  - Monthly completion summary
- Visit completion report
- Outstanding invoice report
- Staff hours summary
- NIS contribution summary
- Task overdue report
- Document inventory
- Compliance reminder report

Version 1 may display these reports on screen. PDF generation can be a later enhancement.

## 13. Design Requirements

Brand colors from the source documents:

- Navy: `#1F4E79`
- Mid Blue: `#2E75B6`
- Light Blue: `#D6E4F0`
- Green: `#1E6B3C`
- Orange: `#C55A11`
- Gold: `#C9A227`
- Red: `#C00000`
- Purple: `#5B2C6F`
- Page background: `#F0F4F8`

The interface should use:

- Persistent sidebar navigation
- Clear page headers
- Compact KPI cards
- Status badges
- Tables for operational records
- Charts for finance and KPI tracking
- Calendar color coding
- Modal forms for creation/editing
- Subtle animations on view changes and KPI counters
- Responsive layout for desktop and tablet

The system should prioritize fast scanning over decorative layouts.

## 14. Technical Requirements

Recommended stack from the source handoff:

- React 18
- Vite
- Tailwind CSS
- Recharts
- Lucide React
- date-fns
- Google Identity Services
- Google Sheets API
- Google Drive API
- Slack API / Incoming Webhooks
- Browser `localStorage` for config and demo mode

Hosting:

- Static hosting, preferably Netlify
- No custom external backend
- Build output: `dist`

Existing deployment target from handoff:

- Site name: fig-dashboard
- URL: https://fig-dashboard.netlify.app
- Site ID: 5b3cdbca-ca3b-4135-b99c-ccc2cddc8f3f

## 15. Integration Requirements

### 15.1 Google Sheets

The app must:

- Connect via Google OAuth
- Read and write dashboard records
- Create missing tabs and headers where possible
- Fall back to demo mode if credentials are missing
- Show connection state clearly

### 15.2 Google Drive

The app should:

- Upload documents when authenticated
- Store Drive file IDs/URLs in the `documents` sheet
- Allow document records to be linked to invoices, work orders, clients, or staff

### 15.3 Slack

The app should:

- Store Slack webhook URL and channel ID locally
- Send outbound Slack alerts through a serverless function
- Prefer `SLACK_WEBHOOK_URL` as a Netlify environment variable for deployed use
- Receive `/fig` slash commands through `/.netlify/functions/slack-command`
- Store inbound Slack records and Slack-created tasks in Google Sheets through a Google Apps Script web app when `GOOGLE_APPS_SCRIPT_URL` is configured
- Fall back to service-account Sheets storage or temporary Netlify storage only when Apps Script is not configured
- Let the dashboard Messages view sync inbound Slack records
- Support command-style message capture in demo mode
- Prepare for Slack Events API or connector-based live reads
- Parse supported commands
- Create records from messages
- Show confirmations where feasible

Security note: Slack webhook URLs should not be committed to source code. Deployed environments should store the webhook as `SLACK_WEBHOOK_URL` in Netlify. Full live Slack reads should use a Slack app, connector, or lightweight backend so private Slack credentials are not exposed in browser code.

## 16. Security, Privacy, And Compliance

The dashboard will store operational and personal data, including staff names, phone numbers, NIS numbers, client records, invoices, and business documents.

Requirements:

- Do not hard-code secret API keys in source code.
- Store user-provided configuration in local browser storage.
- Use Google OAuth rather than shared passwords.
- Show a privacy note in settings.
- Keep NIS and staff data out of public demo screenshots.
- Track business registration renewal before January 19, 2027.
- Support export/backup of dashboard data.

## 17. Acceptance Criteria

Version 1 is acceptable when:

1. The dashboard loads successfully in demo mode without Google credentials.
2. All 9 views are accessible from navigation.
3. Demo data reflects Fresh Island Global, Hopkinson Mining Logistics, FIG-CSA-2026-001, the standard service schedule, staff, invoices, work orders, and tasks.
4. KPI cards calculate from the underlying data.
5. Calendar shows visits, task due dates, invoice due dates, and registration renewal.
6. Finance view can create, edit, delete, and mark invoices as paid.
7. Work orders can be created, edited, deleted, completed, and marked signed.
8. Tasks can be created, edited, moved, completed, and deleted.
9. Staff records can be created, viewed, edited, and deleted.
10. Documents view lists the current FIG document library and can add/upload document records.
11. Settings can save Google and Slack configuration.
12. Google Sheets integration can read/write configured sheets.
13. Google Drive upload works when authenticated.
14. Slack demo capture can create at least tasks and notes.
15. The app builds successfully with `npm run build`.

## 18. Version 1 Implementation Priorities

Priority 1:

- Static React dashboard shell
- Demo data
- Dashboard overview
- Calendar
- Finance
- Work orders
- Tasks
- Staff
- Documents
- Settings

Priority 2:

- Google Sheets read/write
- Google Drive upload
- Data import/export
- Slack message capture and webhook configuration

Priority 3:

- Report generation
- PDF export
- Multi-client support refinements
- Google Calendar sync
- Optional WhatsApp or Telegram capture
- Automated invoice generation from templates

## 19. Open Questions

1. Should the first build focus only on Hopkinson Mining Logistics, or should multi-client support be visible from day one?
2. Should signed work orders be stored as uploaded PDFs/images only, or should the dashboard also support digital signatures?
3. Should invoice totals use the GYD 186,000 standard monthly fee as the source of truth, or preserve the GYD 175,900 invoice variant as a historical record?
4. Should staff be allowed to access the dashboard directly, or should they only submit updates through Slack?
5. Which Google account will own the live Sheet and Drive folder?
6. Should business registration renewal reminders start 30, 60, or 90 days before January 19, 2027?

## 20. Recommended Next Step

Build the dashboard as a static React/Vite app in demo mode first, using the source data and document library as defaults. Once the interface is stable, connect Google Sheets and Drive as the live persistence layer, then add Slack capture.
