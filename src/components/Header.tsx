import { ClipboardList, Plus } from "lucide-react";
import React from "react";
import { ModeToggle } from "./mode-toggle";
import { Button } from "./ui/button";

const Header = () => {
  return (
    <div className="flex items-center justify-between max-h-48 p-6 border-b-[.1px]">
      <div className="flex items-center justify-center gap-2 ">
        <ClipboardList className="w-8 h-8" />
        <span className="font-bold text-2xl">Tasker</span>
      </div>

      <ModeToggle />
    </div>
  );
};

export default Header;
