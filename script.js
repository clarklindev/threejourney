import "./style.css";

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import gsap from "gsap";
//import GUI from "lil-gui";
// const gui = new GUI();

import * as dat from "dat.gui";
const gui = new dat.GUI({ closed: true, width: 400 });
// gui.hide(); //hide gui at start, use 'h' to show

const parameters = {
  color: 0xff0000,
  spin: () => {
    gsap.to(mesh.rotation, { y: (mesh.rotation.y + 10) % 20, duration: 1 });
  },
};

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

//MESH = geometry + material
// const geometry = new THREE.BoxGeometry(1,1,1);
// const material = new THREE.MeshBasicMaterial({color:0xFF0000});
// const mesh = new THREE.Mesh(geometry, material);

//CAMERA
//1. field of view (degrees) 35-75 vertical vision
//2. aspect ratio (width / height)
//3. near - how close camera can see - objects closer than near will not show - nice value to use: 0.1
//4. far - how far camera can see - objects further than far will not show - nice value to use: 100

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
// const aspectRatio = sizes.width/ sizes.height;
// const camera = new THREE.OrthographicCamera(
//   -1 * aspectRatio,
//   1 * aspectRatio,
//   1,
//   -1,
//   0.1,
//   100
// ) //left, right, top, bottom, near, far

//SCENE
const scene = new THREE.Scene();
// scene.add(mesh);
scene.add(camera);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

//RENDERER
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);

//AXES HELPER
const axesHelper = new THREE.AxesHelper();
scene.add(axesHelper);

const geometry = new THREE.BufferGeometry();
/**
 * vertices for n random triangles
 *
 * (50 * 3 * 3): 50 triangles, 3 vertices per triangle, 3 components per vertex (x, y, z)
 */
const count = 50;
const positionsArray = new Float32Array(count * 3 * 3);

for (let i = 0; i < count * 3 * 3; i++) {
  positionsArray[i] = (Math.random() - 0.5) * 4;
}
const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3); //3 values for each vertex
geometry.setAttribute("position", positionsAttribute);

const material = new THREE.MeshBasicMaterial({
  color: parameters.color,
  wireframe: true,
});

const mesh = new THREE.Mesh(geometry, material);

scene.add(mesh);

//position camera
// camera.position.x = 2;
// camera.position.y = 2;
camera.position.z = 2;
camera.lookAt(mesh.position);

gui.add(mesh.position, "y", -3, 3, 0.01); //min , max, precision (step)
gui
  .add(mesh.position, "y")
  .min(-3)
  .max(3)
  .step(0.03) //using function() min , max, precision (step)
  .name("name of prop");
gui.add(mesh, "visible");

gui.add(parameters, "spin");

gui.add(material, "wireframe");

gui.addColor(parameters, "color").onChange(() => {
  //update material
  material.color.set(parameters.color);
});

//---------------------------------------------------------
// let time = Date.now();  //timestamp from 1 January 1970

// // using Date()
// const tick = ()=>{
//   console.log('tick');
//   const currentTime = Date.now();
//   const deltaTime = currentTime - time;

//   time = currentTime;
//   console.log(deltaTime);

//    mesh.rotation.x += 0.001 * deltaTime; //rotate at same speed regardless of framerate

//   renderer.render(scene, camera);

//   window.requestAnimationFrame(tick);
// }
// tick();
//---------------------------------------------------------
//using THREE.Clock
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  // mesh.position.x = Math.cos(elapsedTime);
  // mesh.position.y = Math.sin(elapsedTime);
  // camera.position.x = cursor.x * 3;
  // camera.position.y = cursor.y * 3;

  // camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3;
  // camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3;
  // camera.position.y = cursor.y * 5;

  // camera.lookAt(mesh.position);

  //update controls
  controls.update();

  renderer.render(scene, camera);

  window.requestAnimationFrame(tick);
};

tick();
//---------------------------------------------------------
//using GSAP
// gsap.to(mesh.position, {x:2, duration:1, delay:1});
// gsap.to(mesh.position, {x:0, duration:1, delay:2});

// const tick = ()=>{
//   renderer.render(scene, camera);
//   window.requestAnimationFrame(tick);
// }

// tick();
