// app/queries.ts
import { sql } from "@vercel/postgres";

export const selectAllCreations = () => sql`SELECT * FROM creations`;

export const insertCreation = (
  prompt: string,
  data_uri: string
) => {
  const dateNow = new Date();
  const dateString = `${dateNow.toISOString()}`;
  return sql`
    INSERT INTO creations (prompt, data_uri, created_at)
    VALUES (${prompt}, ${data_uri}, ${dateString})
    RETURNING *;
  `;
};