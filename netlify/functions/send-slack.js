/* global process */

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return json(405, { error: 'Method not allowed' })
  }

  try {
    const body = JSON.parse(event.body || '{}')
    const text = String(body.text || '').trim()
    const webhookUrl = process.env.SLACK_WEBHOOK_URL || String(body.webhookUrl || '').trim()

    if (!text) {
      return json(400, { error: 'Message text is required.' })
    }

    if (!webhookUrl) {
      return json(400, {
        error: 'Slack webhook URL is missing. Set SLACK_WEBHOOK_URL in Netlify or paste a webhook URL in Settings for local testing.',
      })
    }

    if (!webhookUrl.startsWith('https://hooks.slack.com/services/')) {
      return json(400, { error: 'Invalid Slack incoming webhook URL.' })
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        text,
        username: 'FIG Operations Dashboard',
        icon_emoji: ':clipboard:',
      }),
    })

    if (!response.ok) {
      const detail = await response.text()
      return json(502, { error: 'Slack rejected the message.', detail })
    }

    return json(200, { ok: true })
  } catch (error) {
    return json(500, { error: error.message || 'Unexpected Slack send error.' })
  }
}

function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      'content-type': 'application/json',
      'access-control-allow-origin': '*',
    },
    body: JSON.stringify(body),
  }
}
