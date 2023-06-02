// app/api/creations.ts
import { NextApiRequest, NextApiResponse } from "next";
import { sql } from "@vercel/postgres";
import { insertCreation, selectAllCreations } from "../queries";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    try {
      const rows = await selectAllCreations();
      res.status(200).json(rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === "POST") {
    try {
      const { prompt, data_uri } = req.body;
      const rows = await insertCreation(prompt, data_uri);
      res.status(200).json(rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
};