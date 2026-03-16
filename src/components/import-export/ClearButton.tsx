"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";

interface Props {
  onClear: () => void;
}

export function ClearButton({ onClear }: Props) {
  const [open, setOpen] = useState(false);

  const handleConfirm = () => {
    onClear();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="text-red-500 hover:text-red-600"
        >
          <Trash2 className="h-4 w-4 mr-1.5" />
          Clear
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[calc(100vw-2rem)] sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Clear all fields?</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          This will reset the entire CV and all generation settings. This cannot
          be undone.
        </p>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" size="sm" onClick={handleConfirm}>
            Clear all
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
