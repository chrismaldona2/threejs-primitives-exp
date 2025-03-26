import * as THREE from "three";
import { Vector3Measurement } from "../types";

const fireflyMeasurement: Vector3Measurement = {
  width: 0.0085,
  height: 0.0085,
  depth: 0.0085,
};

export const generateRandomFireflies = (amount: number): THREE.Group => {
  const fireflies = new THREE.Group();

  const fireflyGeometry = new THREE.BoxGeometry(
    fireflyMeasurement.width,
    fireflyMeasurement.height,
    fireflyMeasurement.depth
  );
  const fireflyMaterial = new THREE.MeshStandardMaterial({
    emissive: "yellow",
  });

  for (let i = 0; i < amount; i++) {
    const firefly = new THREE.Mesh(fireflyGeometry, fireflyMaterial);

    firefly.position.x = (Math.random() - 0.5) * 12;
    firefly.position.z = (Math.random() - 0.5) * 10;
    firefly.position.y = Math.random() * 2 + 0.4;

    firefly.userData = {
      phase: Math.random() * Math.PI * 2,
      speed: 0.01 + Math.random() * 0.2,
      radius: 0.5 + Math.random() * 9,
      direction: Math.random() > 0.5 ? 1 : -1,
    };

    fireflies.add(firefly);
  }

  return fireflies;
};
