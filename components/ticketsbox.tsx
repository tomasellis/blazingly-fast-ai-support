"use client";
import React from "react";
import { useTickets } from "./hooks/useTickets";
import TicketTab from "./tickettab";
import NewTicketTab from "./newtickettab";
import {
  CaretLeftIcon,
  CaretRightIcon,
  HamburgerMenuIcon,
  ReloadIcon,
} from "@radix-ui/react-icons";
import { usePathname } from "next/navigation";
import Hamburguer from "@/public/hamburger.svg";
import useWindowDimensions from "./hooks/useWindowDimensions";

export default function TicketsBox() {
  const tailwind_md = 768;
  const [isOpen, setIsOpen] = React.useState(false);
  const { data, isFetching } = useTickets();
  const sidebarRef = React.useRef<HTMLDivElement | null>(null);
  /*   if (isError) return <div>Failed getting Tickets</div>; */
  const path = usePathname();
  const { height, width } = useWindowDimensions();

  React.useEffect(() => {
    if (width < tailwind_md) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  }, [width]);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      console.log({ event });
      if (!sidebarRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (width < tailwind_md) {
      document.addEventListener("click", handleClickOutside, true);
    }
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [width]);

  return (
    <>
      {!isOpen && width < tailwind_md && (
        <div className="absolute top-0 left-0 p-4 ">
          <button onClick={() => setIsOpen(!isOpen)}>
            <HamburgerMenuIcon width={25} height={25} />
          </button>
        </div>
      )}
      {!isOpen && width >= tailwind_md && (
        <div className="hidden absolute top-1/2 left-0 opacity-50 hover:cursor-pointer hover:opacity-100 md:block">
          <button onClick={() => setIsOpen(true)}>
            <CaretRightIcon width={25} height={25} />
          </button>
        </div>
      )}
      {isOpen && (
        <div
          ref={sidebarRef}
          className="z-10 bg-gray-900 absolute flex flex-col md:static md:w-[300px] md:min-w-[300px] h-full no-scrollbar border-r-2 overflow-x-hidden"
        >
          <div className="flex justify-between items-center border-b border-gray-700 bg-inherit">
            <h2 className="h-[65px] text-2xl font-bold text-indigo-500 py-4 px-4 bg-inherit">
              Customer Tickets
            </h2>
            <div className="p-4 md:hidden">
              <button onClick={() => setIsOpen(!isOpen)}>
                <HamburgerMenuIcon width={25} height={25} />
              </button>
            </div>
            <div className="hidden absolute top-1/2 left-[300px] opacity-50 hover:cursor-pointer hover:opacity-100 md:block">
              <button onClick={() => setIsOpen(false)}>
                <CaretLeftIcon width={25} height={25} />
              </button>
            </div>
          </div>
          <div className="flex-1 flex flex-col w-full bg-gray-900 overflow-auto">
            <NewTicketTab
              disabled={isFetching}
              handleOnClick={() => {
                window.setTimeout(() => {
                  if (width < tailwind_md) {
                    setIsOpen(false);
                  }
                }, 250);
              }}
            />
            <div className="mt-2 px-2 pb-2 text-sm text-gray-500">
              <span>Previous tickets</span>
            </div>
            <div className="flex-auto h-[200px] overflow-y-auto no-scrollbar p-4 space-y-4">
              {!data && isFetching && (
                <div className="w-full flex justify-center items-center">
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                </div>
              )}
              {!isFetching && (data?.length === 0 || data === undefined) && (
                <p className="text-lg">
                  No tickets available. Please start a new chat.
                </p>
              )}
              {
                <ul>
                  {data &&
                    data.map((ticket, pageIndex) => (
                      <li key={ticket.id}>
                        <TicketTab
                          key={ticket.id}
                          ticket={ticket}
                          handleOnClick={() => {
                            window.setTimeout(() => {
                              if (width < tailwind_md) {
                                setIsOpen(false);
                              }
                            }, 250);
                          }}
                        />
                      </li>
                    ))}
                </ul>
              }
            </div>
          </div>
        </div>
      )}
    </>
  );
}

{
  /* <>
  {!isOpen && (
    <button className="absolute p-4" onClick={() => setIsOpen(true)}>
    <span>
    <HamburgerMenuIcon width={30} height={30} />
          </span>
        </button>
      )}
      {isOpen && (
        <div
          className="absolute flex flex-1 
        flex-col h-full w-[300px] 
        max-w-[300px] bg-red-600 transition ease transform duration-300
        "
        >
          <button className="" onClick={() => setIsOpen(false)}>
            <span>
              <HamburgerMenuIcon width={30} height={30} />
            </span>
          </button>
          <span>supup</span>
          <span>aaa</span>
          <span>yooo</span>
        </div>
      )}
    </> */
}
