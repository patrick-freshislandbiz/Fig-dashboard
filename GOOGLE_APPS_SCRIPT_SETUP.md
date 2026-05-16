# Google Apps Script Setup

This is the recommended setup for this dashboard. It avoids Google Cloud service account keys and writes Slack records directly into your Google Sheet.

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
messages
tasks
```

Then open the dashboard:

```text
Messages -> Sync Slack
```

The Slack record should appear in Messages, and `/fig task ...` should also appear in Tasks.
