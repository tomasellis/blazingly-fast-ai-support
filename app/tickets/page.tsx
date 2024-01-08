"use client";
import NewTicketDialog from "@/components/newticketdialog";

export default function Home() {
  return (
    <main className="flex-1 flex sm:max-w-full justify-center items-center no-scrollbar">
      <div className=" border-gray-700 overflow-y-auto  text-white dark">
        <div className=" flex flex-col items-center justify-center text-center p-10 bg-gray-900">
          <h1 className="text-5xl font-bold mb-4 text-indigo-500">
            Welcome to the Support Center
          </h1>
          <p className="text-lg mb-6">
            Select a ticket from the left to start a conversation or add a new
            ticket.
          </p>
          <NewTicketDialog />
        </div>
      </div>
    </main>
  );
}
