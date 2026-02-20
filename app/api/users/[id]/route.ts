/* eslint-disable @typescript-eslint/no-explicit-any */
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest, {params}: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    await connectDB();
    const user = await User.findById(id);
    return NextResponse.json({
      success: true,
      data: user,
    })

  } catch (err: any) {
    return NextResponse.json({
      success: false,
      message: err.message
    }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    if (!id) {
      return NextResponse.json(
        { message: "ID is required" },
        { status: 400 }
      );
    }

    await connectDB();
    const res=await User.findByIdAndDelete(id);

    return NextResponse.json(
      { message: "User deleted successfully",data:res,success:true },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message
      },
      { status: 500 }
    );
  }
}