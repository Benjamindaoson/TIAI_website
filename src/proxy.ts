import createMiddleware from "next-intl/middleware";
import { defaultLocale, locales } from "@/lib/site";

export default createMiddleware({
  locales: [...locales],
  defaultLocale,
});

export const config = {
  matcher: ["/", "/(zh|en)/:path*"],
};
