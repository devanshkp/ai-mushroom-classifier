import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { MushroomDataProvider } from "./context/MushroomDataContext";
import Home from "./pages/Home";
import SpeciesList from "./pages/SpeciesList";
import SpeciesDetail from "./pages/SpeciesDetail";
import About from "./pages/About";
import Navbar from "./components/Navbar";

function App() {
  return (
    <MushroomDataProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/species" element={<SpeciesList />} />
          <Route path="/species/:scientificName" element={<SpeciesDetail />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Router>
    </MushroomDataProvider>
  );
}

export default App;
