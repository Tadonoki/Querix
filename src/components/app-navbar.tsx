"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { DatabaseZap, LogOut, Menu, UserRound, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/learn", label: "Belajar" },
  { href: "/challenges", label: "Tantangan" },
  { href: "/playground", label: "Playground" },
  { href: "/dashboard", label: "Dashboard", requireAuth: true }
];

function loginRedirectPath(href: string) {
  return `/login?redirect=${encodeURIComponent(href)}`;
}

function pathWithoutQuery(href: string) {
  return href.split("?")[0];
}

export function AppNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [loadingHref, setLoadingHref] = useState<string | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const noticeTimeoutRef = useRef<number | null>(null);
  const { user, ready, isAuthenticated, logout } = useAuth();
  const firstName = user?.name.split(" ")[0];

  useEffect(() => {
    setLoadingHref(null);
  }, [pathname]);

  useEffect(() => {
    return () => {
      if (noticeTimeoutRef.current) {
        window.clearTimeout(noticeTimeoutRef.current);
      }
    };
  }, []);

  function showNotice(message: string) {
    setNotice(message);

    if (noticeTimeoutRef.current) {
      window.clearTimeout(noticeTimeoutRef.current);
    }

    noticeTimeoutRef.current = window.setTimeout(() => {
      setNotice(null);
      noticeTimeoutRef.current = null;
    }, 2600);
  }

  function handleNavClick(item: (typeof navItems)[number]) {
    if (loadingHref || (item.requireAuth && !ready)) {
      return;
    }

    if (pathname === item.href) {
      setOpen(false);
      return;
    }

    const target =
      item.requireAuth && !isAuthenticated
        ? loginRedirectPath(item.href)
        : item.href;
    const targetPath = pathWithoutQuery(target);

    if (item.requireAuth && !isAuthenticated) {
      showNotice("Masuk dulu untuk membuka Dashboard.");
      setLoadingHref(null);
      setOpen(false);
      window.setTimeout(() => {
        router.push(target);
      }, 220);
      return;
    }

    if (pathname === targetPath) {
      setLoadingHref(null);
      setOpen(false);
      router.push(target);
      return;
    }

    setLoadingHref(targetPath === item.href ? item.href : null);
    setOpen(false);
    window.setTimeout(() => {
      router.push(target);
    }, 220);
  }

  function handleAuthNavClick(href: "/login" | "/signup") {
    if (loadingHref) {
      return;
    }

    if (pathname === href) {
      setOpen(false);
      return;
    }

    setLoadingHref(href);
    setOpen(false);
    window.setTimeout(() => {
      router.push(href);
    }, 220);
  }

  async function handleLogout() {
    if (loggingOut) {
      return;
    }

    setLoggingOut(true);
    await logout();
    setOpen(false);
    window.location.assign("/");
  }

  return (
    <header className="sticky top-0 z-50 border-b bg-background">
      {notice ? (
        <div
          role="status"
          className="fixed left-1/2 top-20 z-[60] max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-center text-sm font-semibold text-amber-900 shadow-soft"
        >
          {notice}
        </div>
      ) : null}
      <div className="container flex h-16 items-center justify-between gap-4 lg:h-[4.5rem]">
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold text-primary lg:text-[1.35rem]"
          onClick={() => setOpen(false)}
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground lg:h-10 lg:w-10">
            <DatabaseZap className="h-5 w-5 lg:h-[1.35rem] lg:w-[1.35rem]" aria-hidden="true" />
          </span>
          Querix
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            const loading = loadingHref === item.href;
            return (
              <button
                key={item.href}
                type="button"
                disabled={loadingHref !== null || (item.requireAuth && !ready)}
                onClick={() => handleNavClick(item)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-md px-3.5 py-2 text-[15px] font-medium text-muted-foreground transition hover:bg-white hover:text-foreground disabled:pointer-events-none disabled:opacity-70 lg:px-4 lg:py-2.5 lg:text-base",
                  active && "bg-white text-primary shadow-sm"
                )}
              >
                {loading ? <LoadingSpinner className="h-3.5 w-3.5" /> : null}
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {ready && user ? (
            <>
              <div className="flex items-center gap-2 rounded-md border bg-white px-3.5 py-2 text-[15px] font-semibold text-primary lg:px-4 lg:py-2.5 lg:text-base">
                <UserRound className="h-4 w-4" aria-hidden="true" />
                Halo, {firstName}
              </div>
              <Button
                variant="outline"
                className="text-[15px] lg:h-11 lg:px-5 lg:text-base"
                onClick={handleLogout}
              >
                {loggingOut ? (
                  <LoadingSpinner />
                ) : (
                  <LogOut className="h-4 w-4" aria-hidden="true" />
                )}
                {loggingOut ? "Keluar..." : "Logout"}
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                className="text-[15px] lg:h-11 lg:px-5 lg:text-base"
                disabled={loadingHref !== null}
                onClick={() => handleAuthNavClick("/login")}
              >
                {loadingHref === "/login" ? <LoadingSpinner /> : null}
                Masuk
              </Button>
              <Button
                className="text-[15px] lg:h-11 lg:px-5 lg:text-base"
                disabled={loadingHref !== null}
                onClick={() => handleAuthNavClick("/signup")}
              >
                {loadingHref === "/signup" ? <LoadingSpinner /> : null}
                Mulai Gratis
              </Button>
            </>
          )}
        </div>

        <Button
          variant="outline"
          size="icon"
          className="md:hidden"
          aria-label={open ? "Tutup menu" : "Buka menu"}
          onClick={() => setOpen((current) => !current)}
        >
          {open ? (
            <X className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Menu className="h-5 w-5" aria-hidden="true" />
          )}
        </Button>
      </div>

      {open ? (
        <div className="border-t bg-background md:hidden">
          <nav className="container flex flex-col gap-2 py-4">
            {navItems.map((item) => {
              const loading = loadingHref === item.href;
              return (
                <button
                  key={item.href}
                  type="button"
                  disabled={loadingHref !== null || (item.requireAuth && !ready)}
                  className="inline-flex items-center gap-2 rounded-md px-3 py-3 text-left text-sm font-semibold text-foreground hover:bg-white disabled:pointer-events-none disabled:opacity-70"
                  onClick={() => handleNavClick(item)}
                >
                  {loading ? <LoadingSpinner className="h-4 w-4" /> : null}
                  {item.label}
                </button>
              );
            })}
            {ready && user ? (
              <div className="mt-2 space-y-2 rounded-lg border bg-white p-3">
                <p className="flex items-center gap-2 text-sm font-semibold text-primary">
                  <UserRound className="h-4 w-4" aria-hidden="true" />
                  Halo, {user.name}
                </p>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleLogout}
                  disabled={loggingOut}
                >
                  {loggingOut ? (
                    <LoadingSpinner />
                  ) : (
                    <LogOut className="h-4 w-4" aria-hidden="true" />
                  )}
                  {loggingOut ? "Keluar..." : "Logout"}
                </Button>
              </div>
            ) : (
              <div className="mt-2 grid gap-2">
                <Button
                  variant="outline"
                  disabled={loadingHref !== null}
                  onClick={() => handleAuthNavClick("/login")}
                >
                  {loadingHref === "/login" ? <LoadingSpinner /> : null}
                  Masuk
                </Button>
                <Button
                  disabled={loadingHref !== null}
                  onClick={() => handleAuthNavClick("/signup")}
                >
                  {loadingHref === "/signup" ? <LoadingSpinner /> : null}
                  Mulai Gratis
                </Button>
              </div>
            )}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
