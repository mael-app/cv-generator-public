import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { DevUsageDialog } from "./DevUsageDialog";
import { FileText } from "lucide-react";

export function Navbar() {
  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 max-w-7xl flex h-14 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <FileText className="h-5 w-5" />
          CV Generator
        </Link>
        <div className="flex items-center gap-2">
          <DevUsageDialog />
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
