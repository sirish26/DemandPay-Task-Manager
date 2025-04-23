import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Task from '@/models/task';

export async function GET(request: Request) {
  await connectDB();
  const tasks = await Task.find().sort({ createdAt: -1 });
  return NextResponse.json(tasks, { status: 200 });
}

export async function POST(request: Request) {
  const { title, description } = await request.json();
  if (!title || !description) {
    return NextResponse.json({ message: 'Title and description are required' }, { status: 400 });
  }
  await connectDB();
  const task = await Task.create({ title, description, completed: false });
  return NextResponse.json(task, { status: 201 });
}
