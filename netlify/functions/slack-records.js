/* global process */

import { getStore } from '@netlify/blobs'
import { isAppsScriptConfigured, readSlackRecordsFromAppsScript } from './lib/apps-script.js'
import { isGoogleSheetsConfigured, readSlackRecordsFromSheets } from './lib/google-sheets.js'

const STORE_NAME = 'fig-slack-records'

export async function handler(event) {
  if (event.httpMethod !== 'GET') {
    return json(405, { error: 'Method not allowed' })
  }

  try {
    if (isAppsScriptConfigured()) {
      return json(200, { records: await readSlackRecordsFromAppsScript() })
    }

    if (isGoogleSheetsConfigured()) {
      return json(200, { records: await readSlackRecordsFromSheets() })
    }

    const store = getBlobStore()
    const listed = await store.list()
    const records = await Promise.all(
      listed.blobs.map(async (blob) => store.get(blob.key, { type: 'json' })),
    )

    return json(200, {
      records: records
        .filter(Boolean)
        .sort((a, b) => String(b.timestamp).localeCompare(String(a.timestamp)))
        .slice(0, 100),
    })
  } catch (error) {
    return json(500, { error: error.message || 'Unable to load Slack records.' })
  }
}

function getBlobStore() {
  const siteID = process.env.NETLIFY_SITE_ID || process.env.SITE_ID
  const token = process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN

  if (siteID && token) {
    return getStore(STORE_NAME, { siteID, token })
  }

  return getStore(STORE_NAME)
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
