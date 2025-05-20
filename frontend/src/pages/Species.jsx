import { useParams } from "react-router-dom";
import speciesData from "../data/species.json";

function SpeciesDetail() {
  const { id } = useParams();
  const species = speciesData.find((s) => s.id === id);

  if (!species) return <div className="p-6">Species not found.</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">{species.name}</h1>
      <p className="mt-2">
        <strong>Edibility:</strong> {species.edibility}
      </p>
      <p className="mt-2">
        <strong>Description:</strong> {species.description}
      </p>
      <p className="mt-2">
        <strong>Habitat:</strong> {species.habitat}
      </p>
    </div>
  );
}

export default SpeciesDetail;
