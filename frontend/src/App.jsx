import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { MushroomDataProvider } from "./context/MushroomDataContext";
import Home from "./pages/Home";
import SpeciesList from "./pages/SpeciesList";
import SpeciesDetail from "./pages/SpeciesDetail";
import About from "./pages/About";

function App() {
  return (
    <MushroomDataProvider>
      <Router>
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
