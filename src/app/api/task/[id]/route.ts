import { NextResponse } from "next/server";
import { connectDB } from '@/lib/db';
import Task from '@/models/task';

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  await connectDB();
  const { id } = await params;
  await Task.findByIdAndDelete(id);
  return NextResponse.json({ message: "Task deleted successfully" }, { status: 200 });
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { completed } = await request.json();
  await connectDB();
  const { id } = await params;
  const updated = await Task.findByIdAndUpdate(id, { completed }, { new: true });
  return NextResponse.json(updated);
}
