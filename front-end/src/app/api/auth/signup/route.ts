import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/model/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  await dbConnect();
  const { name, email, password } = await req.json();

  if (!name || !email || !password)
    return NextResponse.json(
      { message: "All fields are required" },
      { status: 400 }
    );

  const existingUser = await User.findOne({ email });
  if (existingUser)
    return NextResponse.json(
      { message: "User already exists" },
      { status: 409 }
    );

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
    isVerified: true, // Temporarily true for testing; implement email verification later
  });

  return NextResponse.json({ message: "User created successfully" });
}
