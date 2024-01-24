import Link from "next/link";
import { redirect } from "next/navigation";

export default function Home() {
  redirect("/tickets");
  /* return (
    <div className="font-black text-9xl">
      Nothing to see here chief, go to{" "}
      <Link className="text-blue-500" href={"/tickets"}>
        TICKETS
      </Link>
    </div>
  ); */
}
