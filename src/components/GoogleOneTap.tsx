"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { signIn } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";

interface GoogleAccounts {
  id: {
    initialize: (config: {
      client_id: string;
      callback: (response: { credential: string }) => void;
      auto_select?: boolean;
      cancel_on_tap_outside?: boolean;
      use_fedcm_for_prompt?: boolean;
      context?: string;
    }) => void;
    prompt: (callback?: (notification: {
      isNotDisplayed: () => boolean;
      isSkippedMoment: () => boolean;
      getNotDisplayedReason: () => string;
      getSkippedReason: () => string;
    }) => void) => void;
    cancel: () => void;
  };
}

declare global {
  interface Window {
    google?: {
      accounts?: GoogleAccounts;
    };
    onGoogleScriptLoad?: () => void;
  }
}

const GoogleOneTap = () => {
  const { status } = useSession();
  const { toast } = useToast();

  useEffect(() => {
    // Only run if user is NOT authenticated
    if (status === "authenticated") {
      return;
    }

    // If still loading session, wait
    if (status === "loading") {
      return;
    }

    // Only proceed if not logged in
    if (status !== "unauthenticated") {
      return;
    }

    // Load Google Identity Services script
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;

    script.onload = () => {
      // Safety check
      if (!window.google?.accounts?.id) return;

      window.google.accounts.id.initialize({
    client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
    callback: async (response: { credential: string }) => {
        const result = await signIn("google-one-tap", {
        credential: response.credential,
        redirect: false,
        });
        
        if (result?.ok) {
          toast({
            variant: "success",
            title: "Login Successful",
            description: "You have been logged in with Google.",
          });
        } else {
          toast({
            variant: "destructive",
            title: "Login Failed",
            description: "Failed to login with Google. Please try again.",
          });
        }
    },
    auto_select: false,
    cancel_on_tap_outside: true,
    use_fedcm_for_prompt: true,  // ← ADD THIS LINE
    context: "signin",
    });

      // Show the One Tap prompt only if not logged in
      window.google.accounts.id.prompt((notification) => {
        // Optional: handle cases where prompt is blocked/suppressed
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          console.log("One Tap not shown:", notification.getNotDisplayedReason() || notification.getSkippedReason());
        }
      });
    };

    document.body.appendChild(script);

    // Cleanup
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
      // Cancel any pending prompt
      if (window.google?.accounts?.id) {
        window.google.accounts.id.cancel();
      }
    };
  }, [status]); // Re-run when session status changes

  return null;
};

export default GoogleOneTap;