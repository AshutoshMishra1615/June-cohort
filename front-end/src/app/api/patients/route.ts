import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongodb";
import Patient from "@/model/Patient";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  if (req.method === "GET") {
    const patients = await Patient.find();
    return res.status(200).json(patients);
  }

  if (req.method === "POST") {
    try {
      const newPatient = await Patient.create(req.body);
      return res.status(201).json(newPatient);
    } catch (err) {
      return res.status(400).json({ error: `Invalid Patient Data ${err}` });
    }
  }

  res.status(405).end(); // Method not allowed
}
