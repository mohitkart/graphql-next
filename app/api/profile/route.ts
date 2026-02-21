/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";

export async function POST() {
  try {
    const token = (await cookies()).get('token')?.value || ''
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const decoded: any = jwt.verify(
      token,
      process.env.JWT_SECRET!
    );

    await connectDB();
    const user = await User.findById(decoded.id);
    return NextResponse.json({
      success: true,
      data: user,
    })
  }
  catch (err: any) {
    return NextResponse.json({
      success: false,
      message: err.message
    }, { status: 500 })
  }
}