import { CreationsTable } from '../../lib/drizzle';
import { json } from 'micro';
import {db} from '../../lib/drizzle';

export const config = {
    api: {
      bodyParser: false,
    },
  };

// The request handler
export default async function handler(req, res) {
  const body = await json(req, { limit: '10mb' });
  if (req.method === 'POST') {
    try {
      const newCreation = body;

      // Insert the new creation
      const insertedCreations = await db
        .insert(CreationsTable)
        .values(newCreation)
        .returning();

      // Respond with the newly created creation
      res.status(200).json(insertedCreations[0]);
    } catch (error) {
      // Respond with error
      res.status(500).json({ error: error.message });
    }
  }
  else {
    // Unsupported HTTP method
    res.status(405).json({ error: 'Method not allowed.' });  // Method Not Allowed
  }
}






