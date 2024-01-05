import Image from 'next/image'
import { Button } from '@/components/ui/button'
import Chat from '@/components/chat'

export default function Home() {
  return (
    <main className="flex justify-center">
      <Chat></Chat>
    </main>
  )
}
