import React from "react";
import "./globals.css";
import "@mescius/wijmo.styles/wijmo.css";
import { ScreenActionModeProvider } from "@/presentation/hooks/useScreenActionMode";
import Link from "next/link";
import { Toaster } from "react-hot-toast";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        <Toaster />
        <ScreenActionModeProvider>
          <nav className="bg-gray-800 text-white p-4">
            <ul className="flex space-x-4">
              <li>
                <Link href="/">ホーム</Link>
              </li>
              <li>
                <Link href="/customers">得意先一覧</Link>
              </li>
            </ul>
          </nav>
          <div>{children}</div>
        </ScreenActionModeProvider>
      </body>
    </html>
  );
}
