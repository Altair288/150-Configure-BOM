import type { Metadata } from "next";
import "./globals.css";
import { QueryProvider } from "@/lib/query/query-provider";
import { Ui5Provider } from "@/components/ui5/ui5-provider";

export const metadata: Metadata = {
  title: {
    default: "Super BOM Configurator",
    template: "%s | Super BOM Configurator",
  },
  description: "Enterprise product configuration workspace for Super BOM and variants.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" dir="ltr">
      <body>
        <Ui5Provider>
          <QueryProvider>{children}</QueryProvider>
        </Ui5Provider>
      </body>
    </html>
  );
}
