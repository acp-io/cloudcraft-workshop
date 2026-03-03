import TodoApp from "@/components/TodoApp";

export default function Home() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:py-20">
      <header className="mb-8 text-center">
        <h1 className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-4xl font-bold text-transparent sm:text-5xl">
          TaskFlow
        </h1>
        <p className="mt-2 text-slate-400">Stay organized, get things done</p>
      </header>

      <TodoApp />
    </main>
  );
}
