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

Receiving is now supported through a Slack slash command.

### Create the `/fig` slash command

1. Go to https://api.slack.com/apps
2. Open your `FIG Operations Dashboard` app
3. Open **Slash Commands**
4. Click **Create New Command**
5. Set the command:

```text
/fig
```

6. Set the request URL:

```text
https://YOUR-NETLIFY-SITE.netlify.app/.netlify/functions/slack-command
```

7. Add a short description:

```text
Send FIG dashboard updates
```

8. Add usage hint:

```text
task Buy supplies | note Restroom supplies low | wo 2026-05-18 Marcus Keisha | status
```

9. Save the command and reinstall the app to your workspace if Slack asks.

### Add the signing secret

In your Slack app, go to **Basic Information** and copy **Signing Secret**.

In Netlify, add this environment variable:

```text
SLACK_SIGNING_SECRET=<your Slack signing secret>
```

Redeploy the site after adding it.

### Use it in Slack

```text
/fig task Buy restroom supplies
/fig note Restroom supplies running low after Wednesday visit
/fig wo 2026-05-18 Marcus Keisha
/fig status
```

Then open the dashboard **Messages** view and click **Sync Slack**.

For permanent storage, complete `GOOGLE_SHEETS_SETUP.md`. Once the Google environment variables are set in Netlify, `/fig` commands will be stored in Google Sheets instead of temporary function memory.
