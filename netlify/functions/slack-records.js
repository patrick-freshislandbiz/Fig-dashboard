import { getStore } from '@netlify/blobs'

const STORE_NAME = 'fig-slack-records'

export async function handler(event) {
  if (event.httpMethod !== 'GET') {
    return json(405, { error: 'Method not allowed' })
  }

  try {
    const store = getStore(STORE_NAME)
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
