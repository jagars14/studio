// The first import MUST be the genkit configuration to initialize the environment.
import '@/ai/genkit.ts';

import {runFlow} from '@genkit-ai/flow';
import {NextResponse} from 'next/server';
import {suggestMatingHealthcareFlow} from '@/ai/flows/suggest-mating-healthcare';
import {SuggestMatingHealthcareInputSchema} from '@/ai/types';

// Helper to validate that the request body matches the Genkit input schema
async function getBody(req: Request) {
  try {
    const body = await req.json();
    return SuggestMatingHealthcareInputSchema.parse(body);
  } catch (e) {
    return null;
  }
}

export async function POST(req: Request) {
  const input = await getBody(req);
  if (!input) {
    return NextResponse.json({error: 'Invalid input'}, {status: 400});
  }

  try {
    const result = await runFlow(suggestMatingHealthcareFlow, input);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error running Genkit flow:', error);
    return NextResponse.json(
      {error: 'Failed to get suggestions from AI', details: error.message},
      {status: 500}
    );
  }
}
