import "./globals.css";
import { Inter } from "next/font/google";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "得意先管理システム",
  description: "得意先情報の管理と表示",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
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
        {children}
      </body>
    </html>
  );
}
