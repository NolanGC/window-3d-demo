import {
    pgTable,
    serial,
    text,
    timestamp,
  } from 'drizzle-orm/pg-core';
  import { InferModel } from 'drizzle-orm';
  import { sql } from '@vercel/postgres';
  import { drizzle } from 'drizzle-orm/vercel-postgres';
  
  export const CreationsTable = pgTable(
    'creations',
    {
      id: serial('id').primaryKey(),
      prompt: text('prompt').notNull(),
      data_uri: text('data_uri').notNull(),
      created_at: timestamp('created_at').notNull().defaultNow(),
    }
  );
  
  export type Creation = InferModel<typeof CreationsTable>;
  export type NewCreation = InferModel<typeof CreationsTable, 'insert'>;
  
  // Connect to Vercel Postgres
  export const db = drizzle(sql);