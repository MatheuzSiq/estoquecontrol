// app/layout.tsx
import "./globals.css";
import Navbar from "@/components/NavBar/NavBar";
import { Providers } from "./providers";
import AuthGuard from "@/components/AuthGuard";

export default function RootLayout({ children }: any) {
  return (
    <html lang="pt">
      <body className="bg-gray-900">
        <Providers>
          <AuthGuard>
            <Navbar />
            <main className="p-6">{children}</main>
          </AuthGuard>
        </Providers>
      </body>
    </html>
  );
}
