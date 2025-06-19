import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Schedule } from "@/model/Schedule";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await dbConnect();
  const body = await req.json();
  const updated = await Schedule.findByIdAndUpdate(params.id, body, {
    new: true,
  });
  return NextResponse.json(updated);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await dbConnect();
  await Schedule.findByIdAndDelete(params.id);
  return NextResponse.json({ success: true });
}
