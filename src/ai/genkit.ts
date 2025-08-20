import {configureGenkit} from '@genkit-ai/core';
import {googleAI} from '@genkit-ai/googleai';
import {genkitEval, GenkitMetric} from '@genkit-ai/evaluator';

// This file configures the Genkit framework.
// It is imported by the API route to ensure the environment is initialized.

configureGenkit({
  plugins: [
    // The Google AI plugin is essential for using Gemini models.
    // It will automatically look for the GOOGLE_API_KEY in your environment variables.
    googleAI(),

    // Evaluator plugins for running evaluations.
    genkitEval(),
  ],
  // Log all AI activity to the console for debugging.
  logLevel: 'debug',
  // Enable tracing and metrics for observability.
  enableTracingAndMetrics: true,
});
