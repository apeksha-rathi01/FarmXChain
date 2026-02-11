import React from 'react';
import meshBg from '../../assets/dashboard-mesh.png';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen relative overflow-hidden font-sans">
      {/* Background Layer */}
      <div
        className="fixed inset-0 z-0 opacity-20 pointer-events-none"
        style={{ backgroundImage: `url(${meshBg})`, backgroundSize: 'cover' }}
      ></div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <main className="flex-1 p-6 transition-all duration-500">
          {children}
        </main>
      </div>
    </div>
  );
}
