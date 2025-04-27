import React from 'react';
import SideNavigation from './SideNavigation';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="relative overflow-hidden">
      {/* Background glow effects */}
      <div className="fixed top-1/4 -left-20 w-40 h-40 rounded-full bg-primary opacity-20 blur-3xl animate-pulse-slow"></div>
      <div className="fixed bottom-1/4 -right-20 w-40 h-40 rounded-full bg-primary opacity-20 blur-3xl animate-pulse-slow"></div>
      
      <div className="bg-pattern min-h-screen">
        <div className="flex">
          <SideNavigation />
          
          <main className="ml-64 flex-1 min-h-screen p-6">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl font-bold mb-6 flex items-center">
                <span className="text-primary mr-2 glow-text">{title}</span>
                {subtitle && (
                  <span className="text-muted-foreground text-base font-normal">/ {subtitle}</span>
                )}
              </h2>
              
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
