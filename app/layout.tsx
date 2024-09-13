import React from "react";
import "./globals.css";
import "@mescius/wijmo.styles/wijmo.css";
import { ScreenActionModeProvider } from "@/presentation/hooks/useScreenActionMode";
import LayoutContent from "@/presentation/components/LayoutContent";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        <ScreenActionModeProvider>
          <LayoutContent />
          <div>{children}</div>
        </ScreenActionModeProvider>
      </body>
    </html>
  );
}
