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
];

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
];

function doPost(e) {
  const payload = parseJson_(e.postData && e.postData.contents);

  if (payload.action === 'appendSlackRecord') {
    appendSlackRecord_(payload.record);
    return json_({ ok: true });
  }

  return json_({ ok: false, error: 'Unknown action.' });
}

function doGet() {
  return json_({
    records: readMessages_(),
  });
}

function appendSlackRecord_(record) {
  const sheet = ensureSheet_('messages', MESSAGE_HEADERS);
  sheet.appendRow([
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
  ]);

  if (record.command === 'task' && record.payload) {
    const tasks = ensureSheet_('tasks', TASK_HEADERS);
    tasks.appendRow([
      `task-${record.id}`,
      record.payload,
      `Created from Slack by ${record.sender}.`,
      'medium',
      'todo',
      '',
      'Patrick King',
      record.timestamp,
      '',
    ]);
  }
}

function readMessages_() {
  const sheet = ensureSheet_('messages', MESSAGE_HEADERS);
  const values = sheet.getDataRange().getValues();

  return values
    .slice(1)
    .filter((row) => row[0])
    .map((row) => ({
      id: row[0],
      source: row[1],
      sender: row[2],
      channel: row[3],
      text: row[4],
      command: row[5],
      payload: row[6],
      timestamp: row[7],
      processed: String(row[8]).toLowerCase() === 'true',
      actionCreated: row[9],
    }))
    .sort((a, b) => String(b.timestamp).localeCompare(String(a.timestamp)))
    .slice(0, 100);
}

function ensureSheet_(name, headers) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(name);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(name);
  }

  const currentHeaders = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
  const headersMatch = headers.every((header, index) => currentHeaders[index] === header);

  if (!headersMatch) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.setFrozenRows(1);
  }

  return sheet;
}

function parseJson_(text) {
  try {
    return JSON.parse(text || '{}');
  } catch (error) {
    return {};
  }
}

function json_(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
