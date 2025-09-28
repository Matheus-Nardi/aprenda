"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";


interface GenericFormDialogProps {
  title: string;
  description: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode; 
}

export function GenericFormDialog({
  title,
  description,
  open,
  onOpenChange,
  children,
}: GenericFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}