"use client";

import DataTable from "@components/discover/defiTable";
import * as React from "react";

export default function Page() {
  return (
    <div className="flex w-full flex-col mt-24 gap-8 items-center">
      <div className="w-full h-[400px] bg-primary"></div>
      <div className="w-3/4 p-6 border-[1px] border-[#f4faff4d] rounded-xl">
        <DataTable />
      </div>
    </div>
  );
}
