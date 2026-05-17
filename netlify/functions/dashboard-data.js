import {
  isAppsScriptConfigured,
  readDashboardDataFromAppsScript,
  replaceDashboardDataInAppsScript,
} from './lib/apps-script.js'

export async function handler(event) {
  try {
    if (!isAppsScriptConfigured()) {
      return json(503, {
        ok: false,
        error: 'GOOGLE_APPS_SCRIPT_URL is not configured in Netlify.',
      })
    }

    if (event.httpMethod === 'GET') {
      const data = await readDashboardDataFromAppsScript()
      return json(200, {
        ok: true,
        data,
      })
    }

    if (event.httpMethod === 'POST') {
      const body = JSON.parse(event.body || '{}')
      await replaceDashboardDataInAppsScript(body.data || {})
      return json(200, {
        ok: true,
      })
    }

    return json(405, {
      ok: false,
      error: 'Method not allowed.',
    })
  } catch (error) {
    console.error('Dashboard data function failed.', error)
    return json(500, {
      ok: false,
      error: error.message || 'Dashboard data request failed.',
    })
  }
}

function json(statusCode, body) {
  return {
    statusCode,
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  }
}
