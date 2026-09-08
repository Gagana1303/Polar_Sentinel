import React from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { CinematicDemoOverlay } from './CinematicDemoOverlay';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      width: '100vw',
      overflow: 'hidden',
      background: '#0a0e1a',
      color: '#e2e8f0',
    }}>
      <Header />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar />
        <main style={{
          flex: 1,
          overflow: 'auto',
          padding: 0,
          position: 'relative',
        }}>
          {children}
        </main>
      </div>
      <CinematicDemoOverlay />
    </div>
  );
};

