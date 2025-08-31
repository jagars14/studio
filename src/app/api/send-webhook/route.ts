import { NextResponse } from 'next/server';

const N8N_WEBHOOK_URL = 'https://n8n.srv859340.hstgr.cloud/webhook-test/22a01abd-9419-4651-afdf-04b7ffdf6ec6';

export async function POST(req: Request) {
  try {
    const payload = await req.json();

    const n8nResponse = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!n8nResponse.ok) {
      const errorBody = await n8nResponse.text();
      console.error('n8n webhook responded with an error:', errorBody);
      return NextResponse.json({ message: 'Error from n8n webhook', details: errorBody }, { status: n8nResponse.status });
    }

    // Esperamos la respuesta JSON de n8n
    const responseData = await n8nResponse.json();

    // Reenviamos la respuesta de n8n al cliente
    return NextResponse.json(responseData, { status: 200 });

  } catch (error: any) {
    console.error('Error in API proxy route:', error);
    return NextResponse.json({ message: 'Failed to forward data', details: error.message }, { status: 500 });
  }
}
