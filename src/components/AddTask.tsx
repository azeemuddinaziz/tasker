"use client";

import React, { FormEvent, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Loader2, Plus, Send } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { redirect } from "next/navigation";

type FormData = {
  title: string;
  description?: string;
  status: string;
  priority: string;
  dueDate?: string;
};

const AddTask = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    status: "",
    priority: "",
    dueDate: undefined,
  });

  console.log(formData);

  const handleAddTask = async (e: FormEvent) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      const res = await fetch("/api/users/addTask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      setIsLoading(false);
    } catch (error) {}
  };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button>
            <Plus className="mr-2 w-4 h-4" />
            <span>Add new task</span>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add new task</DialogTitle>
            <DialogDescription>
              Fill all required fields carefully.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddTask} className="flex flex-col gap-4">
            <div className="flex justify-around items-center gap-2">
              <Label htmlFor="text" className="text-md font-medium ">
                Title:
              </Label>
              <Input
                type="text"
                id="text"
                placeholder="Create an app for task management."
                className="focus-visible:ring-transparent w-full"
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>

            <div className="flex justify-around items-center gap-2">
              <Label htmlFor="text" className="text-md font-medium">
                Description:
              </Label>
              <Input
                type="text"
                id="text"
                placeholder="Make an image of final app."
                className="focus-visible:ring-transparent w-full"
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>

            <div className="flex justify-around items-center gap-2">
              <Label htmlFor="text" className="text-md font-medium ">
                Status:
              </Label>
              <Select
                required
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose one" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="To Do">To Do</SelectItem>
                  <SelectItem value="In progress">In progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-around items-center gap-2">
              <Label htmlFor="text" className="text-md font-medium ">
                Priority:
              </Label>
              <Select
                onValueChange={(value) =>
                  setFormData({ ...formData, priority: value })
                }
                required
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose one" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Label
                htmlFor="due-date"
                className="text-md font-medium text-nowrap"
              >
                Due Date:
              </Label>
              <Input
                type="date"
                id="due-date"
                placeholder="Make an image of final app."
                className="focus-visible:ring-transparent w-full"
                onChange={(e) =>
                  setFormData({ ...formData, dueDate: e.target.value })
                }
              />
            </div>

            {!isLoading ? (
              <Button type="submit">
                <Send className="mr-2 w-4 h-4" />
                <span>Submit</span>
              </Button>
            ) : (
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            )}
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddTask;
