import * as THREE from "three";
import { Vector2Measurement, Vector3Measurement } from "../types";
import { grassMeasurements } from "./grass";

export const streetMeasurements: {
  asphalt: Vector3Measurement;
  curb: Vector3Measurement;
  sidewalk: Vector3Measurement;
  roadMarking: Vector2Measurement;
} = {
  asphalt: {
    width: grassMeasurements.width,
    height: 0.05,
    depth: 5,
  },
  curb: {
    width: grassMeasurements.width,
    height: 0.08,
    depth: 0.1,
  },
  sidewalk: {
    width: grassMeasurements.width,
    height: 0.06,
    depth: 2,
  },
  roadMarking: {
    width: 1.4,
    height: 0.185,
  },
};

export const generateStreet = (
  textureLoader: THREE.TextureLoader
): THREE.Group => {
  const street = new THREE.Group();

  const asphaltColor = textureLoader.load("./asphalt/color.webp");
  asphaltColor.colorSpace = THREE.SRGBColorSpace;
  const asphaltARM = textureLoader.load("./asphalt/arm.webp");
  const asphaltNormal = textureLoader.load("./asphalt/normal.webp");

  const asphaltTextureRepetition = {
    x: 4,
    y: 4,
  };
  asphaltColor.repeat.set(
    asphaltTextureRepetition.x,
    asphaltTextureRepetition.y
  );
  asphaltARM.repeat.set(asphaltTextureRepetition.x, asphaltTextureRepetition.y);
  asphaltNormal.repeat.set(
    asphaltTextureRepetition.x,
    asphaltTextureRepetition.y
  );
  asphaltColor.wrapS = THREE.RepeatWrapping;
  asphaltARM.wrapS = THREE.RepeatWrapping;
  asphaltNormal.wrapS = THREE.RepeatWrapping;
  asphaltColor.wrapT = THREE.RepeatWrapping;
  asphaltARM.wrapT = THREE.RepeatWrapping;
  asphaltNormal.wrapT = THREE.RepeatWrapping;

  const streetAsphalt = new THREE.Mesh(
    new THREE.BoxGeometry(
      streetMeasurements.asphalt.width,
      streetMeasurements.asphalt.height,
      streetMeasurements.asphalt.depth
    ),
    new THREE.MeshStandardMaterial({
      map: asphaltColor,
      aoMap: asphaltARM,
      roughnessMap: asphaltARM,
      metalnessMap: asphaltARM,
      normalMap: asphaltNormal,
    })
  );
  streetAsphalt.position.y += streetMeasurements.asphalt.height / 2;

  /* STREET CURB */
  const streetCurbColor = textureLoader.load("./street_curb/color.webp");
  streetCurbColor.colorSpace = THREE.SRGBColorSpace;
  const streetCurbARM = textureLoader.load("./street_curb/arm.webp");
  const streetCurbNormal = textureLoader.load("./street_curb/normal.webp");

  const streetCurbTextureRepetition = {
    x: 40,
    y: 1,
  };
  streetCurbColor.repeat.set(
    streetCurbTextureRepetition.x,
    streetCurbTextureRepetition.y
  );
  streetCurbARM.repeat.set(
    streetCurbTextureRepetition.x,
    streetCurbTextureRepetition.y
  );
  streetCurbNormal.repeat.set(
    streetCurbTextureRepetition.x,
    streetCurbTextureRepetition.y
  );
  streetCurbColor.wrapS = THREE.RepeatWrapping;
  streetCurbARM.wrapS = THREE.RepeatWrapping;
  streetCurbNormal.wrapS = THREE.RepeatWrapping;
  streetCurbColor.wrapT = THREE.RepeatWrapping;
  streetCurbARM.wrapT = THREE.RepeatWrapping;
  streetCurbNormal.wrapT = THREE.RepeatWrapping;

  const streetCurb = new THREE.Mesh(
    new THREE.BoxGeometry(
      streetMeasurements.curb.width,
      streetMeasurements.curb.height,
      streetMeasurements.curb.depth
    ),
    new THREE.MeshStandardMaterial({
      map: streetCurbColor,
      aoMap: streetCurbARM,
      roughnessMap: streetCurbARM,
      metalnessMap: streetCurbARM,
      normalMap: streetCurbNormal,
    })
  );
  streetCurb.position.y += streetMeasurements.curb.height / 2;
  streetCurb.position.z = -(
    streetMeasurements.asphalt.depth! / 2 +
    streetMeasurements.curb.depth! / 2
  );

  const streetCurb2 = streetCurb.clone();
  streetCurb2.position.z =
    streetMeasurements.asphalt.depth! / 2 + streetMeasurements.curb.depth! / 2;

  /* SIDEWALK */

  const sidewalkColor = textureLoader.load("./sidewalk/color.webp");
  sidewalkColor.colorSpace = THREE.SRGBColorSpace;
  const sidewalkARM = textureLoader.load("./sidewalk/arm.webp");
  const sidewalkNormal = textureLoader.load("./sidewalk/normal.webp");

  const sidewalkTextureRepetition = {
    x: 15,
    y: 2,
  };
  sidewalkColor.repeat.set(
    sidewalkTextureRepetition.x,
    sidewalkTextureRepetition.y
  );
  sidewalkARM.repeat.set(
    sidewalkTextureRepetition.x,
    sidewalkTextureRepetition.y
  );
  sidewalkNormal.repeat.set(
    sidewalkTextureRepetition.x,
    sidewalkTextureRepetition.y
  );
  sidewalkColor.wrapS = THREE.RepeatWrapping;
  sidewalkARM.wrapS = THREE.RepeatWrapping;
  sidewalkNormal.wrapS = THREE.RepeatWrapping;
  sidewalkColor.wrapT = THREE.RepeatWrapping;
  sidewalkARM.wrapT = THREE.RepeatWrapping;
  sidewalkNormal.wrapT = THREE.RepeatWrapping;

  const sidewalk = new THREE.Mesh(
    new THREE.BoxGeometry(
      streetMeasurements.sidewalk.width,
      streetMeasurements.sidewalk.height,
      streetMeasurements.sidewalk.depth
    ),
    new THREE.MeshStandardMaterial({
      map: sidewalkColor,
      aoMap: sidewalkARM,
      roughnessMap: sidewalkARM,
      metalnessMap: sidewalkARM,
      normalMap: sidewalkNormal,
    })
  );
  sidewalk.position.y = streetMeasurements.sidewalk.height / 2;
  sidewalk.position.z =
    streetCurb.position.z -
    streetMeasurements.curb.depth! / 2 -
    streetMeasurements.sidewalk.depth! / 2;
  sidewalk.receiveShadow = true;

  const sidewalk2 = sidewalk.clone();
  sidewalk2.position.z = -sidewalk.position.z;

  const streetCurb3 = streetCurb.clone();
  streetCurb3.position.z -=
    streetCurb.position.y +
    streetMeasurements.sidewalk.depth! +
    streetMeasurements.curb.depth! / 2;

  const streetCurb4 = streetCurb.clone();
  streetCurb4.position.z = -streetCurb3.position.z;

  /* ROAD MARKINGS */
  const roadMarkings = new THREE.Group();
  const roadMarking = new THREE.Mesh(
    new THREE.PlaneGeometry(
      streetMeasurements.roadMarking.width,
      streetMeasurements.roadMarking.height
    ),
    new THREE.MeshStandardMaterial()
  );
  roadMarking.rotation.x = -Math.PI / 2;

  const roadMarking2 = roadMarking.clone();
  roadMarking2.position.x = 5;

  const roadMarking3 = roadMarking.clone();
  roadMarking3.position.x = -5;

  roadMarkings.add(roadMarking, roadMarking2, roadMarking3);
  roadMarkings.position.y += streetMeasurements.asphalt.height + 0.01;

  street.add(
    streetAsphalt,
    streetCurb,
    streetCurb2,
    sidewalk,
    sidewalk2,
    streetCurb3,
    streetCurb4,
    roadMarkings
  );
  return street;
};
