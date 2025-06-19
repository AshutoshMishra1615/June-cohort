import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Prescription from "@/model/Prescription";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;

export async function POST(req: NextRequest) {
  await dbConnect();
  const body = await req.json();

  const { patientId, symptoms, diagnosis } = body;

  if (!patientId || !symptoms?.length || !diagnosis) {
    return NextResponse.json({ error: "Missing input" }, { status: 400 });
  }

  const prompt = `
You are an experienced doctor. Based on the following symptoms and diagnosis, suggest a prescription.

Symptoms: ${symptoms.join(", ")}
Diagnosis: ${diagnosis}

Return the prescription in this format:

[
  {
    "name": "Medicine Name",
    "dose": "e.g. 500mg",
    "frequency": "e.g. Twice a day"
  }
]
`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();
    const aiText = data.choices?.[0]?.message?.content;
    const medications = JSON.parse(aiText || "[]");

    const prescription = await Prescription.create({
      patientId,
      symptoms,
      diagnosis,
      medications,
    });

    return NextResponse.json(prescription);
  } catch (err) {
    console.error("MCP Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
