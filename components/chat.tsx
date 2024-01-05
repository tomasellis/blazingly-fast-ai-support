'use client'
import React from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function Component() {

    const [tickets, setTickest] = React.useState([])
    /**
     * name: "",
     * id: "",
     * status: "",
     * chat [
     *      messages
     * ]
     */

    return (
        <div className="flex min-h-screen bg-gray-800 text-white dark md:w-full">
            <div className="w-64 border-r border-gray-700 overflow-y-auto">
                <div className="p-4 space-y-4">
                    <h2 className="text-lg font-semibold">Customer Tickets</h2>
                    <div className="space-y-2">
                        <Link className="block px-4 py-2 rounded hover:bg-gray-700" href="#">
                            Ticket #1
                        </Link>
                        <Link className="block px-4 py-2 rounded hover:bg-gray-700" href="#">
                            Ticket #2
                        </Link>
                        <Link className="block px-4 py-2 rounded hover:bg-gray-700" href="#">
                            Ticket #3
                        </Link>
                        <Link className="block px-4 py-2 rounded hover:bg-gray-700" href="#">
                            Ticket #4
                        </Link>
                        <Link className="block px-4 py-2 rounded hover:bg-gray-700" href="#">
                            Ticket #5
                        </Link>
                    </div>
                </div>
            </div>
            <div className="flex-1 flex flex-col">
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    <div className="flex items-end justify-end">
                        <div className="flex flex-col space-y-1 text-right max-w-xs">
                            <p className="text-sm text-gray-400">User • 10:00 AM</p>
                            <p className="px-4 py-2 rounded-lg bg-indigo-500 text-white">Hello, how can I help you today?</p>
                        </div>
                    </div>
                    <div className="flex items-end justify-start">
                        <div className="flex flex-col space-y-1 text-left max-w-xs">
                            <p className="text-sm text-gray-400">Chatbot • 10:01 AM</p>
                            <p className="px-4 py-2 rounded-lg bg-gray-700 text-gray-300">
                                Hi there! You can ask me anything about our products.
                            </p>
                        </div>
                    </div>
                    <div className="flex items-end justify-end">
                        <div className="flex flex-col space-y-1 text-right max-w-xs">
                            <p className="text-sm text-gray-400">User • 10:02 AM</p>
                            <p className="px-4 py-2 rounded-lg bg-indigo-500 text-white">What's the price of product X?</p>
                        </div>
                    </div>
                    <div className="flex items-end justify-start">
                        <div className="flex flex-col space-y-1 text-left max-w-xs">
                            <p className="text-sm text-gray-400">Chatbot • 10:03 AM</p>
                            <p className="px-4 py-2 rounded-lg bg-gray-700 text-gray-300">The price of product X is $99.99.</p>
                        </div>
                    </div>
                </div>
                <div className="border-t border-gray-700 p-4">
                    <div className="flex space-x-2">
                        <Input className="flex-1 bg-gray-700 text-gray-300" placeholder="Type your message here..." />
                        <Button className="bg-indigo-500 text-white">Send</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}