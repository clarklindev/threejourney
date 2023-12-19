import * as THREE from 'three';

//CANVAS
const canvas = document.querySelector('canvas.webgl')

//MESH = geometry + material
const geometry = new THREE.BoxGeometry(1,1,1);
const material = new THREE.MeshBasicMaterial({color:0xFF0000});
const mesh = new THREE.Mesh(geometry, material);

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
scene.add(mesh);
scene.add(camera);

//RENDERER
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});
renderer.setSize(sizes.width, sizes.height);

//AXES HELPER
const axesHelper = new THREE.AxesHelper();
scene.add(axesHelper);

//---------------------------------------------------------
//FUNCTIONS

// note you can use Vector3 class for this...
// mesh.position.x = 0.7;
// mesh.position.y = -0.6;
// mesh.position.z = 1;

console.log(mesh.position.length()); //CALC: distance between center of scene and object

//set()
mesh.position.set(0.7, -0.6, 1);
mesh.scale.set(2, 0.5, 0.5);

console.log(mesh.position.distanceTo(camera.position)); //CALC: distance between camera and mesh
//mesh.position.normalize(); //takes vector length and reduces its value till its 1.
mesh.position.normalize(camera.position);

//---------------------------------------------------------

renderer.render(scene, camera);