"use client";
import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

type Task = {
  _id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  dueDate: string;
};

type Column = {
  id: string;
  title: string;
  tasks: Task[];
};

const KanbanView: React.FC = () => {
  const [columns, setColumns] = useState<Column[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/users/getTask");
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      const tasks: Task[] = data.data.tasks || [];

      // Group tasks by status
      const groupedTasks = tasks.reduce((acc, task) => {
        const status = task.status || "To Do";
        if (!acc[status]) {
          acc[status] = [];
        }
        acc[status].push(task);
        return acc;
      }, {} as Record<string, Task[]>);

      // Create columns
      const newColumns: Column[] = [
        { id: "To Do", title: "To Do", tasks: groupedTasks["To Do"] || [] },
        {
          id: "In progress",
          title: "In Progress",
          tasks: groupedTasks["In progress"] || [],
        },
        {
          id: "Completed",
          title: "Completed",
          tasks: groupedTasks["Completed"] || [],
        },
      ];

      setColumns(newColumns);
      setIsLoading(false);
    } catch (error: any) {
      setError(error.message || "An error occurred");
      setIsLoading(false);
    }
  };

  const onDragEnd = (result: any) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const startColumn = columns.find((col) => col.id === source.droppableId);
    const finishColumn = columns.find(
      (col) => col.id === destination.droppableId
    );

    if (!startColumn || !finishColumn) {
      return;
    }

    if (startColumn === finishColumn) {
      const newTasks = Array.from(startColumn.tasks);
      const [reorderedTask] = newTasks.splice(source.index, 1);
      newTasks.splice(destination.index, 0, reorderedTask);

      const newColumn = {
        ...startColumn,
        tasks: newTasks,
      };

      const newColumns = columns.map((col) =>
        col.id === newColumn.id ? newColumn : col
      );

      setColumns(newColumns);
    } else {
      const startTasks = Array.from(startColumn.tasks);
      const [movedTask] = startTasks.splice(source.index, 1);
      const newStartColumn = {
        ...startColumn,
        tasks: startTasks,
      };

      const finishTasks = Array.from(finishColumn.tasks);
      finishTasks.splice(destination.index, 0, {
        ...movedTask,
        status: finishColumn.id,
      });
      const newFinishColumn = {
        ...finishColumn,
        tasks: finishTasks,
      };

      const newColumns = columns.map((col) =>
        col.id === newStartColumn.id
          ? newStartColumn
          : col.id === newFinishColumn.id
          ? newFinishColumn
          : col
      );

      setColumns(newColumns);

      // Update task status in the backend
      updateTaskStatus(movedTask._id, finishColumn.id);
    }
  };

  const updateTaskStatus = async (taskId: string, newStatus: string) => {
    try {
      await fetch(`http://localhost:3000/api/users/updateTaskStatus`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ taskId, newStatus }),
      });
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-4 pb-4">
        {columns.map((column) => (
          <div key={column.id} className="w-full">
            <Card className="w-full">
              <CardHeader>
                <CardTitle>{column.title}</CardTitle>
              </CardHeader>
              <Droppable droppableId={column.id}>
                {(provided) => (
                  <CardContent
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="min-h-[200px]"
                  >
                    {column.tasks.map((task, index) => (
                      <Draggable
                        key={task._id}
                        draggableId={task._id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="bg-secondary p-2 mb-2 rounded-md"
                          >
                            <h3 className="font-semibold">{task.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {task.description}
                            </p>
                            <div className="flex gap-2 mt-2">
                              <Badge>{task.priority}</Badge>
                              <Badge variant="outline">{task.status}</Badge>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </CardContent>
                )}
              </Droppable>
            </Card>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
};

export default KanbanView;
