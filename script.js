import * as THREE from 'three';
import gsap from 'gsap';

//CANVAS
const canvas = document.querySelector('canvas.webgl')

//MESH = geometry + material
// const geometry = new THREE.BoxGeometry(1,1,1);
// const material = new THREE.MeshBasicMaterial({color:0xFF0000});
// const mesh = new THREE.Mesh(geometry, material);

//CAMERA 
//1. field of view (degrees) 35-75
//2. aspect ratio (width / height)
const sizes = {
  width: 800,
  height: 600
}
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
//position camera
camera.position.z = 3;

//SCENE
const scene = new THREE.Scene()
// scene.add(mesh);
scene.add(camera);

//RENDERER
const renderer = new THREE.WebGLRenderer({
  canvas: canvas
});
renderer.setSize(sizes.width, sizes.height);

//AXES HELPER
const axesHelper = new THREE.AxesHelper();
scene.add(axesHelper);

const mesh = new THREE.Mesh(
  new THREE.BoxGeometry(1,1,1), 
  new THREE.MeshBasicMaterial({color:0xFF0000})
);
scene.add(mesh);

//---------------------------------------------------------
// let time = Date.now();  //timestamp from 1 January 1970
 
// using Date()
// const tick = ()=>{
//   console.log('tick');
//   const currentTime = Date.now();
//   const deltaTime = currentTime - time;

//   time = currentTime;
//   console.log(deltaTime);

//   mesh.rotation.x += 0.001 * deltaTime; //rotate at same speed regardless of framerate

//   renderer.render(scene, camera);

//   window.requestAnimationFrame(tick);
// }
//---------------------------------------------------------
//using THREE.Clock
// const clock = new THREE.Clock();

// const tick = () => {
//   const elapsedTime = clock.getElapsedTime();
//   mesh.position.x = Math.cos(elapsedTime);
//   mesh.position.y = Math.sin(elapsedTime);

//   renderer.render(scene, camera);

//   window.requestAnimationFrame(tick); 
// };

// tick();
//---------------------------------------------------------
//using GSAP
gsap.to(mesh.position, {x:2, duration:1, delay:1});
gsap.to(mesh.position, {x:0, duration:1, delay:2});

const tick = ()=>{
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
}

tick();
