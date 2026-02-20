/* eslint-disable @typescript-eslint/no-explicit-any */
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";


export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const getParm = (key: string) => {
    return searchParams.get(key)
  }

  const f = {
    search: getParm('search')?.trim(),
    page: Number(getParm('page') || 1),
    count: Number(getParm('count') || 10),
  }

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
    let users: any[] = []
    if (f.search) {
      users = await User.find({
        $or: [
          { name: { $regex: f.search, $options: "i" } },
          { email: { $regex: f.search, $options: "i" } },
        ],
      }).sort({ createdAt: -1 }).skip((f.page - 1) * f.count).limit(f.count);
    } else {
      users = await User.find().sort({ createdAt: -1 }).skip((f.page - 1) * f.count).limit(f.count);
    }

    return NextResponse.json({
      success: true,
      data: users,
    })

  } catch (err: any) {
    return NextResponse.json({
      success: false,
      message: err.message
    }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const { name, email, password } = await req.json()
  try {
    await connectDB();

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return NextResponse.json({
      success: true,
      data: user,
    });
  }
  catch (err: any) {
    if (err.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          message: "Email already exists",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: false,
      message: err.message,
    }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  const { name, email, id } = await req.json()
  try {
    await connectDB();
    const updatedUser = await User.findByIdAndUpdate(id, { name, email }, { new: true });

    return NextResponse.json({
      success: true,
      data: updatedUser,
    });
  }
  catch (err: any) {
    if (err.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          message: "Email already exists",
        },
        { status: 400 }
      );
    }
    return NextResponse.json({
      success: false,
      message: err.message,
    }, { status: 500 })
  }
}