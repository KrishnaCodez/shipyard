import StudentSearch from "@/components/students/StudentSearch";
import { Button } from "@/components/ui/button";
import React from "react";
import { ArrowLeft } from "lucide-react";

const Page = () => {
  return (
    <div className=" w-full overflow-hidden">
      {" "}
      <StudentSearch />
    </div>
  );
};

export default Page;
