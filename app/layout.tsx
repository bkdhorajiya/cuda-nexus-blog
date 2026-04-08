import type { Metadata } from "next";
import { Inter, Outfit, Fira_Code } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const firaCode = Fira_Code({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CUDA Nexus | Deep Dive into GPU Programming",
  description: "Detailed explanations on CUDA sample code and modern GPU programming techniques.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} ${firaCode.variable}`}
    >
      <body>
        <header className="nav-header">
          <div className="container nav-container">
            <a href="/" className="logo">
              CUDA<span>Nexus</span>
            </a>
            <nav className="nav-links">
              <a href="/">Home</a>
              <a href="/about">About</a>
            </nav>
          </div>
        </header>
        <main style={{ flex: 1 }}>{children}</main>
        <footer style={{ borderTop: '1px solid var(--border-color)', padding: '40px 0', marginTop: '80px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <p>© {new Date().getFullYear()} CUDA Nexus. Built for the developer community.</p>
        </footer>
      </body>
    </html>
  );
}
