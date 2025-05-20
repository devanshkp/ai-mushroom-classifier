import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SpeciesList from "./pages/SpeciesList";
import SpeciesDetail from "./pages/Species";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/species" element={<SpeciesList />} />
        <Route path="/species/:id" element={<SpeciesDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
