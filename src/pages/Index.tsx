import { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AuthModal from "@/components/AuthModal";

const Index = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <main className="bg-background">
      <Navbar onAuthClick={() => setIsAuthModalOpen(true)} />
      <HeroSection />
      <AuthModal 
        open={isAuthModalOpen} 
        onOpenChange={setIsAuthModalOpen}
      >
        <div />
      </AuthModal>
    </main>
  );
};

export default Index;
