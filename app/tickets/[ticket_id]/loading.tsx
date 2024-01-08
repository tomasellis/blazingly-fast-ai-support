import "@/styles/loading.css";

export default function Loading() {
  return (
    <div className="w-full h-full flex flex-col no-scrollbar">
      <div className="h-full no-scrollbar overflow-auto p-4 space-y-4 no-scrollbar"></div>
      <div className="flex-1 flex flex-grow w-full h-full justify-center items-center text-3xl no-scrollbar">
        <h1>
          <span className="opacity-50">🌀</span>Loading chat...
        </h1>
      </div>
    </div>
  );
}
