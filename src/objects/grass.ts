import * as THREE from "three";
import { Vector2Measurement } from "../types";

export const grassMeasurements: Vector2Measurement = {
  width: 15,
  height: 15,
};

export const createGrass = (textureLoader: THREE.TextureLoader): THREE.Mesh => {
  const grassColor = textureLoader.load("./grass/color.webp");
  grassColor.colorSpace = THREE.SRGBColorSpace;
  const grassAO = textureLoader.load("./grass/ao.webp");
  const grassRoughness = textureLoader.load("./grass/roughness.webp");
  const grassNormal = textureLoader.load("./grass/normal.webp");
  const grassAlpha = textureLoader.load("./grass/alpha.webp");

  const grassTextureRepetition = { x: 6, y: 6 };
  grassColor.repeat.set(grassTextureRepetition.x, grassTextureRepetition.y);
  grassAO.repeat.set(grassTextureRepetition.x, grassTextureRepetition.y);
  grassRoughness.repeat.set(grassTextureRepetition.x, grassTextureRepetition.y);
  grassNormal.repeat.set(grassTextureRepetition.x, grassTextureRepetition.y);

  grassColor.wrapS = THREE.RepeatWrapping;
  grassAO.wrapS = THREE.RepeatWrapping;
  grassRoughness.wrapS = THREE.RepeatWrapping;
  grassNormal.wrapS = THREE.RepeatWrapping;
  grassColor.wrapT = THREE.RepeatWrapping;
  grassAO.wrapT = THREE.RepeatWrapping;
  grassRoughness.wrapT = THREE.RepeatWrapping;
  grassNormal.wrapT = THREE.RepeatWrapping;

  const grass = new THREE.Mesh(
    new THREE.PlaneGeometry(grassMeasurements.width, grassMeasurements.height),
    new THREE.MeshStandardMaterial({
      map: grassColor,
      aoMap: grassAO,
      roughnessMap: grassRoughness,
      normalMap: grassNormal,
      alphaMap: grassAlpha,
      transparent: true,
    })
  );

  grass.position.set(0, -0.001, 2);
  grass.rotation.x = -Math.PI / 2;
  grass.receiveShadow = true;

  return grass;
};
