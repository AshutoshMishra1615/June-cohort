import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongodb";
import Patient from "@/model/Patient";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();
  const { id } = req.query;

  if (req.method === "GET") {
    const patient = await Patient.findById(id);
    if (!patient) return res.status(404).json({ error: "Not found" });
    return res.status(200).json(patient);
  }

  if (req.method === "PUT") {
    const updated = await Patient.findByIdAndUpdate(id, req.body, { new: true });
    return res.status(200).json(updated);
  }

  if (req.method === "DELETE") {
    await Patient.findByIdAndDelete(id);
    return res.status(204).end();
  }

  res.status(405).end(); // Method not allowed
}
