import "./style.css";

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { RectAreaLightHelper } from "three/addons/helpers/RectAreaLightHelper.js";

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
  // renderer.shadowMap.enabled = true; //enable shadows
  renderer.shadowMap.type = THREE.PCFSoftShadowMap; //SHADOW algorithm
  renderer.shadowMap.enabled = false;

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
camera.position.y = 1;
camera.position.z = 2;

//SCENE
const scene = new THREE.Scene();
scene.add(camera);

//AXES HELPER
// const axesHelper = new THREE.AxesHelper();
// scene.add(axesHelper);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

//RENDERER
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// renderer.shadowMap.enabled = true; //enable shadows
// renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.shadowMap.enabled = false;

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

//BAKEDSHADOW
const bakedShadow = textureLoader.load('/textures/shadow/bakedShadow.jpg');
//BAKEDSHADOW Alternative
const simpleShadow = textureLoader.load('/textures/shadow/simpleShadow.jpg');

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

const matcapTexture = textureLoader.load("/textures/matcaps/7.png"); //need to set colorSpace (encoded in sRGB)
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
const material = new THREE.MeshStandardMaterial();
// // material.metalness = 0;
material.roughness = 0.7;
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

gui.add(material, "metalness").min(0).max(1).step(0.001);
gui.add(material, "roughness").min(0).max(1).step(0.001);
// gui.add(material, "aoMapIntensity").min(0).max(10).step(0.001);
// gui.add(material, "displacementScale").min(0).max(1).step(0.001);

//sphere
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 64, 64), material);
sphere.castShadow = true;

//cube
// const cube = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.75, 0.75), material);

// //torus
// const torus = new THREE.Mesh(
//   new THREE.TorusGeometry(0.3, 0.2, 64, 128),
//   material
// );
// torus.position.x = 1.5;

//plane
// const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);

const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(5,5), 
  new THREE.MeshBasicMaterial({
    map: bakedShadow
  })
)

plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.5;

plane.receiveShadow = true;

// sphere.castShadow = true;
// plane.castShadow = true;
// torus.castShadow = true;
// plane.receiveShadow = true;
// scene.add(sphere, cube, plane, torus);
scene.add(plane, sphere);

//Shadow alternative
const sphereShadow = new THREE.Mesh(
  new THREE.PlaneGeometry(1.5, 1.5),
  new THREE.MeshBasicMaterial({color:0x000000, transparent:true, alphaMap: simpleShadow})
)
sphereShadow.rotation.x = Math.PI * -0.5;
sphereShadow.position.y = plane.position.y + 0.01;
scene.add(sphereShadow);

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
  // const textGeometry = new TextGeometry("helloworld", {
  //   font: font,
  //   size: 0.5,
  //   height: 0.2,
  //   curveSegments: 4,
  //   bevelEnabled: true,
  //   bevelThickness: 0.03,
  //   bevelSize: 0.02,
  //   bevelOffset: 0,
  //   bevelSegments: 3,
  // });

  // EASY METHOD - centering geometry
  // textGeometry.center();

  // //HARD METHOD - centering geometry + and adjust for bevel
  // console.log(textGeometry.boundingBox);
  // textGeometry.translate(
  //   -(textGeometry.boundingBox.max.x - 0.02) * 0.5,
  //   -(textGeometry.boundingBox.max.y - 0.02) * 0.5,
  //   -(textGeometry.boundingBox.max.z - 0.03) * 0.5
  // );

  // textGeometry.computeBoundingBox();
  // console.log(textGeometry.boundingBox);

  // const textMaterial = new THREE.MeshBasicMaterial();
  // textMaterial.wireframe = true;
  // const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });

  // const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45);

  // console.time("donuts");

  // for (let i = 0; i < 100; i++) {
  //   const donut = new THREE.Mesh(donutGeometry, material);

  //   donut.position.x = (Math.random() - 0.5) * 10;
  //   donut.position.y = (Math.random() - 0.5) * 10;
  //   donut.position.z = (Math.random() - 0.5) * 10;

  //   donut.rotation.x = Math.random() * Math.PI;
  //   donut.rotation.y = Math.random() * Math.PI;
  //   const scale = Math.random();
  //   // donut.scale.x = scale;
  //   // donut.scale.y = scale;
  //   // donut.scale.z = scale;
  //   donut.scale.set(scale, scale, scale);
  //   scene.add(donut);
  // }

  // console.timeEnd("donuts");

  // const text = new THREE.Mesh(textGeometry, material);
  // scene.add(text);
});

//---------------------------------------------------------
//LIGHTING

const ambientLight = new THREE.AmbientLight(); //= new THREE.AmbientLight(0xffffff, 0.5)
ambientLight.color = new THREE.Color(0xffffff);
ambientLight.intensity = 0.3;
scene.add(ambientLight);
gui.add(ambientLight, "intensity").min(0).max(1).step(0.001);

//directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.3);
directionalLight.position.set(2, 2, -1);
gui.add(directionalLight, "intensity").min(0).max(1).step(0.001);
gui.add(directionalLight.position, "x").min(-5).max(5).step(0.001);
gui.add(directionalLight.position, "y").min(-5).max(5).step(0.001);
gui.add(directionalLight.position, "z").min(-5).max(5).step(0.001);
scene.add(directionalLight);

directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.camera.top = 2;
directionalLight.shadow.camera.right = 2;
directionalLight.shadow.camera.bottom = -2;
directionalLight.shadow.camera.left = -2;
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 6;

// directionalLight.shadow.radius = 10; //blur shadow


//light helper
const directionalLightCameraHelper = new THREE.CameraHelper(
  directionalLight.shadow.camera
);

directionalLightCameraHelper.visible = false;//HIDE HELPER
scene.add(directionalLightCameraHelper);

//Hemisphere light
// const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 10);
// scene.add(hemisphereLight);

//point Light
// const pointLight = new THREE.PointLight(0xff9000, 0.5); //color, intensity, distance, decay
// pointLight.position.x = 2;
// pointLight.position.y = 3;
// pointLight.position.z = 4;
// // pointLight.position.set(2, 3, 4);
// scene.add(pointLight);

//RectArea Light
// const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 2, 1, 1); //color, intensity, width, height
// rectAreaLight.position.set(-1.5, 0, 1.5);
// rectAreaLight.lookAt(new THREE.Vector3());
// scene.add(rectAreaLight);

//SPOTLIGHT - SpotLight

//color : Integer,
//intensity : Float,
//distance : Float,
//angle : Radians,
//penumbra : Float, //penumbra is edge fade - ie. blurred edges
//decay : Float
// const spotLight = new THREE.SpotLight(0x78ff00, 1, 6, Math.PI * 0.1, 0.25, 1);

// spotLight.position.set(0, 2, 3);
// scene.add(spotLight);

// spotLight.target.position.x = -0.75;
// scene.add(spotLight.target);

const spotLight = new THREE.SpotLight(0xFFFFFF, 0.3, 20, Math.PI * 0.3);
spotLight.castShadow = true;
spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;
spotLight.shadow.camera.fov = 30;
spotLight.shadow.camera.near = 1;
spotLight.shadow.camera.far = 6;

spotLight.position.set(0,2,2);//move spotlight
scene.add(spotLight);
scene.add(spotLight.target);//invisible object to add to scene *target to add for spotlight

const spotLightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera);
spotLightCameraHelper.visible = false;
scene.add(spotLightCameraHelper);


//PointLight shadow
const pointLight = new THREE.PointLight(0xFFFFFF, 0.3);
pointLight.castShadow = true;
pointLight.shadow.mapSize.width = 1024;
pointLight.shadow.mapSize.height = 1024;
pointLight.shadow.camera.near = 0.1;
pointLight.shadow.camera.far = 5;

pointLight.position.set(-1, 1, 0);
scene.add(pointLight);

const pointLightCameraHelper = new THREE.CameraHelper(pointLight.shadow.camera);
pointLightCameraHelper.visible = false;
scene.add(pointLightCameraHelper);

//---------------------------------------------------------
//LIGHT HELPERS

//HemisphereLightHelper
// const hemisphereLightHelper = new THREE.HemisphereLightHelper(
//   hemisphereLight,
//   0.2
// );
// scene.add(hemisphereLightHelper);

//DirectionalLightHelper
// const directionalLightHelper = new THREE.DirectionalLightHelper(
//   directionalLight,
//   0.2
// );
// scene.add(directionalLightHelper);

// //PointLightHelper
// const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2);
// scene.add(pointLightHelper);

// //SpotLightHelper
// const spotLightHelper = new THREE.SpotLightHelper(spotLight);
// scene.add(spotLightHelper);

// //RectAreaLightHelper
// const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight);
// scene.add(rectAreaLightHelper);

//---------------------------------------------------------
//using THREE.Clock
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  //update the sphere
  sphere.position.x = Math.cos(elapsedTime) * 1.5;
  sphere.position.z = Math.sin(elapsedTime) * 1.5;
  sphere.position.y = Math.abs(Math.sin(elapsedTime * 3));

  //move shadow
  sphereShadow.position.x = sphere.position.x;
  sphereShadow.position.z = sphere.position.z;
  sphereShadow.material.opacity = (1- sphere.position.y) * 0.3;

  // sphere.rotation.y = 0.1 * elapsedTime;
  // plane.rotation.y = 0.1 * elapsedTime;
  // torus.rotation.y = 0.1 * elapsedTime;

  sphere.rotation.x = -0.15 * elapsedTime;
  // plane.rotation.x = -0.15 * elapsedTime;
  // torus.rotation.x = -0.15 * elapsedTime;

  //update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();