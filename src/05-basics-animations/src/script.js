import gsap from 'gsap'

import * as THREE from "three";

/**
 * Base
 */
//CANVAS
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)


/**
 * Sizes
 */


const sizes = {
  width: 800,
  height: 600
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


//RENDERER
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);

/**
 * Animate
 */
gsap.to(mesh.position, { duration: 1, delay: 1, x: 2 })


const tick = () => {
  

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
