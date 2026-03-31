"use client";

import Galpoes from "@/components/Galpoes/Galpoes";
import GalpoesView from "@/components/Galpoes/GalpoesView";
import { useState } from "react";

export default function Page() {
  return (
    <div className="flex flex-col items-center pt-2 px-4 gap-6">
      <Galpoes />
      <GalpoesView />
    </div>
  );
}
