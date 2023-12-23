import "./style.css";

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { FontLoader } from "three/addons/loaders/FontLoader.js";

//DEBUG
const gui = new dat.GUI();

//CANVAS
const canvas = document.querySelector("canvas.webgl");

//cursor
const cursor = {
  x: 0,
  y: 0,
};

window.addEventListener("mousemove", (event) => {
  cursor.x = event.clientX / sizes.width - 0.5;
  cursor.y = -(event.clientY / sizes.height - 0.5);
});

window.addEventListener("resize", () => {
  //update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  //update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix(); //need to tell three.js to update projection matrix

  //update renderer
  renderer.setSize(sizes.width, sizes.height);
  // renderer.setPixelRatio(window.devicePixelRatio); //set same pixel ratio as system
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

window.addEventListener("dblclick", () => {
  const fullscreenElement =
    document.fullscreenElement | document.webkitFullscreenElement;

  if (!fullscreenElement) {
    if (canvas.requestFullscreen) {
      canvas.requestFullscreen();
    } else if (canvas.webkitRequestFullscreen) {
      canvas.webkitRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
});

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

//------------------------------------------------------

//CAMERA
//1. field of view (degrees) 35-75 vertical vision
//2. aspect ratio (width / height)
//3. near - how close camera can see - objects closer than near will not show - nice value to use: 0.1
//4. far - how far camera can see - objects further than far will not show - nice value to use: 100

const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 1;
camera.position.y = 0;
camera.position.z = 3;

//SCENE
const scene = new THREE.Scene();
scene.add(camera);

//AXES HELPER
const axesHelper = new THREE.AxesHelper();
scene.add(axesHelper);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

//RENDERER
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);

const loadingManager = new THREE.LoadingManager();
loadingManager.onStart = () => {
  console.log("onStart");
};

loadingManager.onLoaded = () => {
  console.log("onLoaded");
};

loadingManager.onProgress = () => {
  console.log("onProgress");
};

//-----------------------------------------------------------

//MESH = GEOMETRY + MATERIAL (TEXTURE or color)

//TEXTURE
const textureLoader = new THREE.TextureLoader(loadingManager);
const cubeTextureLoader = new THREE.CubeTextureLoader();

const doorColorTexture = textureLoader.load("/textures/door/color.jpg"); //need to set colorSpace (encoded in sRGB)
const doorAlphaTexture = textureLoader.load("/textures/door/alpha.jpg");
const doorHeightTexture = textureLoader.load("/textures/door/height.jpg");
const doorNormalTexture = textureLoader.load("/textures/door/normal.jpg");
const doorAmbientOcclusionTexture = textureLoader.load(
  "/textures/door/ambientOcclusion.jpg"
);
const doorMetalnessTexture = textureLoader.load("/textures/door/metalness.jpg");
const doorRoughnessTexture = textureLoader.load("/textures/door/roughness.jpg");

const matcapTexture = textureLoader.load("/textures/matcaps/8.png"); //need to set colorSpace (encoded in sRGB)
const gradientTexture = textureLoader.load("/textures/gradients/5.jpg");
gradientTexture.minFilter = THREE.NearestFilter;
gradientTexture.magFilter = THREE.NearestFilter;
gradientTexture.generateMipmaps = false;

doorColorTexture.colorSpace = THREE.SRGBColorSpace;
matcapTexture.colorSpace = THREE.SRGBColorSpace;

//loads front,back,left, right,top,bottom - order important
// const environmentMapTexture = cubeTextureLoader.load([
//   "/textures/environmentMaps/3/px.jpg",
//   "/textures/environmentMaps/3/nx.jpg",
//   "/textures/environmentMaps/3/py.jpg",
//   "/textures/environmentMaps/3/ny.jpg",
//   "/textures/environmentMaps/3/pz.jpg",
//   "/textures/environmentMaps/3/nz.jpg",
// ]);

//MATERIAL

// BASIC MATERIAL
// const material = new THREE.MeshBasicMaterial({ map: doorColorTexture });
// material.map = doorColorTexture; //alternative method
// material.color.set("purple"); //alternative method
// material.color = new THREE.Color("#00FF00"); //alternative method
// material.wireframe = true;
// material.opacity = 0.3;
// material.transparent = true; //when working with opacity, need to set transparent to true
// material.alphaMap = doorAlphaTexture;
// material.side = THREE.FrontSide; //THREE.FrontSide, THREE.BackSide, THREE.DoubleSide

//NORMAL MATERIAL (reflection, lighting, refraction)
// const material = new THREE.MeshNormalMaterial();
// material.flatShading = true; //makes things have rigid shape (flat shapes)

//MESHMATCAP MATERIAL
// const material = new THREE.MeshMatcapMaterial();
// material.matcap = matcapTexture;

//MESHDEPTH MATERIAL
// const material = new THREE.MeshDepthMaterial();

//MESHLAMBERT MATERIAL
// const material = new THREE.MeshLambertMaterial();

//MESHPHONG MATERIAL
// const material = new THREE.MeshPhongMaterial({ color: 0xffffff });
// material.shininess = 100;
// material.specular = new THREE.Color(0x1188ff); //change color of reflection

//MESHTOON Material
// const material = new THREE.MeshToonMaterial();
// material.gradientMap = gradientTexture;

//MESHSTANDARD Material / ambient occlusion
// const material = new THREE.MeshStandardMaterial();
// // material.metalness = 0;
// // material.roughness = 1;
// // material.map = doorColorTexture;
// // material.aoMap = doorAmbientOcclusionTexture;
// // material.aoMapIntensity = 1;
// // material.displacementMap = doorHeightTexture;
// // material.displacementScale = 0.05;
// // material.metalnessMap = doorMetalnessTexture;
// // material.roughnessMap = doorRoughnessTexture;
// // material.normalMap = doorNormalTexture;
// // material.normalScale.set(1.5, 1.5);
// // material.transparent = true;
// // material.alphaMap = doorAlphaTexture;

// material.metalness = 0.7;
// material.roughness = 0.2;
// material.envMap = environmentMapTexture;

// gui.add(material, "metalness").min(0).max(1).step(0.0001);
// gui.add(material, "roughness").min(0).max(1).step(0.0001);
// gui.add(material, "aoMapIntensity").min(0).max(10).step(0.001);
// gui.add(material, "displacementScale").min(0).max(1).step(0.001);

// //sphere
// const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 64, 64), material);
// sphere.position.x = -1.5;

// //plane
// const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 100, 100), material);

// //torus
// const torus = new THREE.Mesh(
//   new THREE.TorusGeometry(0.3, 0.2, 64, 128),
//   material
// );
// torus.position.x = 1.5;

// sphere.castShadow = true;
// plane.castShadow = true;
// torus.castShadow = true;
// plane.receiveShadow = true;
// scene.add(sphere, plane, torus);

// sphere.geometry.setAttribute(
//   "uv2",
//   new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2)
// );

// plane.geometry.setAttribute(
//   "uv2",
//   new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2)
// );

// torus.geometry.setAttribute(
//   "uv2",
//   new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2)
// );

//FONTS
const fontLoader = new FontLoader();

fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
  console.log("font loaded");
  const textGeometry = new TextGeometry("helloworld", {
    font: font,
    size: 0.5,
    height: 0.2,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 5,
  });

  const textMaterial = new THREE.MeshBasicMaterial();
  const text = new THREE.Mesh(textGeometry, textMaterial);
  scene.add(text);
});

//---------------------------------------------------------
//LIGHTING

const ambientLight = new THREE.AmbientLight("#fff", 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight("#fff", 0.5);
pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.x = 4;
// pointLight.position.set(2, 3, 4);
scene.add(pointLight);

//---------------------------------------------------------
//using THREE.Clock
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // sphere.rotation.y = 0.1 * elapsedTime;
  // plane.rotation.y = 0.1 * elapsedTime;
  // torus.rotation.y = 0.1 * elapsedTime;

  // sphere.rotation.x = -0.15 * elapsedTime;
  // plane.rotation.x = -0.15 * elapsedTime;
  // torus.rotation.x = -0.15 * elapsedTime;

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
