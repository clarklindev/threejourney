import "./style.css";

import * as THREE from "three";

//CANVAS
const canvas = document.querySelector("canvas.webgl");

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};


//mesh = geometry + material
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const mesh = new THREE.Mesh(geometry, material);

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
camera.position.x = 2;
camera.position.y = 1;
camera.position.z = 4;

//SCENE
const scene = new THREE.Scene();
scene.add(camera);
scene.add(mesh);


//RENDERER
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);
