import Link from "next/link";

export default function Home() {
  return (
    <div className="font-black text-9xl">
      Nothing to see here chief, go to{" "}
      <Link className="text-blue-500" href={"/tickets"}>
        TICKETS
      </Link>
    </div>
  );
}
