"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ReloadIcon } from "@radix-ui/react-icons";

export default function NewTicketDialog() {
  const [input, setInput] = React.useState("");
  const [open, setOpen] = React.useState(false);

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    if (!open) {
      setInput("");
    }
  };

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setOpen(false);

    setInput("");
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          className="bg-indigo-500 text-white 
              hover:bg-indigo-600 transition duration-200 ease-in-out transform hover:scale-105"
        >
          Start a New Ticket
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md border-none bg-gray-800 rounded-lg p-8 m-4 max-w-xs max-h-full text-center overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold mb-4 text-indigo-500">
            Add new ticket
          </DialogTitle>
          <DialogDescription>
            Describe your issue and you&apos;ll be reached by one of our agents.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <form className="grid flex-1 gap-2" onSubmit={handleOnSubmit}>
            <Label htmlFor="issue" className="sr-only">
              Issue
            </Label>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              id="issue"
            />
          </form>
        </div>
        <DialogFooter className="sm:justify-between">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              type="button"
              variant="secondary"
              className="bg-indigo-500 text-white hover:bg-indigo-600"
            >
              {"" ? (
                <>
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                "Add New Ticket"
              )}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* 
<div className="fixed inset-0 flex items-center justify-center z-10">
        <div className="bg-gray-800 text-white rounded-lg p-8 m-4 max-w-xs max-h-full text-center overflow-auto">
          <h2 className="text-2xl font-bold mb-4 text-indigo-500">New Ticket</h2>
          <Input className="mb-4" placeholder="Subject" />
          <Input className="mb-4" placeholder="Description" />
          <Button className="bg-indigo-500 text-white hover:bg-indigo-600">Submit</Button>
        </div>
      </div> */
