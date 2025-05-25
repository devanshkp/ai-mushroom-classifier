import { createContext, useContext, useState, useEffect } from "react";

const MushroomDataContext = createContext();

export const useMushroomData = () => {
  const context = useContext(MushroomDataContext);
  if (!context) {
    throw new Error(
      "useMushroomData must be used within a MushroomDataProvider"
    );
  }
  return context;
};

export const MushroomDataProvider = ({ children }) => {
  const [mushrooms, setMushrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadMushroomData();
  }, []);

  const loadMushroomData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load from JSON file in public directory
      // Place your mushrooms.json file in public/data/mushrooms.json
      const response = await fetch("/data/mushrooms.json");

      if (!response.ok) {
        throw new Error(
          `Failed to load mushroom data: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      // Validate data structure
      if (!Array.isArray(data)) {
        throw new Error("Invalid data format: expected an array of mushrooms");
      }

      // Basic validation for required fields
      const validatedData = data.filter((mushroom) => {
        const hasRequiredFields =
          mushroom.scientific_name && mushroom.common_name;
        if (!hasRequiredFields) {
          console.warn(
            "Skipping mushroom with missing required fields:",
            mushroom
          );
        }
        return hasRequiredFields;
      });

      setMushrooms(validatedData);
      console.log(`Loaded ${validatedData.length} mushroom species`);
    } catch (err) {
      console.error("Error loading mushroom data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Find mushroom by scientific name (exact match, case insensitive)
  const getMushroomByScientificName = (scientificName) => {
    if (!scientificName) return null;
    return mushrooms.find(
      (mushroom) =>
        mushroom.scientific_name.toLowerCase() === scientificName.toLowerCase()
    );
  };

  // Find mushroom by common name (partial match, case insensitive)
  const getMushroomByCommonName = (commonName) => {
    if (!commonName) return null;
    return mushrooms.find((mushroom) =>
      mushroom.common_name.toLowerCase().includes(commonName.toLowerCase())
    );
  };

  // Search mushrooms by query (searches scientific name, common name, and description)
  const searchMushrooms = (query) => {
    if (!query || query.trim() === "") return mushrooms;

    const lowerQuery = query.toLowerCase().trim();
    return mushrooms.filter(
      (mushroom) =>
        mushroom.scientific_name.toLowerCase().includes(lowerQuery) ||
        mushroom.common_name.toLowerCase().includes(lowerQuery) ||
        (mushroom.description &&
          mushroom.description.toLowerCase().includes(lowerQuery))
    );
  };

  // Filter mushrooms by edibility status
  const getMushroomsByEdibility = (edibilityType) => {
    if (!edibilityType) return mushrooms;

    const lowerType = edibilityType.toLowerCase();
    return mushrooms.filter(
      (mushroom) =>
        mushroom.edibility &&
        mushroom.edibility.toLowerCase().includes(lowerType)
    );
  };

  // Get mushrooms by habitat keywords
  const getMushroomsByHabitat = (habitatKeyword) => {
    if (!habitatKeyword) return mushrooms;

    const lowerKeyword = habitatKeyword.toLowerCase();
    return mushrooms.filter(
      (mushroom) =>
        mushroom.habitat &&
        mushroom.habitat.toLowerCase().includes(lowerKeyword)
    );
  };

  // Get random mushrooms for featured species, etc.
  const getRandomMushrooms = (count = 5) => {
    const shuffled = [...mushrooms].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const contextValue = {
    // Data
    mushrooms,
    loading,
    error,

    // Methods
    getMushroomByScientificName,
    getMushroomByCommonName,
    searchMushrooms,
    getMushroomsByEdibility,
    getMushroomsByHabitat,
    getRandomMushrooms,
    reloadData: loadMushroomData,

    // Computed values
    totalCount: mushrooms.length,
    edibleCount: mushrooms.filter((m) =>
      m.edibility?.toLowerCase().includes("edible")
    ).length,
    toxicCount: mushrooms.filter(
      (m) =>
        m.edibility?.toLowerCase().includes("toxic") ||
        m.edibility?.toLowerCase().includes("poisonous")
    ).length,
  };

  return (
    <MushroomDataContext.Provider value={contextValue}>
      {children}
    </MushroomDataContext.Provider>
  );
};
