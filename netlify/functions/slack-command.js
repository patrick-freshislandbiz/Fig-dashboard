/* global process, Buffer */

import { createHmac, timingSafeEqual } from 'node:crypto'
import { getStore } from '@netlify/blobs'
import {
  appendSlackRecordToAppsScript,
  isAppsScriptConfigured,
  readSlackRecordsFromAppsScript,
} from './lib/apps-script.js'
import {
  appendSlackRecordToSheets,
  isGoogleSheetsConfigured,
  readSlackRecordsFromSheets,
} from './lib/google-sheets.js'

const STORE_NAME = 'fig-slack-records'
globalThis.figSlackRecords = globalThis.figSlackRecords || []

export async function handler(event) {
  try {
    if (event.httpMethod === 'GET') {
      const records = await readRecords()
      return json(200, {
        ok: true,
        configured: {
          appsScript: isAppsScriptConfigured(),
          serviceAccountSheets: isGoogleSheetsConfigured(),
          slackSigningSecret: Boolean(process.env.SLACK_SIGNING_SECRET),
        },
        records,
      })
    }

    if (event.httpMethod !== 'POST') {
      return json(405, { error: 'Method not allowed' })
    }

    const verification = verifySlackRequest(event)
    if (!verification.ok) {
      return slackText(`FIG command reached Netlify, but Slack verification failed: ${verification.error}`)
    }

    const params = new URLSearchParams(event.body || '')
    const rawText = String(params.get('text') || '').trim()
    const userName = params.get('user_name') || params.get('user_id') || 'Slack user'
    const channelName = params.get('channel_name') || params.get('channel_id') || 'Slack'
    const parsed = parseFigCommand(rawText)
    const record = {
      id: `slack-${Date.now()}`,
      source: 'Slack',
      sender: userName,
      channel: channelName,
      text: rawText || '/fig status',
      command: parsed.command,
      payload: parsed.payload,
      timestamp: new Date().toISOString(),
      processed: parsed.valid,
      actionCreated: parsed.actionCreated,
    }

    const saveResult = await saveRecord(record)

    return slackText(saveResult.ok ? parsed.reply : `${parsed.reply}\nDatabase warning: ${saveResult.error}`)
  } catch (error) {
    console.error('Unhandled Slack command error.', error)
    return slackText(`FIG command reached Netlify, but the function crashed: ${error.message || 'Unknown error'}`)
  }
}

async function saveRecord(record) {
  globalThis.figSlackRecords = [record, ...globalThis.figSlackRecords].slice(0, 100)

  try {
    if (isAppsScriptConfigured()) {
      await withTimeout(
        appendSlackRecordToAppsScript(record),
        1400,
        'Apps Script took too long to respond. Check the deployment URL and permissions.',
      )
      return { ok: true }
    }

    if (isGoogleSheetsConfigured()) {
      await withTimeout(
        appendSlackRecordToSheets(record),
        1400,
        'Google Sheets took too long to respond.',
      )
      return { ok: true }
    }

    try {
      const store = getBlobStore()
      await store.setJSON(record.id, record)
      return { ok: true }
    } catch (error) {
      console.warn('Netlify Blobs unavailable; using warm function memory only.', error.message)
      return { ok: true }
    }
  } catch (error) {
    console.error('Slack record database save failed.', error)
    return {
      ok: false,
      error: error.message || 'Unable to save record. Check GOOGLE_APPS_SCRIPT_URL and Apps Script deployment.',
    }
  }
}

function withTimeout(promise, timeoutMs, message) {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error(message)), timeoutMs)
    }),
  ])
}

async function readRecords() {
  if (isAppsScriptConfigured()) {
    return readSlackRecordsFromAppsScript()
  }

  if (isGoogleSheetsConfigured()) {
    return readSlackRecordsFromSheets()
  }

  try {
    const store = getBlobStore()
    const listed = await store.list()
    const records = await Promise.all(
      listed.blobs.map(async (blob) => store.get(blob.key, { type: 'json' })),
    )

    return records
      .filter(Boolean)
      .sort((a, b) => String(b.timestamp).localeCompare(String(a.timestamp)))
      .slice(0, 100)
  } catch (error) {
    console.warn('Netlify Blobs unavailable; reading warm function memory only.', error.message)
    return globalThis.figSlackRecords || []
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

function parseFigCommand(input) {
  const [command = 'status', ...rest] = input.split(/\s+/)
  const payload = rest.join(' ').trim()

  if (!input || command === 'status') {
    return {
      valid: true,
      command: 'status',
      payload: '',
      actionCreated: 'status-request',
      reply: 'FIG status request received. Open the dashboard Messages view to sync Slack records.',
    }
  }

  if (command === 'task') {
    if (!payload) {
      return { valid: false, command, payload, actionCreated: '', reply: 'Usage: /fig task Buy restroom supplies' }
    }
    return {
      valid: true,
      command,
      payload,
      actionCreated: 'task',
      reply: `Task captured: ${payload}`,
    }
  }

  if (command === 'note') {
    if (!payload) {
      return { valid: false, command, payload, actionCreated: '', reply: 'Usage: /fig note Restroom supplies are low' }
    }
    return {
      valid: true,
      command,
      payload,
      actionCreated: 'note',
      reply: `Note captured: ${payload}`,
    }
  }

  if (command === 'wo') {
    if (!payload) {
      return { valid: false, command, payload, actionCreated: '', reply: 'Usage: /fig wo 2026-05-18 Marcus Keisha' }
    }
    return {
      valid: true,
      command,
      payload,
      actionCreated: 'work-order',
      reply: `Work order update captured: ${payload}`,
    }
  }

  return {
    valid: false,
    command,
    payload,
    actionCreated: '',
    reply: 'Unknown FIG command. Try: /fig task <text>, /fig note <text>, /fig wo <date staff>, or /fig status.',
  }
}

function verifySlackRequest(event) {
  const signingSecret = process.env.SLACK_SIGNING_SECRET

  if (!signingSecret) {
    return { ok: true }
  }

  const timestamp = event.headers['x-slack-request-timestamp'] || event.headers['X-Slack-Request-Timestamp']
  const signature = event.headers['x-slack-signature'] || event.headers['X-Slack-Signature']

  if (!timestamp || !signature) {
    return { ok: false, status: 401, error: 'Missing Slack signature headers.' }
  }

  const ageSeconds = Math.abs(Math.floor(Date.now() / 1000) - Number(timestamp))
  if (ageSeconds > 60 * 5) {
    return { ok: false, status: 401, error: 'Stale Slack request.' }
  }

  const base = `v0:${timestamp}:${event.body || ''}`
  const expected = `v0=${createHmac('sha256', signingSecret).update(base).digest('hex')}`
  const expectedBuffer = Buffer.from(expected, 'utf8')
  const actualBuffer = Buffer.from(signature, 'utf8')

  if (expectedBuffer.length !== actualBuffer.length || !timingSafeEqual(expectedBuffer, actualBuffer)) {
    return { ok: false, status: 401, error: 'Invalid Slack signature.' }
  }

  return { ok: true }
}

function json(statusCode, body) {
  return {
    statusCode,
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  }
}

function slackText(text) {
  return json(200, {
    response_type: 'ephemeral',
    text,
  })
}
