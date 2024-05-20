import * as THREE from "three";

//CANVAS
const canvas = document.querySelector("canvas.webgl");

const sizes = {
  width: 800,
  height: 600,
};

//------------------------------------------------------
//SCENE
const scene = new THREE.Scene();

// Object
const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1, 5, 5, 5),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
)
scene.add(mesh)

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
camera.lookAt(mesh.position)
scene.add(camera);


//RENDERER
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);

// Animate
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    mesh.rotation.y = elapsedTime;

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
