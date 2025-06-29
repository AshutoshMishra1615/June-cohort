import { ModeToggle } from "@/components/ModeToggle";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-4">
      <header className="w-full max-w-3xl">
        <ModeToggle />
      </header>
      <main className="flex w-full max-w-3xl flex-1 flex-col items-center justify-center">
        {children}
      </main>
    </div>
  );
}
