import React, { useMemo } from "react";
import { Shape, ExtrudeGeometry, MeshStandardMaterial } from "three";
import mapData from '../../utils/custom.geo.json';
const NORTH_AFRICAN_COUNTRIES = [
  "Tunisia",
  "Algeria",
  "Libya",
  "Morocco",
  "Mauritania",
];

const COUNTRY_COLORS = {
  Tunisia: "#e74c3c",
  Algeria: "#3498db",
  Libya: "#f39c12",
  Morocco: "#2ecc71",
  Mauritania: "#9b59b6",
};

function polygonToShape(coords) {
  const shape = new Shape();

  // Convert coordinates - scale them down and adjust
  coords.forEach(([lon, lat], i) => {
    const x = (lon - 10) * 0.1; // Center around 10 longitude
    const y = (lat - 30) * 0.1; // Center around 30 latitude

    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  });

  return shape;
}

export default function NorthAfricaMap3D({ onSelect, selected }) {
  const countries = useMemo(() => {
    // Filter and process only North African countries
    const filteredFeatures = mapData.features.filter((feature) =>
      NORTH_AFRICAN_COUNTRIES.includes(feature.properties.name)
    );

    return filteredFeatures
      .map((feature) => {
        const name = feature.properties.name;

        // Handle both Polygon and MultiPolygon geometries
        let coordinates;
        if (feature.geometry.type === "Polygon") {
          coordinates = feature.geometry.coordinates[0];
        } else if (feature.geometry.type === "MultiPolygon") {
          // Take the first polygon from MultiPolygon
          coordinates = feature.geometry.coordinates[0][0];
        } else {
          console.warn(
            `Unsupported geometry type for ${name}: ${feature.geometry.type}`
          );
          return null;
        }

        try {
          const shape = polygonToShape(coordinates);

          const geometry = new ExtrudeGeometry(shape, {
            depth: 0.3,
            bevelEnabled: false,
            bevelSegments: 0,
            steps: 1,
            curveSegments: 12,
          });

          geometry.rotateX(Math.PI);
          geometry.center();

          return {
            name,
            color: COUNTRY_COLORS[name] || "#888888",
            geometry,
          };
        } catch (error) {
          console.error(`Error creating shape for ${name}:`, error);
          return null;
        }
      })
      .filter((country) => country !== null);
  }, []);

  return (
    <group
      scale={[0.5, 0.5, 0.5]}
      rotation={[0, Math.PI, 0]}
      position={[0, -0.5, -2]}
    >
      {countries.map((c) => (
        <mesh
          key={c.name}
          geometry={c.geometry}
          onPointerDown={() => onSelect && onSelect(c)}
        >
          <meshStandardMaterial
            color={c.color}
            emissive={c.color}
            emissiveIntensity={selected?.name === c.name ? 0.6 : 0.2}
            metalness={0.3}
            roughness={0.7}
          />
        </mesh>
      ))}
    </group>
  );
}
