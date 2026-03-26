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

export default function Header({ locale }: { locale: string }) {
  const t = useTranslations("Navigation");

  const switchLocale = (newLocale: string) => {
    // Simple locale switcher by replacing the URL path
    const path = window.location.pathname;
    const segments = path.split("/");
    segments[1] = newLocale;
    window.location.href = segments.join("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href={`/${locale}`} className="flex items-center space-x-2">
          <span className="text-xl font-bold tracking-tight text-slate-900">TIAI</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href={`/${locale}/programs/ai-ml`} className="transition-colors hover:text-primary">
            {t("programsNav")}
          </Link>
          <Link href={`/${locale}/blog`} className="transition-colors hover:text-primary">
            {t("blog")}
          </Link>
          <Link href={`/${locale}#about`} className="transition-colors hover:text-primary">
            {t("about")}
          </Link>
          <Link href={`/${locale}#programs`} className="transition-colors hover:text-primary">
            {t("programs")}
          </Link>
          <Link href={`/${locale}#partnership`} className="transition-colors hover:text-primary">
            {t("partnership")}
          </Link>
          <Link href={`/${locale}#faculty`} className="transition-colors hover:text-primary">
            {t("faculty")}
          </Link>
          <Link href={`/${locale}#insights`} className="transition-colors hover:text-primary">
            {t("insights")}
          </Link>
          <Link href={`/${locale}#contact`} className="transition-colors hover:text-primary">
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
              <DropdownMenuItem onClick={() => switchLocale('en')}>
                English
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => switchLocale('zh')}>
                中文
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Link href={`/${locale}#contact`} className="hidden md:block">
             <Button>{t("contact")}</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
