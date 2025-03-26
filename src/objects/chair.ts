import * as THREE from "three";
import { Vector3Measurement } from "../types";

const chairMeasurements: {
  leg: Vector3Measurement;
  seat: Vector3Measurement;
  backPost: Vector3Measurement;
  backrest: Vector3Measurement;
} = {
  leg: {
    width: 0.04,
    height: 0.3,
    depth: 0.04,
  },
  seat: {
    width: 1,
    height: 0.06,
    depth: 0.35,
  },
  backPost: {
    width: 0.04,
    height: 0.4,
    depth: 0.04,
  },
  backrest: {
    width: 1,
    height: 0.2,
    depth: 0.03,
  },
};

export const createChair = (
  textureLoader: THREE.TextureLoader
): THREE.Group => {
  const chair = new THREE.Group();

  // chair legs
  const chairColor = textureLoader.load("./chair/color.webp");
  chairColor.colorSpace = THREE.SRGBColorSpace;
  const chairARM = textureLoader.load("./chair/arm.webp");
  const chairNormal = textureLoader.load("./chair/normal.webp");
  chairColor.rotation = Math.PI / 2;
  chairARM.rotation = Math.PI / 2;
  chairNormal.rotation = Math.PI / 2;

  const chairTextureRepetition = {
    x: 0.45,
    y: 3,
  };

  chairColor.repeat.set(chairTextureRepetition.x, chairTextureRepetition.y);
  chairARM.repeat.set(chairTextureRepetition.x, chairTextureRepetition.y);
  chairNormal.repeat.set(chairTextureRepetition.x, chairTextureRepetition.y);

  chairColor.wrapS = THREE.RepeatWrapping;
  chairARM.wrapS = THREE.RepeatWrapping;
  chairNormal.wrapS = THREE.RepeatWrapping;
  chairColor.wrapT = THREE.RepeatWrapping;
  chairARM.wrapT = THREE.RepeatWrapping;
  chairNormal.wrapT = THREE.RepeatWrapping;

  const chairMaterial = new THREE.MeshStandardMaterial({
    map: chairColor,
    aoMap: chairARM,
    roughnessMap: chairARM,
    metalnessMap: chairARM,
    normalMap: chairNormal,
  });

  const chairLegGeometry = new THREE.BoxGeometry(
    chairMeasurements.leg.width,
    chairMeasurements.leg.height,
    chairMeasurements.leg.depth
  );
  const chairLegs = new THREE.Group();

  const chairLeg1 = new THREE.Mesh(chairLegGeometry, chairMaterial);
  chairLeg1.position.set(
    chairMeasurements.leg.width / 2,
    chairMeasurements.leg.height / 2,
    chairMeasurements.leg.depth! / 2
  );

  const chairLeg2 = new THREE.Mesh(chairLegGeometry, chairMaterial);
  chairLeg2.position.set(
    chairMeasurements.seat.width - chairMeasurements.leg.width / 2,
    chairMeasurements.leg.height / 2,
    chairMeasurements.leg.depth! / 2
  );

  const chairLeg3 = new THREE.Mesh(chairLegGeometry, chairMaterial);
  chairLeg3.position.set(
    chairMeasurements.leg.width / 2,
    chairMeasurements.leg.height / 2,
    chairMeasurements.seat.depth! - chairMeasurements.leg.depth! / 2
  );

  const chairLeg4 = new THREE.Mesh(chairLegGeometry, chairMaterial);
  chairLeg4.position.set(
    chairMeasurements.seat.width - chairMeasurements.leg.width / 2,
    chairMeasurements.leg.height / 2,
    chairMeasurements.seat.depth! - chairMeasurements.leg.depth! / 2
  );
  chairLegs.add(chairLeg1, chairLeg2, chairLeg3, chairLeg4);
  chairLegs.children.forEach((leg) => (leg.castShadow = true));

  // chair seat
  const chairSeat = new THREE.Mesh(
    new THREE.BoxGeometry(
      chairMeasurements.seat.width,
      chairMeasurements.seat.height,
      chairMeasurements.seat.depth
    ),
    chairMaterial
  );
  chairSeat.position.set(
    chairMeasurements.seat.width / 2,
    chairMeasurements.seat.height / 2 + chairMeasurements.leg.height,
    chairMeasurements.seat.depth! / 2
  );
  chairSeat.scale.set(1.02, 1, 1.02);
  chairSeat.castShadow = true;

  // chair back
  const chairBack = new THREE.Group();

  const chairPostGeometry = new THREE.BoxGeometry(
    chairMeasurements.backPost.width,
    chairMeasurements.backPost.height,
    chairMeasurements.backPost.depth
  );

  const chairBackPost1 = new THREE.Mesh(chairPostGeometry, chairMaterial);
  chairBackPost1.position.set(
    chairMeasurements.seat.width - chairMeasurements.leg.width / 2,
    chairMeasurements.backPost.height / 2 +
      chairMeasurements.leg.height +
      chairMeasurements.seat.height,
    chairMeasurements.leg.depth! / 2
  );
  const chairBackPost2 = new THREE.Mesh(chairPostGeometry, chairMaterial);
  chairBackPost2.position.set(
    chairMeasurements.backPost.width / 2,
    chairMeasurements.backPost.height / 2 +
      chairSeat.position.y +
      chairMeasurements.seat.height / 2,
    chairMeasurements.leg.depth! / 2
  );

  const chairBackrest = new THREE.Mesh(
    new THREE.BoxGeometry(
      chairMeasurements.backrest.width,
      chairMeasurements.backrest.height,
      chairMeasurements.backrest.depth
    ),
    chairMaterial
  );

  const chairHeight =
    chairMeasurements.leg.height +
    chairMeasurements.seat.height +
    chairMeasurements.backPost.height;

  chairBackrest.position.set(
    chairMeasurements.backrest.width / 2,
    chairHeight - chairMeasurements.backrest.height / 2 - 0.02,
    chairMeasurements.backPost.depth! + chairMeasurements.backrest.depth! / 2
  );
  chairBackrest.scale.x = 1.1;

  chairBack.add(chairBackPost1, chairBackPost2, chairBackrest);
  chairBack.children.forEach((element) => (element.castShadow = true));

  chair.position.z = -0.5;
  chair.add(chairLegs, chairSeat, chairBack);

  return chair;
};
