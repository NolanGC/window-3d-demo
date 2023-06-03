import { CreationsTable } from '../../lib/drizzle';
import { asc, desc } from "drizzle-orm";
import {db} from '../../lib/drizzle';

export default async function handler(req, res) {
    if (req.method === 'GET') {
      const { limit = 9, offset = 0 } = req.query;
      try {
        const creations = await db
          .select()
          .from(CreationsTable)
          .orderBy(desc(CreationsTable.id))
          .limit(parseInt(limit))
          .offset(parseInt(offset));
  
        // Respond with the fetched creations
        res.status(200).json(creations);
      } catch (error) {
        // Respond with error
        console.log(error.message);
        res.status(500).json({ error: error.message });
      }
    } else {
      // Unsupported HTTP method
      res.status(405).json({ error: 'Method not allowed.' });  // Method Not Allowed
    }
  }