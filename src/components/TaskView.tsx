"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Button } from "./ui/button";
import { Pen, Trash2 } from "lucide-react";
import { Badge } from "./ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";

type Task = {
  _id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  dueDate: string;
};

const TaskView = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>();
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [dueDateFilter, setDueDateFilter] = useState<string>("");

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/users/getTask");
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setTasks(data.data.tasks || []);
    } catch (error: any) {
      setError(error.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const handleDelete = async (taskId: string) => {
    try {
      await fetch(
        `http://localhost:3000/api/users/deleteTask?taskId=${taskId}`,
        {
          method: "DELETE",
        }
      );
      // Re-fetch data after deletion
      fetchData();
    } catch (error) {
      setError(error);
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask({ ...task });
    setIsEditDialogOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask) return;

    try {
      const response = await fetch(
        `http://localhost:3000/api/users/editTask?taskId=${editingTask._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editingTask),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update task");
      }

      setIsEditDialogOpen(false);
      fetchData(); // Refresh the task list
    } catch (error: any) {
      setError(error.message || "An error occurred while updating the task");
    }
  };

  const handleEditInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!editingTask) return;
    const { name, value } = e.target;
    setEditingTask((prev) => ({ ...prev!, [name]: value }));
  };

  const handleEditSelectChange = (name: string, value: string) => {
    if (!editingTask) return;
    setEditingTask((prev) => ({ ...prev!, [name]: value }));
  };

  // Filter tasks based on selected filters
  const filteredTasks = tasks.filter((task) => {
    const statusMatch = statusFilter === "all" || task.status === statusFilter;
    const priorityMatch =
      priorityFilter === "all" || task.priority === priorityFilter;
    const dueDateMatch = dueDateFilter === "" || task.dueDate === dueDateFilter;

    return statusMatch && priorityMatch && dueDateMatch;
  });

  return (
    <>
      {/* Filters */}
      <div className="mb-4 flex gap-4">
        {/* Status Filter */}
        <Select onValueChange={setStatusFilter} value={statusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="To Do">To Do</SelectItem>
            <SelectItem value="In progress">In Progress</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
          </SelectContent>
        </Select>

        {/* Priority Filter */}
        <Select onValueChange={setPriorityFilter} value={priorityFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="Low">Low</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="High">High</SelectItem>
          </SelectContent>
        </Select>

        {/* Due Date Filter */}
        {/* <Input
          type="date"
          value={dueDateFilter}
          onChange={(e) => setDueDateFilter(e.target.value)}
          className="w-[180px]"
        /> */}
      </div>

      {/* Task Table */}
      <Table className="border">
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            {/* <TableHead>Due Date</TableHead> */}
            <TableHead className="text-right w-1/12">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filteredTasks.map((task) => (
            <TableRow key={task._id}>
              <TableCell className="font-medium">{task.title}</TableCell>
              <TableCell className="text-muted-foreground">
                {task.description}
              </TableCell>
              <TableCell>
                <Badge>{task.status}</Badge>
              </TableCell>
              <TableCell>
                <Badge>{task.priority}</Badge>
              </TableCell>
              {/* <TableCell>{task.dueDate}</TableCell> */}
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant={"outline"} onClick={() => handleEdit(task)}>
                    <Pen className="mr-2 w-4 h-4" />
                    <span>Edit</span>
                  </Button>

                  <Button
                    variant={"destructive"}
                    onClick={() => handleDelete(task._id)}
                  >
                    <Trash2 className="mr-2 w-4 h-4" />
                    <span>Delete</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Edit Task Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Title
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={editingTask?.title || ""}
                  onChange={handleEditInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Input
                  id="description"
                  name="description"
                  value={editingTask?.description || ""}
                  onChange={handleEditInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <Select
                  onValueChange={(value) =>
                    handleEditSelectChange("status", value)
                  }
                  value={editingTask?.status || ""}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="To Do">To Do</SelectItem>
                    <SelectItem value="In progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="priority" className="text-right">
                  Priority
                </Label>
                <Select
                  onValueChange={(value) =>
                    handleEditSelectChange("priority", value)
                  }
                  value={editingTask?.priority || ""}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="dueDate" className="text-right">
                  Due Date
                </Label>
                <Input
                  id="dueDate"
                  name="dueDate"
                  type="date"
                  value={editingTask?.dueDate || ""}
                  onChange={handleEditInputChange}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TaskView;
