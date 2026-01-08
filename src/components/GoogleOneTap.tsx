"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { signIn } from "next-auth/react";

declare global {
  interface Window {
    google?: any;
    onGoogleScriptLoad?: () => void;
  }
}

const GoogleOneTap = () => {
  const { status } = useSession();

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
        await signIn("google-one-tap", {
        credential: response.credential,
        redirect: false,
        });
        // window.location.reload();  // Uncomment if needed
    },
    auto_select: false,
    cancel_on_tap_outside: true,
    use_fedcm_for_prompt: true,  // ← ADD THIS LINE
    context: "signin",
    });

      // Show the One Tap prompt only if not logged in
      window.google.accounts.id.prompt((notification: any) => {
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