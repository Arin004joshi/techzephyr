import HeroSection from "./components/Herosection"
import StatsSection from "./components/StatsSection"
import BrandKits from "./components/BrandKits"
import ClientLogos from "./components/ClientLogos"
import Services from "./components/Services"

function App() {
  return (
    <main className="min-h-screen text-slate-900">
      <HeroSection />
      <StatsSection />
      <BrandKits />
      <ClientLogos />
      <Services />
    </main>
  )
}

export default App
