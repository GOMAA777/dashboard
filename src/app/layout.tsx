import "@/lib/ensure-latn-numerals";
import { Suspense } from "react";
import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "sonner";
import { cn } from "@/lib/utils";
import { AppAuthShell } from "@/components/shared/AppAuthShell";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "لوحة التحكم - الجودي لإدارة مكاتب وشركات المحاماة",
  description: "المنصة السحابية المتكاملة لإدارة مكاتب المحاماة، القضايا، الجلسات، والموكلين - الجودي",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning className={cn(cairo.variable, "font-sans")}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                (function() {
                  if (window.__LATN_INITIALIZED__) return;
                  window.__LATN_INITIALIZED__ = true;
                  var origNum = Number.prototype.toLocaleString;
                  var origDate = Date.prototype.toLocaleDateString;
                  var origTime = Date.prototype.toLocaleTimeString;
                  var origDateTime = Date.prototype.toLocaleString;
                  var OrigNF = Intl.NumberFormat;
                  var OrigDTF = Intl.DateTimeFormat;

                  function fixN(loc, opt) {
                    var o = Object.assign({}, opt, { numberingSystem: 'latn' });
                    var l = (!loc || loc === 'ar' || loc.indexOf('ar-') === 0) ? 'en-US' : loc;
                    return { l: l, o: o };
                  }
                  function fixD(loc, opt) {
                    var o = Object.assign({}, opt, { numberingSystem: 'latn' });
                    var l = !loc ? 'ar-SA-u-nu-latn' : (typeof loc === 'string' && loc.indexOf('ar') === 0 && loc.indexOf('-u-nu-') === -1 ? loc + '-u-nu-latn' : loc);
                    return { l: l, o: o };
                  }

                  Number.prototype.toLocaleString = function(loc, opt) {
                    var r = fixN(loc, opt);
                    return origNum.call(this, r.l, r.o);
                  };
                  Date.prototype.toLocaleDateString = function(loc, opt) {
                    var r = fixD(loc, opt);
                    return origDate.call(this, r.l, r.o);
                  };
                  Date.prototype.toLocaleTimeString = function(loc, opt) {
                    var r = fixD(loc, opt);
                    return origTime.call(this, r.l, r.o);
                  };
                  Date.prototype.toLocaleString = function(loc, opt) {
                    var r = fixD(loc, opt);
                    return origDateTime.call(this, r.l, r.o);
                  };
                  Intl.NumberFormat = function(loc, opt) {
                    var r = fixN(loc, opt);
                    return new OrigNF(r.l, r.o);
                  };
                  Intl.NumberFormat.prototype = OrigNF.prototype;
                  Intl.NumberFormat.supportedLocalesOf = OrigNF.supportedLocalesOf;
                  Intl.DateTimeFormat = function(loc, opt) {
                    var r = fixD(loc, opt);
                    return new OrigDTF(r.l, r.o);
                  };
                  Intl.DateTimeFormat.prototype = OrigDTF.prototype;
                  Intl.DateTimeFormat.supportedLocalesOf = OrigDTF.supportedLocalesOf;
                })();

                var t = localStorage.getItem('app-theme');
                if (t === 'dark') {
                  document.documentElement.classList.add('dark');
                } else if (t === 'light') {
                  document.documentElement.classList.remove('dark');
                }
                var d = localStorage.getItem('app-direction');
                if (d === 'ltr' || d === 'rtl') {
                  document.documentElement.dir = d;
                }
                var l = localStorage.getItem('app-language');
                if (l === 'ar' || l === 'en') {
                  document.documentElement.lang = l;
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased selection:bg-[#f3e3c3] selection:text-[#78541c]">
        <Suspense fallback={null}>
          <NuqsAdapter>
            <AppAuthShell>{children}</AppAuthShell>
            <Toaster
              position="bottom-left"
              dir="rtl"
              closeButton
              offset={28}
              toastOptions={{
                style: {
                  fontFamily: "var(--font-cairo), sans-serif",
                },
              }}
            />
          </NuqsAdapter>
        </Suspense>
      </body>
    </html>
  );
}
