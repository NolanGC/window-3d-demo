import { CreationsTable } from '../../lib/drizzle';
import { json } from 'micro';
import { db } from '../../lib/drizzle';
import { z } from 'zod';

export const config = {
  api: {
    bodyParser: false,
  },
};

// Define a schema for validation
const CreationSchema = z.object({
  prompt: z.string().min(1).max(500),
  thumbnail_uri: z.string().url(),
  data_uri: z.string().url(),
});

// The request handler
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed.' }); // Method Not Allowed
  }

  try {
    const body = await json(req, { limit: '50mb' });

    // Validate the incoming data
    const validatedData = CreationSchema.parse(body);

    // Insert the validated creation
    const insertedCreations = await db
      .insert(CreationsTable)
      .values(validatedData)
      .returning();

    // Respond with the newly created creation
    res.status(200).json(insertedCreations[0]);
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Validation error
      res.status(400).json({ error: 'Invalid data', details: error.errors });
    } else {
      // Other errors
      console.error('Error in creations handler:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}