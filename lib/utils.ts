import { UseQueryResult, useQuery } from "@tanstack/react-query";
import { type ClassValue, clsx } from "clsx";
import React from "react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const dateFormatter = new Intl.DateTimeFormat("es-AR", {
  dateStyle: "short",
  timeStyle: "short",
  hour12: false,
});

export const handleScrollEvent = (
  event: React.UIEvent<HTMLDivElement, UIEvent>,
  setBoolean: (bool: boolean) => void
) => {
  const target = event.target as HTMLElement;
  const bottom = target.scrollHeight - target.scrollTop === target.clientHeight;
  if (bottom) {
    return setBoolean(true);
  }
  return setBoolean(false);
};

export const useLazyQuery = (
  key: string[],
  /* fn: UseQueryResult<{
    id: string;
    status: boolean;
    timestamp: Date;
    description: string;
}[], Error> */
  fn: () => Promise<
    | {
        id: string;
        status: boolean;
        timestamp: Date;
        description: string;
        messages: {
          id: string;
          timestamp: Date;
          ticket_id: string;
          content: string;
          role: "ai" | "user" | null;
        }[];
      }
    | undefined
  >,
  options?: any
) => {
  const [enabled, setEnabled] = React.useState(false);
  const activate = () => setEnabled(true);
  const query: UseQueryResult<
    | {
        id: string;
        status: boolean;
        timestamp: Date;
        description: string;
        messages: {
          id: string;
          timestamp: Date;
          ticket_id: string;
          content: string;
          role: "ai" | "user" | null;
        }[];
      }
    | undefined,
    Error
  > = useQuery<{
    id: string;
    status: boolean;
    timestamp: Date;
    description: string;
    messages: {
      id: string;
      timestamp: Date;
      ticket_id: string;
      content: string;
      role: "ai" | "user" | null;
    }[];
  }>({
    queryKey: key,
    queryFn: fn,
    enabled,
    ...options,
  });

  return { activate, query };
};
