"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {Dialog,DialogTrigger,DialogContent,DialogHeader,DialogTitle,DialogFooter} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";

type Task = {
  _id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
};

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [filter, setFilter] = useState("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchTasks = async () => {
    const res = await axios.get("/api/task");
    setTasks(res.data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async () => {
    if (!newTask.trim() || !newDesc.trim()) return;
    await axios.post("/api/task", { title: newTask, description: newDesc });
    setNewTask("");
    setNewDesc("");
    setDialogOpen(false);
    fetchTasks();
  };

  const toggleComplete = async (id: string, completed: boolean) => {
    await axios.put(`/api/task/${id}`, { completed: !completed });
    fetchTasks();
  };

  const confirmDelete = async () => {
    if (deleteId) {
      await axios.delete(`/api/task/${deleteId}`);
      setDeleteId(null);
      fetchTasks();
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "pending") return !task.completed;
    return true;
  });

  return (
    <main className="min-h-screen bg-gray-100 p-4">
      <div className=" mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">DemandPay Task Manager</h1>
          <div className="flex items-center">
            <Button variant={filter === "all" ? "default" : "outline"} onClick={() => setFilter("all")} className="mx-1">
              All
            </Button>
            <Button variant={filter === "completed" ? "default" : "outline"} onClick={() => setFilter("completed")} className="mx-1">
              Completed
            </Button>
            <Button variant={filter === "pending" ? "default" : "outline"} onClick={() => setFilter("pending")} className="mx-1">
              Pending
            </Button>
          </div>
        </div>

        <div className="flex justify-end w-full mb-4">
          <Dialog open={dialogOpen} onOpenChange={(open) => setDialogOpen(open)}>
            <DialogTrigger asChild>
              <Button>Add New Task</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Task</DialogTitle>
              </DialogHeader>
              <Input
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Title"
                className="mb-2"
              />
              <Input
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="Description"
              />
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={addTask}>Add</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {filteredTasks.length === 0 ? (
          <div className="text-center">
            <p>No tasks to show.</p>
          </div>
        ) : (
          <div className="w-full overflow-x-auto bg-white rounded-md shadow">
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">S.No</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTasks.map((task, index) => (
                  <TableRow key={task._id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{task.title}</TableCell>
                    <TableCell>{task.description}</TableCell>
                    <TableCell>{new Date(task.createdAt).toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant={task.completed ? "default" : "secondary"}>
                        {task.completed ? "Completed" : "Pending"}
                      </Badge>
                    </TableCell>
                    <TableCell className="flex gap-2">
                    {!task.completed && (
                      <Button variant="outline" size="sm" onClick={() => toggleComplete(task._id, task.completed)}>
                        Mark Complete
                      </Button>
                     )}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="destructive" size="sm" onClick={() => setDeleteId(task._id)}>
                            <Trash2 />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Confirm Deletion</DialogTitle>
                          </DialogHeader>
                          <p>Are you sure you want to delete the "{task.title}" task?</p>
                          <DialogFooter>
                            <DialogTrigger asChild>
                              <Button variant="destructive" onClick={confirmDelete}>
                                Delete
                              </Button>
                            </DialogTrigger>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </main>
  );
}