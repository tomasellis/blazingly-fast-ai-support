import dynamic from "next/dynamic"

const DynamicChatbox = dynamic(() => import("./tuqui"))
export default function Terrible() {
  return <DynamicChatbox/>
}