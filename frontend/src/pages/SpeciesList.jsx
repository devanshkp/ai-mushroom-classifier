import { Link } from "react-router-dom";
import species from "../data/species.json";

function SpeciesList() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Mushroom Species</h1>
      <ul className="space-y-2">
        {species.map((s) => (
          <li key={s.id}>
            <Link
              to={`/species/${s.id}`}
              className="text-blue-600 hover:underline"
            >
              {s.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SpeciesList;
