# Google Apps Script Setup

This is the recommended setup for this dashboard. It avoids Google Cloud service account keys and uses your Google Sheet as the app database.

## 1. Create Or Open The Sheet

Create a Google Sheet named:

```text
FIG Operations Dashboard
```

## 2. Open Apps Script

In the Sheet:

```text
Extensions -> Apps Script
```

Delete any starter code and paste the contents of:

```text
google-apps-script/Code.gs
```

At the top of the script, paste your Google Sheet ID into:

```js
const SPREADSHEET_ID = '';
```

The Sheet ID is the long value between `/d/` and `/edit` in your Google Sheet URL.

## 3. Deploy As A Web App

In Apps Script:

1. Click **Deploy**
2. Choose **New deployment**
3. Click the gear icon and select **Web app**
4. Description:

```text
FIG Dashboard API
```

5. Execute as:

```text
Me
```

6. Who has access:

```text
Anyone
```

7. Click **Deploy**
8. Authorize access if Google asks
9. Copy the **Web app URL**

## 4. Add Netlify Environment Variable

In Netlify:

```text
Project configuration -> Environment variables
```

Add:

```text
GOOGLE_APPS_SCRIPT_URL=<your Apps Script web app URL>
```

Keep these existing Slack variables:

```text
SLACK_WEBHOOK_URL
SLACK_SIGNING_SECRET
```

You do not need these service account variables for the Apps Script path:

```text
GOOGLE_SPREADSHEET_ID
GOOGLE_SERVICE_ACCOUNT_EMAIL
GOOGLE_PRIVATE_KEY
```

## 5. Redeploy

Trigger a new Netlify deploy after adding `GOOGLE_APPS_SCRIPT_URL`.

## 6. Test

In Slack:

```text
/fig task Buy restroom supplies
```

The Sheet should automatically create/update:

```text
app_data
messages
tasks
```

`app_data` stores the dashboard records for clients, invoices, work orders, tasks, staff, expenses, recurring expenses, inventory, documents, and messages. `messages` and `tasks` are also used by the Slack `/fig` command flow.

Then open the dashboard:

```text
Messages -> Sync Slack
```

The Slack record should appear in Messages, and `/fig task ...` should also appear in Tasks.

## Updating The Backend Code

Whenever `google-apps-script/Code.gs` changes:

1. Paste the updated file into Apps Script.
2. Click **Deploy -> Manage deployments**.
3. Edit the active web app deployment.
4. Choose **Version -> New version**.
5. Click **Deploy**.
6. If the Web app URL changes, update `GOOGLE_APPS_SCRIPT_URL` in Netlify and redeploy.
