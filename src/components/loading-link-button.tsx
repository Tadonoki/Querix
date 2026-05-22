"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

type LoadingLinkButtonProps = Omit<ButtonProps, "onClick" | "asChild"> & {
  href: string;
  loadingText?: string;
  requireAuth?: boolean;
};

function loginRedirectPath(href: string) {
  return `/login?redirect=${encodeURIComponent(href)}`;
}

export function LoadingLinkButton({
  href,
  loadingText = "Memuat...",
  requireAuth = false,
  children,
  className,
  disabled,
  ...props
}: LoadingLinkButtonProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { ready, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(false);
  }, [pathname]);

  function handleClick() {
    if (loading || disabled || (requireAuth && !ready)) {
      return;
    }

    const hrefPath = href.split("?")[0];
    if (hrefPath === pathname) {
      return;
    }

    setLoading(true);
    window.setTimeout(() => {
      router.push(
        requireAuth && !isAuthenticated ? loginRedirectPath(href) : href
      );
    }, 280);
  }

  return (
    <Button
      type="button"
      className={cn(
        "w-full max-w-full whitespace-normal text-center sm:w-auto sm:whitespace-nowrap",
        className
      )}
      disabled={disabled || loading || (requireAuth && !ready)}
      onClick={handleClick}
      {...props}
    >
      {loading ? (
        <>
          <LoadingSpinner />
          {loadingText}
        </>
      ) : (
        children
      )}
    </Button>
  );
}
