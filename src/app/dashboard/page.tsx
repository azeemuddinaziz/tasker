import React from "react";
import Header from "@/components/Header";
import AddTask from "@/components/AddTask";
import TaskView from "@/components/TaskView";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import KanbanView from "@/components/KanbanView";

const Dashboard = () => {
  return (
    <>
      <Header />
      <div className="flex flex-col gap-4 p-4">
        <div className="flex items-center justify-between">
          <AddTask />
        </div>

        <Tabs defaultValue="list-view">
          <TabsList>
            <TabsTrigger value="list-view">List View</TabsTrigger>
            <TabsTrigger value="board-view">Board View</TabsTrigger>
          </TabsList>
          <TabsContent value="list-view">
            <TaskView />
          </TabsContent>
          <TabsContent value="board-view">
            <KanbanView />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default Dashboard;
