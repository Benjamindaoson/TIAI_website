"use client";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";
import MobileMenu from "@/components/MobileMenu";
import { anchorHref, localizedHref, switchLocaleInPath } from "@/lib/routes";

export default function Header({ locale }: { locale: string }) {
  const t = useTranslations("Navigation");

  const switchLocale = (newLocale: string) => {
    const path = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    window.location.href = switchLocaleInPath(path, newLocale);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href={localizedHref(locale)} className="flex items-center space-x-2">
          <span className="text-xl font-bold tracking-tight text-slate-900">TIAI</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href={localizedHref(locale, "/programs/ai-ml")} className="transition-colors hover:text-primary">
            {t("programsNav")}
          </Link>
          <Link href={localizedHref(locale, "/blog")} className="transition-colors hover:text-primary">
            {t("blog")}
          </Link>
          <Link href={localizedHref(locale, "/about")} className="transition-colors hover:text-primary">
            {t("about")}
          </Link>
          <Link href={anchorHref(locale, "programs")} className="transition-colors hover:text-primary">
            {t("programs")}
          </Link>
          <Link href={anchorHref(locale, "partnership")} className="transition-colors hover:text-primary">
            {t("partnership")}
          </Link>
          <Link href={localizedHref(locale, "/faculty")} className="transition-colors hover:text-primary">
            {t("faculty")}
          </Link>
          <Link href={anchorHref(locale, "insights")} className="transition-colors hover:text-primary">
            {t("insights")}
          </Link>
          <Link href={anchorHref(locale, "contact")} className="transition-colors hover:text-primary">
            {t("contact")}
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Globe className="h-[1.2rem] w-[1.2rem]" />
                <span className="sr-only">Toggle language</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => switchLocale('en')}>English</DropdownMenuItem>
              <DropdownMenuItem onClick={() => switchLocale('zh')}>中文</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Link href={anchorHref(locale, "contact")} className="hidden md:block">
            <Button>{t("contact")}</Button>
          </Link>
          <MobileMenu locale={locale} />
        </div>
      </div>
    </header>
  );
}
