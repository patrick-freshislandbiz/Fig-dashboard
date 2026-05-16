/* global process */

import { google } from 'googleapis'

const MESSAGE_HEADERS = [
  'id',
  'source',
  'sender',
  'channel',
  'text',
  'command',
  'payload',
  'timestamp',
  'processed',
  'action_created',
]

const TASK_HEADERS = [
  'id',
  'title',
  'description',
  'priority',
  'status',
  'due_date',
  'assigned_to',
  'created_at',
  'completed_at',
]

export function isGoogleSheetsConfigured() {
  return Boolean(
    process.env.GOOGLE_SPREADSHEET_ID &&
      process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
      process.env.GOOGLE_PRIVATE_KEY,
  )
}

export async function appendSlackRecordToSheets(record) {
  const sheets = await getSheetsClient()
  const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID
  await ensureSheet(sheets, spreadsheetId, 'messages', MESSAGE_HEADERS)
  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: 'messages!A:J',
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [[
        record.id,
        record.source,
        record.sender,
        record.channel,
        record.text,
        record.command,
        record.payload,
        record.timestamp,
        String(Boolean(record.processed)),
        record.actionCreated,
      ]],
    },
  })

  if (record.command === 'task' && record.payload) {
    await ensureSheet(sheets, spreadsheetId, 'tasks', TASK_HEADERS)
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'tasks!A:I',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[
          `task-${record.id}`,
          record.payload,
          `Created from Slack by ${record.sender}.`,
          'medium',
          'todo',
          '',
          'Patrick King',
          record.timestamp,
          '',
        ]],
      },
    })
  }
}

export async function readSlackRecordsFromSheets() {
  const sheets = await getSheetsClient()
  const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID
  await ensureSheet(sheets, spreadsheetId, 'messages', MESSAGE_HEADERS)
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: 'messages!A:J',
  })
  const rows = response.data.values || []
  return rows
    .slice(1)
    .map((row) => ({
      id: row[0],
      source: row[1],
      sender: row[2],
      channel: row[3],
      text: row[4],
      command: row[5],
      payload: row[6],
      timestamp: row[7],
      processed: row[8] === 'true' || row[8] === 'TRUE',
      actionCreated: row[9],
    }))
    .filter((record) => record.id)
    .sort((a, b) => String(b.timestamp).localeCompare(String(a.timestamp)))
    .slice(0, 100)
}

async function getSheetsClient() {
  const privateKey = process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n')
  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })

  return google.sheets({ version: 'v4', auth })
}

async function ensureSheet(sheets, spreadsheetId, title, headers) {
  const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId })
  const existingSheet = spreadsheet.data.sheets?.find((sheet) => sheet.properties?.title === title)

  if (!existingSheet) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [{ addSheet: { properties: { title } } }],
      },
    })
  }

  const headerResponse = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${title}!1:1`,
  })
  const existingHeaders = headerResponse.data.values?.[0] || []

  if (!headers.every((header, index) => existingHeaders[index] === header)) {
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${title}!A1:${columnLetter(headers.length)}1`,
      valueInputOption: 'RAW',
      requestBody: { values: [headers] },
    })
  }
}

function columnLetter(index) {
  let value = ''
  let current = index

  while (current > 0) {
    const remainder = (current - 1) % 26
    value = String.fromCharCode(65 + remainder) + value
    current = Math.floor((current - 1) / 26)
  }

  return value
}
