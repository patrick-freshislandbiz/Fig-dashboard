# Google Sheets Database Setup

This setup makes inbound Slack commands permanent by storing them in Google Sheets.

## 1. Create The Spreadsheet

1. Go to https://sheets.google.com
2. Create a blank spreadsheet
3. Name it:

```text
FIG Operations Dashboard
```

4. Copy the spreadsheet ID from the URL:

```text
https://docs.google.com/spreadsheets/d/SPREADSHEET_ID_HERE/edit
```

## 2. Create A Google Cloud Service Account

1. Go to https://console.cloud.google.com
2. Create or select a project
3. Enable **Google Sheets API**
4. Go to **IAM & Admin -> Service Accounts**
5. Create a service account named:

```text
fig-dashboard-netlify
```

6. Create a JSON key for that service account
7. Download the JSON file

## 3. Share The Spreadsheet

In the downloaded JSON file, find:

```json
"client_email": "..."
```

Copy that email address.

Open the Google Sheet and share it with that service account email as **Editor**.

## 4. Add Netlify Environment Variables

In Netlify, open the dashboard site:

```text
Project configuration -> Environment variables
```

Add:

```text
GOOGLE_SPREADSHEET_ID=<your spreadsheet ID>
GOOGLE_SERVICE_ACCOUNT_EMAIL=<client_email from JSON>
GOOGLE_PRIVATE_KEY=<private_key from JSON>
```

For `GOOGLE_PRIVATE_KEY`, paste the full value from the JSON, including:

```text
-----BEGIN PRIVATE KEY-----
...
-----END PRIVATE KEY-----
```

It is okay if the key contains `\n` line breaks. The function handles them.

## 5. Redeploy

After adding the variables, trigger a new deploy in Netlify.

## 6. Test

In Slack:

```text
/fig task Buy restroom supplies
```

Then open the Google Sheet. The app will create these tabs automatically:

```text
messages
tasks
```

The dashboard can then sync the Slack record from the Sheet through:

```text
Messages -> Sync Slack
```
