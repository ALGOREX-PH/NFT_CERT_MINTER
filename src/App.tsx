import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import NFTMinter from './components/NFTMinter';
import BackgroundEffect from './components/BackgroundEffect';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-primary-950 text-white relative overflow-hidden">
      <BackgroundEffect />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center p-4">
          <NFTMinter />
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default App;