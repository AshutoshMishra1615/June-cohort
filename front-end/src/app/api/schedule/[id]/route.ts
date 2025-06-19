import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Schedule } from "@/model/Schedule";

export async function PUT(req: NextRequest) {
  await dbConnect();

  const url = new URL(req.url);
  const id = url.pathname.split("/").pop(); // or use regex for better safety

  const body = await req.json();
  const updated = await Schedule.findByIdAndUpdate(id, body, {
    new: true,
  });

  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest) {
  await dbConnect();

  const url = new URL(req.url);
  const id = url.pathname.split("/").pop();

  await Schedule.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
