"use client";

import React from "react";
import "./globals.css";
import Link from "next/link";
import "@mescius/wijmo.cultures/wijmo.culture.ja";
import "@mescius/wijmo.styles/wijmo.css";
import {
  ScreenActionModeProvider,
  useScreenActionMode,
  ScreenActionMode,
  screenActionModeLabels,
  screenActionModeColors,
} from "@/presentation/hooks/useScreenActionMode";

function LayoutContent() {
  const { screenActionMode, setScreenActionMode } = useScreenActionMode();

  return (
    <>
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
      <div
        className={`p-4 shadow-sm transition-colors duration-300 border-b border-gray-300 ${screenActionModeColors[screenActionMode]}`}
      >
        <div className="flex space-x-6">
          {Object.entries(screenActionModeLabels).map(([mode, label]) => (
            <label key={mode} className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio h-5 w-5 text-blue-600"
                name="mode"
                value={mode}
                checked={screenActionMode === mode}
                onChange={() => setScreenActionMode(mode as ScreenActionMode)}
              />
              <span className="ml-2 text-gray-700">{label}</span>
            </label>
          ))}
        </div>
      </div>
    </>
  );
}

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
