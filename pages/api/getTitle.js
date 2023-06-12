import { CreationsTable } from '../../lib/drizzle';
import { db } from '../../lib/drizzle';
import { eq } from "drizzle-orm";

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { id } = req.query;
    try {
      const creation = await db
        .select()
        .from(CreationsTable)
        .where(eq(CreationsTable.id, id))

      if (creation) {
        // Respond with the fetched creation
        res.status(200).json(creation[0]["prompt"])
      } else {
        // Creation not found
        res.status(404).json({ error: 'Creation not found.' });
      }
    } catch (error) {
      // Respond with error
      res.status(500).json({ error: error.message });
    }
  } else {
    // Unsupported HTTP method
    res.status(405).json({ error: 'Method not allowed.' }); // Method Not Allowed
  }
}
