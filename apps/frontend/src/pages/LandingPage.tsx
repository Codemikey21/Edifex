import Navbar from '../components/common/Navbar'
import Hero from '../components/common/Hero'
import SearchBar from '../components/common/SearchBar'
import WorkersSection from '../components/marketplace/WorkersSection'

function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F5F2ED]">
      <div className="relative bg-[#1A2F1A]">
        <Navbar />
        <Hero />
      </div>
      <SearchBar />
      <WorkersSection />
    </div>
  )
}

export default LandingPage