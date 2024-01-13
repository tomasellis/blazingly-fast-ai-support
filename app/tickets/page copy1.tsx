"use client";
import { nanoid } from "ai";
import { redirect, useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function Chatbox() {
  return (
    <div className="h-full w-full flex flex-col no-scrollbar">
      <div className="h-full no-scrollbar overflow-auto p-4 space-y-4 flex">
        <div className="flex-1 flex flex-col h-1/3 justify-center items-center">
          <span className="text-9xl">{/*  <QuestionMarkSVG /> */}</span>
          <h1 className="text-5xl font-bold py-4 text-indigo-500">
            Welcome to the Support Center
          </h1>
          <p className="text-3xl mb-6">How can we help you?</p>
        </div>
      </div>
    </div>
  );
}
