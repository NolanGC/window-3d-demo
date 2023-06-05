import {
pgTable,
serial,
text,
timestamp,
} from 'drizzle-orm/pg-core';
import { InferModel } from 'drizzle-orm';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';

const connectionString = `postgres://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}/${process.env.PGDATABASE}`;

const config = {
    connectionString: connectionString,
    ssl: {
        rejectUnauthorized: false
    }
}

if (!process.env.PGUSER || !process.env.PGPASSWORD || !process.env.PGHOST || !process.env.PGDATABASE) {
    throw new Error("Database configuration variables are not set correctly");
}
const sql = postgres(config);

export const CreationsTable = pgTable(
'creations',
{
    id: serial('id').primaryKey(),
    prompt: text('prompt').notNull(),
    data_uri: text('data_uri').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
}
);

export type Creation = InferModel<typeof CreationsTable>;
export type NewCreation = InferModel<typeof CreationsTable, 'insert'>;

// Connect to Vercel Postgres
export const db = drizzle(sql);