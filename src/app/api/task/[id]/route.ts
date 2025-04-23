import { NextResponse, NextRequest } from "next/server";
import { connectDB } from '@/lib/db';
import Task from '@/models/task';

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const params = await context.params;
  const { id } = params;
  await Task.findByIdAndDelete(id);
  return NextResponse.json({ message: "Task deleted successfully" }, { status: 200 });
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  const { id } = params;
  const { completed } = await request.json();
  await connectDB();
  const updated = await Task.findByIdAndUpdate(id, { completed }, { new: true });
  return NextResponse.json(updated);
}