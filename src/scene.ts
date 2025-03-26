import "./style.css";
import * as THREE from "three";
import GUI from "lil-gui";
import { OrbitControls, Timer } from "three/examples/jsm/Addons.js";
import { toggleFullscreen } from "./fullscreen";
import { createGrass } from "./objects/grass";
import { createChair } from "./objects/chair";
import { generateStreet, streetMeasurements } from "./objects/street";
import { generateRandomFireflies } from "./objects/fireflies";

/* SETUP */

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <canvas id="canvas"/>
`;
interface Measurement {
  width: number;
  height: number;
  depth?: number;
}
const sizes: Measurement = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const canvas = document.getElementById("canvas")!;

// gui
const gui = new GUI({ title: "Scene", closeFolders: true });
gui.hide();
const toggleGui = () => {
  gui.show(gui._hidden);
};

// scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x04050e);

// camera
const camera = new THREE.PerspectiveCamera(
  45,
  sizes.width / sizes.height,
  0.1,
  1000
);
camera.position.set(8, 3, 4.5);
scene.add(camera);

// texture loader
const textureLoader = new THREE.TextureLoader();

// renderer
const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
renderer.shadowMap.enabled = true;

const render = () => renderer.render(scene, camera);

// orbit controls
const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.enableDamping = true;
orbitControls.target.set(1, 0, 0);

// renders --- animations
const tick = () => {
  window.requestAnimationFrame(tick);
  orbitControls.update();
  render();
};
tick();

// events listeners
canvas.addEventListener("dblclick", () => toggleFullscreen(canvas));
window.addEventListener("keydown", (event) => {
  switch (event.key.toLowerCase()) {
    case "f":
      toggleFullscreen(canvas);
      break;
    case "h":
      toggleGui();
      break;
  }
});
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
});

const sceneParams = {
  fog: {
    color: 0x5761ea,
    density: 0.027,
  },
  lamps: {
    color: 0xadb3ff,
    intensity: 2,
  },
  streetLight: {
    color: 0x347cef,
    intensity: 3.1,
    distance: 3.5,
    decay: 1.5,
  },
  ambientLight: {
    color: 0x1f4bff,
    intensity: 0.1,
  },
};

/* FOG */
const fog = new THREE.FogExp2(sceneParams.fog.color, sceneParams.fog.density);
scene.fog = fog;
const fogTweaks = gui.addFolder("Fog");
fogTweaks
  .addColor(sceneParams.fog, "color")
  .onChange((value: THREE.Color) => fog.color.set(value));
fogTweaks.add(fog, "density").min(0).max(0.2).step(0.001);

/* OBJECTS */
const lampsTweaks = gui.addFolder("Lamps");
lampsTweaks
  .addColor(sceneParams.lamps, "color")
  .name("lamps color")
  .onChange((value: THREE.Color) => {
    streetLightLampMaterial.emissive.set(value);
  });
lampsTweaks
  .add(sceneParams.lamps, "intensity")
  .name("lamp color intensity")
  .onChange((value: number) => {
    streetLightLampMaterial.emissiveIntensity = value;
  });

// grass
const grass = createGrass(textureLoader);

// chair
const chair = createChair(textureLoader);

// street
const street = generateStreet(textureLoader);
street.position.z = 3.25;

// street light
const streetLight = new THREE.Group();

const streetLightColor = textureLoader.load("./street_light/color.webp");
streetLightColor.colorSpace = THREE.SRGBColorSpace;
const streetLightARM = textureLoader.load("./street_light/arm.webp");
const streetLightNormal = textureLoader.load("./street_light/normal.webp");

const streetLightTextureRepetition = {
  x: 2,
  y: 2,
};
streetLightColor.repeat.set(
  streetLightTextureRepetition.x,
  streetLightTextureRepetition.y
);
streetLightARM.repeat.set(
  streetLightTextureRepetition.x,
  streetLightTextureRepetition.y
);
streetLightNormal.repeat.set(
  streetLightTextureRepetition.x,
  streetLightTextureRepetition.y
);
streetLightColor.wrapS = THREE.RepeatWrapping;
streetLightARM.wrapS = THREE.RepeatWrapping;
streetLightNormal.wrapS = THREE.RepeatWrapping;
streetLightColor.wrapT = THREE.RepeatWrapping;
streetLightARM.wrapT = THREE.RepeatWrapping;
streetLightNormal.wrapT = THREE.RepeatWrapping;

const streetLightPoleMaterial = new THREE.MeshStandardMaterial({
  map: streetLightColor,
  aoMap: streetLightARM,
  roughnessMap: streetLightARM,
  metalnessMap: streetLightARM,
  normalMap: streetLightNormal,
});
const streetLightLampMaterial = new THREE.MeshStandardMaterial({
  emissive: sceneParams.lamps.color,
  emissiveIntensity: sceneParams.lamps.intensity,
});

interface CylinderGeometryMeasurement {
  radiusTop: number;
  radiusBottom: number;
  radialSegments: number;
  height: number;
}

const streetLightMeasurements: {
  foundation: CylinderGeometryMeasurement;
  base: CylinderGeometryMeasurement;
  pole: CylinderGeometryMeasurement;
  poleCap: Measurement;
  lampBase: CylinderGeometryMeasurement;
  lamp: CylinderGeometryMeasurement;
  lampRoof: {
    base: CylinderGeometryMeasurement;
    peak: CylinderGeometryMeasurement;
    finial: Measurement;
  };
} = {
  foundation: {
    radiusTop: 0.15,
    radiusBottom: 0.2,
    height: 0.1,
    radialSegments: 8,
  },
  base: {
    radiusTop: 0.05,
    radiusBottom: 0.1,
    height: 0.5,
    radialSegments: 8,
  },
  pole: {
    radiusTop: 0.04,
    radiusBottom: 0.04,
    height: 1.5,
    radialSegments: 8,
  },
  poleCap: {
    width: 0.09,
    height: 0.08,
    depth: 0.09,
  },
  lampBase: {
    radiusTop: 0.1,
    radiusBottom: 0.05,
    height: 0.06,
    radialSegments: 6,
  },
  lamp: {
    radiusTop: 0.125,
    radiusBottom: 0.1,
    height: 0.235,
    radialSegments: 6,
  },
  lampRoof: {
    base: {
      radiusTop: 0.125,
      radiusBottom: 0.165,
      height: 0.0425,
      radialSegments: 8,
    },
    peak: {
      radiusTop: 0.01,
      radiusBottom: 0.1,
      height: 0.165,
      radialSegments: 6,
    },
    finial: {
      width: 0.035,
      height: 0.035,
      depth: 0.035,
    },
  },
};

// street light foundation
const streetLightFoundation = new THREE.Mesh(
  new THREE.CylinderGeometry(
    streetLightMeasurements.foundation.radiusTop,
    streetLightMeasurements.foundation.radiusBottom,
    streetLightMeasurements.foundation.height,
    streetLightMeasurements.foundation.radialSegments
  ),
  streetLightPoleMaterial
);
streetLightFoundation.position.y =
  streetLightMeasurements.foundation.height / 2;

// street light base
const streetLightBase = new THREE.Mesh(
  new THREE.CylinderGeometry(
    streetLightMeasurements.base.radiusTop,
    streetLightMeasurements.base.radiusBottom,
    streetLightMeasurements.base.height,
    streetLightMeasurements.base.radialSegments
  ),
  streetLightPoleMaterial
);
streetLightBase.position.y =
  streetLightMeasurements.base.height / 2 +
  streetLightMeasurements.foundation.height;

// street light pole
const streetLightPole = new THREE.Mesh(
  new THREE.CylinderGeometry(
    streetLightMeasurements.pole.radiusTop,
    streetLightMeasurements.pole.radiusBottom,
    streetLightMeasurements.pole.height,
    streetLightMeasurements.pole.radialSegments
  ),
  streetLightPoleMaterial
);
streetLightPole.position.y =
  streetLightMeasurements.pole.height / 2 +
  streetLightMeasurements.foundation.height +
  streetLightMeasurements.base.height;

// street light pole cap
const streetLightPoleCap = new THREE.Mesh(
  new THREE.BoxGeometry(
    streetLightMeasurements.poleCap.width,
    streetLightMeasurements.poleCap.height,
    streetLightMeasurements.poleCap.depth
  ),
  streetLightPoleMaterial
);
streetLightPoleCap.position.y =
  streetLightMeasurements.poleCap.height / 2 +
  streetLightPole.position.y +
  streetLightMeasurements.pole.height / 2;

// street light lamp base
const streetLightLampBase = new THREE.Mesh(
  new THREE.CylinderGeometry(
    streetLightMeasurements.lampBase.radiusTop,
    streetLightMeasurements.lampBase.radiusBottom,
    streetLightMeasurements.lampBase.height,
    streetLightMeasurements.lampBase.radialSegments
  ),
  streetLightPoleMaterial
);
streetLightLampBase.position.y =
  streetLightMeasurements.lampBase.height / 2 +
  streetLightPoleCap.position.y +
  streetLightMeasurements.poleCap.height / 2;

// street light lamp
const streetLightLamp = new THREE.Mesh(
  new THREE.CylinderGeometry(
    streetLightMeasurements.lamp.radiusTop,
    streetLightMeasurements.lamp.radiusBottom,
    streetLightMeasurements.lamp.height,
    streetLightMeasurements.lamp.radialSegments
  ),
  streetLightLampMaterial
);
streetLightLamp.position.y =
  streetLightMeasurements.lamp.height / 2 +
  streetLightLampBase.position.y +
  streetLightMeasurements.lampBase.height / 2;

// street light roof
const streetLightLampRoof = new THREE.Group();
const streetLightLampRoofBase = new THREE.Mesh(
  new THREE.CylinderGeometry(
    streetLightMeasurements.lampRoof.base.radiusTop,
    streetLightMeasurements.lampRoof.base.radiusBottom,
    streetLightMeasurements.lampRoof.base.height,
    streetLightMeasurements.lampRoof.base.radialSegments
  ),
  streetLightPoleMaterial
);
streetLightLampRoofBase.position.y =
  streetLightMeasurements.lampRoof.base.height / 2 +
  streetLightLamp.position.y +
  streetLightMeasurements.lamp.height / 2;

const streetLightLampRoofPeak = new THREE.Mesh(
  new THREE.CylinderGeometry(
    streetLightMeasurements.lampRoof.peak.radiusTop,
    streetLightMeasurements.lampRoof.peak.radiusBottom,
    streetLightMeasurements.lampRoof.peak.height,
    streetLightMeasurements.lampRoof.peak.radialSegments
  ),
  streetLightPoleMaterial
);
streetLightLampRoofPeak.position.y =
  streetLightMeasurements.lampRoof.peak.height / 2 +
  streetLightLampRoofBase.position.y +
  streetLightMeasurements.lampRoof.base.height / 2;

const streetLightLampRoofFinial = new THREE.Mesh(
  new THREE.BoxGeometry(
    streetLightMeasurements.lampRoof.finial.width,
    streetLightMeasurements.lampRoof.finial.height,
    streetLightMeasurements.lampRoof.finial.depth
  ),
  streetLightPoleMaterial
);

streetLightLampRoofFinial.position.y =
  streetLightMeasurements.lampRoof.finial.height / 2 +
  streetLightLampRoofPeak.position.y +
  streetLightMeasurements.lampRoof.peak.height / 2;

streetLightLampRoofFinial.rotation.set(Math.PI / 4, Math.PI / 4, 0);

streetLightLampRoof.add(
  streetLightLampRoofBase,
  streetLightLampRoofPeak,
  streetLightLampRoofFinial
);
streetLightLampRoof.children.forEach((element) => (element.castShadow = true));

const streetLightPointLight = new THREE.PointLight(
  sceneParams.streetLight.color,
  sceneParams.streetLight.intensity,
  sceneParams.streetLight.distance,
  sceneParams.streetLight.decay
);
streetLightPointLight.position.set(
  streetLight.position.x - 0.1,
  streetLightLamp.position.y - 0.25,
  streetLight.position.z + 0.1
);
streetLightPointLight.castShadow = true;
streetLightPointLight.name = "streetLightPointLight";

streetLight.children.forEach((element) => (element.castShadow = true));

streetLight.add(
  streetLightFoundation,
  streetLightBase,
  streetLightPole,
  streetLightPoleCap,
  streetLightLampBase,
  streetLightLamp,
  streetLightLampRoof,
  streetLightPointLight
);

streetLight.position.x = -0.5;
streetLight.position.z = -0.25;

// cloning street lights
const streetLights = new THREE.Group();

const streetLight2 = streetLight.clone();
streetLight2.position.x = 6;

const streetLight3 = streetLight.clone();
streetLight3.position.x = -6;

streetLights.add(streetLight, streetLight2, streetLight3);

streetLights.position.y += streetMeasurements.sidewalk.height;
chair.position.y += streetMeasurements.sidewalk.height;
const streetLights2 = streetLights.clone();
streetLights2.position.z += 7;

const streetLightTweaks = gui.addFolder("Street lights");

streetLightTweaks
  .addColor(sceneParams.streetLight, "color")
  .name("light color")
  .onChange((value: THREE.Color) => {
    const newColor = new THREE.Color(value);

    [...streetLights.children, ...streetLights2.children].forEach(
      (lightGroup) => {
        const pointLight = lightGroup.getObjectByName("streetLightPointLight");
        if (pointLight instanceof THREE.PointLight) {
          pointLight.color.copy(newColor);
        }
      }
    );
  });

streetLightTweaks
  .add(sceneParams.streetLight, "intensity")
  .min(0)
  .max(6)
  .name("intensity")
  .onChange((value: number) => {
    [...streetLights.children, ...streetLights2.children].forEach(
      (lightGroup) => {
        const pointLight = lightGroup.getObjectByName("streetLightPointLight");
        if (pointLight instanceof THREE.PointLight) {
          pointLight.intensity = value;
        }
      }
    );
  });

streetLightTweaks
  .add(sceneParams.streetLight, "distance")
  .min(0)
  .max(15)
  .name("distance")
  .onChange((value: number) => {
    [...streetLights.children, ...streetLights2.children].forEach(
      (lightGroup) => {
        const pointLight = lightGroup.getObjectByName("streetLightPointLight");
        if (pointLight instanceof THREE.PointLight) {
          pointLight.intensity = value;
        }
      }
    );
  });

streetLightTweaks
  .add(sceneParams.streetLight, "decay")
  .min(0)
  .max(25)
  .name("decay")
  .onChange((value: number) => {
    [...streetLights.children, ...streetLights2.children].forEach(
      (lightGroup) => {
        const pointLight = lightGroup.getObjectByName("streetLightPointLight");
        if (pointLight instanceof THREE.PointLight) {
          pointLight.intensity = value;
        }
      }
    );
  });

/* AMBIENT LIGHT */
const ambientLightTweaks = gui.addFolder("Ambient Light");
const ambientLight = new THREE.AmbientLight(
  sceneParams.ambientLight.color,
  sceneParams.ambientLight.intensity
);
ambientLightTweaks.addColor(ambientLight, "color");
ambientLightTweaks.add(ambientLight, "intensity").min(0).max(2).step(0.01);

scene.add(grass, chair, street, streetLights, streetLights2, ambientLight);

/* FIREFLIES */
const firefliesParams = {
  amount: 40,
};

let fireflies = generateRandomFireflies(firefliesParams.amount);
fireflies.position.z = street.position.z;
scene.add(fireflies);

const firefliesTweaks = gui.addFolder("Fireflies");

firefliesTweaks
  .add(firefliesParams, "amount")
  .step(1)
  .onFinishChange((value: number) => {
    disposeGroup(fireflies);
    fireflies = generateRandomFireflies(value);
    scene.add(fireflies);
  });

const disposeGroup = (group: THREE.Group) => {
  group.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.geometry.dispose();

      if (Array.isArray(child.material)) {
        child.material.forEach((material) => material.dispose());
      } else if (child.material) {
        child.material.dispose();
      }
    }
  });
  if (group.parent) {
    group.parent.remove(group);
  }
};

const timer = new Timer();
const animateFireflies = () => {
  requestAnimationFrame(animateFireflies);
  timer.update();

  const elapsedTime = timer.getElapsed();

  fireflies.children.forEach((firefly) => {
    const { phase, speed, radius, direction } = firefly.userData;
    const angle = (elapsedTime * speed + phase) * direction;

    firefly.position.x = Math.cos(angle) * radius;
    firefly.position.z = Math.sin(angle) * radius;
    firefly.position.y =
      Math.sin(angle) * Math.sin(angle * 1.25) * Math.sin(angle * 3) + 1;
  });
};
animateFireflies();
