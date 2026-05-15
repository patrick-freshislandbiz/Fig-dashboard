# Slack Setup

This build supports the recommended first phase: sending dashboard alerts to Slack.

## 1. Create a Slack Incoming Webhook

1. Go to https://api.slack.com/apps
2. Create a new app named `FIG Operations Dashboard`
3. Choose your workspace
4. Open **Incoming Webhooks**
5. Activate incoming webhooks
6. Add a webhook to the channel you want, such as `#fig-operations`
7. Copy the webhook URL

## 2. Local Testing

For local testing with Netlify Functions, install and run Netlify Dev:

```bash
npm install -g netlify-cli
netlify dev
```

Then open the local Netlify Dev URL and paste the webhook URL into:

```text
Settings -> Slack Configuration -> Slack Webhook URL
```

Click **Send Test Message**.

## 3. Production Setup

In Netlify, add this environment variable:

```text
SLACK_WEBHOOK_URL=<your Slack incoming webhook URL>
```

The dashboard posts through:

```text
/.netlify/functions/send-slack
```

Do not commit your Slack webhook URL to source control.

## 4. Receiving Slack Messages

Receiving messages from Slack requires a public request URL for Slack Events API or slash commands. That is the next phase after outbound alerts. The receiving function should verify Slack requests, parse commands like `/task` and `/note`, then write records into Google Sheets.
