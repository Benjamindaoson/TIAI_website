"use client";
import { useState } from "react";
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

  const links = [
    { href: localizedHref(locale, "/programs/ai-ml"), label: t("programsNav") },
    { href: localizedHref(locale, "/blog"), label: t("blog") },
    { href: localizedHref(locale, "/about"), label: t("about") },
    { href: localizedHref(locale, "/faculty"), label: t("faculty") },
    { href: anchorHref(locale, "partnership"), label: t("partnership") },
    { href: anchorHref(locale, "contact"), label: t("contact") },
  ];

  return (
    <div className="md:hidden">
      <Button variant="ghost" size="icon" aria-label={t("openMenu")} onClick={() => setOpen(true)}>
        <Menu className="h-5 w-5" />
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 flex flex-col">
          <div className="flex items-center justify-between px-4 h-16 border-b border-slate-800">
            <span className="text-xl font-bold tracking-tight text-slate-100">TIAI</span>
            <Button variant="ghost" size="icon" aria-label={t("closeMenu")} onClick={() => setOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <nav className="flex flex-col gap-2 px-4 py-6">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-lg text-slate-200 hover:text-white py-3 border-b border-slate-800"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}
