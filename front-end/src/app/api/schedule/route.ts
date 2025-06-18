// src/api/schedule/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Schedule } from "@/model/Schedule";

export async function GET() {
  await dbConnect();
  const events = await Schedule.find();
  return NextResponse.json(events);
}

export async function POST(req: NextRequest) {
  await dbConnect();
  const body = await req.json();
  const event = await Schedule.create(body);
  return NextResponse.json(event);
}
