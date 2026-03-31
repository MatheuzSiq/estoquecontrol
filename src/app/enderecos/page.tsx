"use client";

import EstruturaList from "@/components/estrutura/EstruturaList";
import { useState } from "react";

export default function Page() {
  return (
    <div className="flex flex-col items-center pt-2 px-4 gap-6">
      <EstruturaList />
    </div>
  );
}
