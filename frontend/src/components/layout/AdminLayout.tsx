'use client';

import { Sidebar } from './Sidebar';
import { Header } from './Header';
import AIChatBubble from '../AIChatBubble';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden dark:bg-gray-950 transition-colors">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
      <AIChatBubble mode="admin" />
    </div>
  );
}
