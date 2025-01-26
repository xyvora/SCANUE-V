import React, { useState } from "react";
import { Button } from "@/components/ui/button";

export function SelectionComponent() {
  const [selected, setSelected] = useState<"PFC" | "GENERAL" | null>(null);

  return (
    <div className="selection-container flex gap-4">
      <Button
        variant={selected === "PFC" ? "primary" : "secondary"}
        className="w-full"
        onClick={() => setSelected("PFC")}
      >
        PFC
      </Button>
      <Button
        variant={selected === "GENERAL" ? "primary" : "secondary"}
        className="w-full"
        onClick={() => setSelected("GENERAL")}
      >
        GENERAL
      </Button>
    </div>
  );
}
