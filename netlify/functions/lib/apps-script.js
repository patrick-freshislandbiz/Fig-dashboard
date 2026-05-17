/* global process */

export function isAppsScriptConfigured() {
  return Boolean(process.env.GOOGLE_APPS_SCRIPT_URL)
}

export async function appendSlackRecordToAppsScript(record) {
  const response = await fetch(process.env.GOOGLE_APPS_SCRIPT_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      action: 'appendSlackRecord',
      record,
    }),
  })

  const result = await response.json().catch(() => ({}))
  if (!response.ok || result.ok === false) {
    throw new Error(result.error || 'Apps Script rejected the Slack record.')
  }
}

export async function readSlackRecordsFromAppsScript() {
  const response = await fetch(process.env.GOOGLE_APPS_SCRIPT_URL)
  const result = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(result.error || 'Unable to read Apps Script records.')
  }

  return result.records || []
}

export async function readDashboardDataFromAppsScript() {
  const url = new URL(process.env.GOOGLE_APPS_SCRIPT_URL)
  url.searchParams.set('action', 'dashboardData')
  const response = await fetch(url)
  const result = await response.json().catch(() => ({}))

  if (!response.ok || result.ok === false) {
    throw new Error(result.error || 'Unable to read dashboard data.')
  }

  return result.data || {}
}

export async function replaceDashboardDataInAppsScript(data) {
  const response = await fetch(process.env.GOOGLE_APPS_SCRIPT_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      action: 'replaceDashboardData',
      data,
    }),
  })
  const result = await response.json().catch(() => ({}))

  if (!response.ok || result.ok === false) {
    throw new Error(result.error || 'Unable to save dashboard data.')
  }
}
