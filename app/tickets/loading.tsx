import "@/styles/loading.css";

export default function Loading() {
  return (
    <main className="flex w-full max-w-md sm:max-w-full h-full justify-center items-center  no-scrollbar">
      <div className="flex min-h-screen border-gray-700 overflow-y-auto  text-white dark ">
        <div className="flex-1 flex flex-col items-center justify-center text-center p-10 bg-gray-900">
          <h1 className="text-5xl font-bold mb-4 text-indigo-500">
            <span className="loadingrotate">🌀</span> Loading tickets
          </h1>
        </div>
      </div>
    </main>
  );
}
