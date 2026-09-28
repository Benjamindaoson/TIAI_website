"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { anchorHref, localizedHref } from "@/lib/routes";

interface MobileMenuProps {
  locale: string;
}

export default function MobileMenu({ locale }: MobileMenuProps) {
  const t = useTranslations("Navigation");
  const [open, setOpen] = useState(false);
  const canUsePortal = typeof document !== "undefined";

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const links = [
    { href: localizedHref(locale, "/about"), label: t("about") },
    { href: anchorHref(locale, "programs"), label: t("programs") },
    { href: localizedHref(locale, "/university-partnerships"), label: t("universities") },
    { href: localizedHref(locale, "/for-students"), label: t("students") },
    { href: localizedHref(locale, "/faculty"), label: t("faculty") },
    { href: localizedHref(locale, "/blog"), label: t("blog") },
    { href: anchorHref(locale, "insights"), label: t("insights") },
    { href: anchorHref(locale, "contact"), label: t("contact") },
  ];

  return (
    <div className="md:hidden">
      <Button variant="ghost" size="icon" aria-label={t("openMenu")} onClick={() => setOpen(true)}>
        <Menu className="h-5 w-5" />
      </Button>

      {canUsePortal &&
        open &&
        createPortal(
          <div className="fixed inset-0 z-[100] bg-slate-950">
            <div
              role="dialog"
              aria-modal="true"
              aria-label={t("mobileMenu")}
              className="flex min-h-screen flex-col bg-slate-950"
            >
              <div className="flex h-16 items-center justify-between border-b border-slate-800 px-4">
                <span className="text-xl font-bold tracking-tight text-slate-100">TIAI</span>
                <Button variant="ghost" size="icon" aria-label={t("closeMenu")} onClick={() => setOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <nav className="flex flex-1 flex-col gap-2 overflow-y-auto px-4 py-6">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="border-b border-slate-800 py-3 text-lg text-slate-200 hover:text-white"
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
          ,
          document.body
        )}
    </div>
  );
}
