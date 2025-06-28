"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

export default function SignOutPage() {
  const [loading, setLoading] = useState(false);

  const handleSignOut = () => {
    setLoading(true);
    toast.info("Signing you out...");
    signOut({ callbackUrl: "/signin" });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <h1 className="text-2xl font-semibold mb-2">Ready to Sign Out?</h1>
      <p className="text-muted-foreground mb-6 text-center">
        Click below to securely end your session.
      </p>

      <Button onClick={handleSignOut} disabled={loading}>
        <LogOut className="w-4 h-4 mr-2" />
        {loading ? "Signing out..." : "Sign Out"}
      </Button>
    </div>
  );
}
