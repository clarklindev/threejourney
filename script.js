import * as THREE from 'three';

//canvas
const canvas = document.querySelector('canvas.webgl')

//mesh = geometry + material
const geometry = new THREE.BoxGeometry(1,1,1);
const material = new THREE.MeshBasicMaterial({color:0xFF0000});
const mesh = new THREE.Mesh(geometry, material);

//camera 
//1. field of view (degrees) 35-75
//2. aspect ratio (width / height)
const sizes = {
    width: 800,
    height: 600
}
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
//position camera
camera.position.z = 3;

//scene
const scene = new THREE.Scene()
scene.add(mesh);
scene.add(camera);

//renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);