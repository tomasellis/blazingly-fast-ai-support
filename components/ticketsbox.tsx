"use client";
import React from "react";
import Loading from "@/app/tickets/loading";
import { useTickets } from "./hooks/useTickets";
import TicketTab from "./tickettab";
import { usePathname } from "next/navigation";
import NewTicketDialog from "./newticketdialog";
import { useRouter } from "next/navigation";

export default function TicketsBox() {
  const { data, isLoading, isFetching, isError } = useTickets();
  const router = useRouter();
  const isActive = usePathname();

  const [selectedId, setSelectedId] = React.useState(
    isActive ? "" : isActive.split("/")[2]
  );

  const handleClickTicket = (id: string) => {
    setSelectedId(id);
  };

  if (isError) return <div>F</div>;
  /* 
    React.useEffect(() => {
      if (selectedId === "") router.push("/tickets");
    }, []);
 */
  return (
    <div className="flex flex-col w-[25%] h-full no-scrollbar border-r-2 ">
      <h2 className="text-2xl font-bold text-indigo-500 py-4 px-4 border-b border-gray-700">
        Customer Tickets
      </h2>
      <div className="flex-1 flex flex-col w-full bg-gray-900 overflow-auto">
        {selectedId !== "" && (
          <div className="flex h-[10%] justify-center items-center">
            <NewTicketDialog />
          </div>
        )}
        <div className="flex-auto h-[200px] overflow-y-auto no-scrollbar p-4 space-y-4">
          {isLoading && <Loading></Loading>}
          {!data && (
            <p className="text-lg">
              No tickets available. Please add a new ticket.
            </p>
          )}
          <ul>
            {/* {isPending || (isFetching && <FakeTicketTab />)} */}
            {data &&
              data.map((ticket, pageIndex) => (
                <li key={ticket.id}>
                  <TicketTab
                    key={ticket.id}
                    ticket={ticket}
                    handleClick={handleClickTicket}
                    currentTicketId={selectedId}
                  />
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
