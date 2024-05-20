import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import Stats from "stats.js";
// import {BufferGeometryUtils} from "three/examples/jsm/utils/BufferGeometryUtils.js"; //CANT IMPORT LIKE THIS AS THERE IS NO EXPORTED CLASS
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils.js";
/**
 * Stats
 */
const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const displacementTexture = textureLoader.load("/textures/displacementMap.png");

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(2, 2, 6);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  powerPreference: "high-performance",    //hint power required - remove if not required
  antialias: true,
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Test meshes
 */
// const cube = new THREE.Mesh(
//   new THREE.BoxGeometry(2, 2, 2),
//   new THREE.MeshStandardMaterial()
// );
// cube.castShadow = true;
// cube.receiveShadow = true;
// cube.position.set(-5, 0, 0);
// scene.add(cube);

// const torusKnot = new THREE.Mesh(
//   new THREE.TorusKnotGeometry(1, 0.4, 128, 32),
//   new THREE.MeshStandardMaterial()
// );
// torusKnot.castShadow = true;
// torusKnot.receiveShadow = true;
// scene.add(torusKnot);

// const sphere = new THREE.Mesh(
//   new THREE.SphereGeometry(1, 32, 32),
//   new THREE.MeshStandardMaterial()
// );
// sphere.position.set(5, 0, 0);
// sphere.castShadow = true;
// sphere.receiveShadow = true;
// scene.add(sphere);

// const floor = new THREE.Mesh(
//   new THREE.PlaneGeometry(10, 10),
//   new THREE.MeshStandardMaterial()
// );
// floor.position.set(0, -2, 0);
// floor.rotation.x = -Math.PI * 0.5;
// floor.castShadow = true;
// floor.receiveShadow = true;
// scene.add(floor);

// /**
//  * Lights
//  */
// const directionalLight = new THREE.DirectionalLight("#ffffff", 1);
// directionalLight.castShadow = true;
// directionalLight.shadow.mapSize.set(1024, 1024);
// directionalLight.shadow.camera.far = 15;
// directionalLight.shadow.normalBias = 0.05;
// directionalLight.position.set(0.25, 3, 2.25);
// scene.add(directionalLight);

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  stats.begin();

  const elapsedTime = clock.getElapsedTime();

  // Update test mesh
  // torusKnot.rotation.y = elapsedTime * 0.1;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);

  stats.end();
};

tick();

/**
 * Tips
 */

// // Tip 4
console.log(renderer.info);

// // Tip 6
// scene.remove(cube);
// cube.geometry.dispose();
// cube.material.dispose();

// // Tip 10
// directionalLight.shadow.camera.top = 3;
// directionalLight.shadow.camera.right = 6;
// directionalLight.shadow.camera.left = -6;
// directionalLight.shadow.camera.bottom = -3;
// directionalLight.shadow.camera.far = 10;
// directionalLight.shadow.mapSize.set(1024, 1024); //optimize map size

// const cameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
// scene.add(cameraHelper);

// // Tip 11 - use castShadow and receiveShadow wisely
// cube.castShadow = true;
// cube.receiveShadow = false;

// torusKnot.castShadow = true;
// torusKnot.receiveShadow = false;

// sphere.castShadow = true;
// sphere.receiveShadow = false;

// floor.castShadow = false;
// floor.receiveShadow = true;

// // Tip 12 - deactivate shadow auto-update - eg if object is still (not moving)
//shadow maps get updated before each render - we can deactivate this auto-update and alert Three.js that shadow maps needs update only when necessary
// renderer.shadowMap.autoUpdate = false;
// renderer.shadowMap.needsUpdate = true; //ensure first render

//Tip 13
//Textures take a lot of space in the GPU memory especially with the mipmaps.
//The texture file weight has nothing to do with that, and only the resolution matters
//try reduce the resolution to the minimum while keeping a decent result.
//keep a power of 2 resolution - not neccesary to be square
//use the right file format jpg vs png
//TinyPNG optimize images

//16 use buffer geometries
//DEPRECATED - only normal geometries since threejs update

//17 do not update vertices
//updating vertices is bad for performance
//if you need to animate the vertices do it with a vertex shader

// // Tip 18 mutualize geometries (shared geometries - outside function)
// const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);

// const material = new THREE.MeshNormalMaterial();
// for (let i = 0; i < 50; i++) {
//   const mesh = new THREE.Mesh(geometry, material);
//   mesh.position.x = (Math.random() - 0.5) * 10;
//   mesh.position.y = (Math.random() - 0.5) * 10;
//   mesh.position.z = (Math.random() - 0.5) * 10;
//   mesh.rotation.x = (Math.random() - 0.5) * Math.PI * 2;
//   mesh.rotation.y = (Math.random() - 0.5) * Math.PI * 2;

//   scene.add(mesh);
// }

// // Tip 19 - merge geometries - draw same amount of triangles in one draw call (reduce the draw calls)
//merge non-moving geometries with BufferGeometryUtils
//first import BufferGeometryUtils: import { BufferGeometryUtils } from "three/examples/jsm/utils/BufferGeometryUtils.js";
//use one array to hold 50 geometries - and call mergeGeometries to create one objec
// const geometries = [];

// for (let i = 0; i < 50; i++) {
//   const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);

//   geometry.rotateX((Math.random() - 0.5) * Math.PI * 2);
//   geometry.rotateY((Math.random() - 0.5) * Math.PI * 2);

//   geometry.translate(
//     (Math.random() - 0.5) * 10,
//     (Math.random() - 0.5) * 10,
//     (Math.random() - 0.5) * 10
//   );

//   geometries.push(geometry);
// }

// const mergedGeometry = BufferGeometryUtils.mergeGeometries(geometries); //merge non-moving geometries: DEPRECATED mergeBufferGeometries use mergeGeometries
// const material = new THREE.MeshNormalMaterial();
// const mesh = new THREE.Mesh(mergedGeometry, material);
// scene.add(mesh);

// // Tip 20 - mutualize materials - use shared materials
//if you are using the same type of material for multiple meshses , create only one and use it multiple times

// const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
// const material = new THREE.MeshNormalMaterial();

// for (let i = 0; i < 50; i++) {
//   const mesh = new THREE.Mesh(geometry, material);
//   mesh.position.x = (Math.random() - 0.5) * 10;
//   mesh.position.y = (Math.random() - 0.5) * 10;
//   mesh.position.z = (Math.random() - 0.5) * 10;
//   mesh.rotation.x = (Math.random() - 0.5) * Math.PI * 2;
//   mesh.rotation.y = (Math.random() - 0.5) * Math.PI * 2;

//   scene.add(mesh);
// }

//TIP 21
//use cheap materials - MeshBasicMaterial, MeshLambertMaterial, MeshPhongMaterial
//heavier materials - MeshStandardMaterial, MeshPhysicalMaterial
//try use cheapest materials

// Tip 22 - use InstancedMesh - after merging, cannot move individual cube so to fix:

// - create one InstancedMesh
// - but create a transformation matrix for each "instance" of that mesh.
// matrix has to be Matrix4, can apply any transformation by using the various available methods.
// if you intend to change these matrices in the tick function, add this to the instancedMesh: mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage); 

// const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5)
// const material = new THREE.MeshNormalMaterial();

// const mesh = new THREE.InstancedMesh(geometry, material, 50); //create instanced mesh with how many instances to add

// mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage); //changing matrix? include this...
// scene.add(mesh);

// for (let i = 0; i < 50; i++) {
//   const position = new THREE.Vector3(
//     (Math.random() - 0.5) * 10,
//     (Math.random() - 0.5) * 10,
//     (Math.random() - 0.5) * 10
//   );

//   const quaternion = new THREE.Quaternion();
//   quaternion.setFromEuler(
//     new THREE.Euler(
//       (Math.random() - 0.5) * Math.PI * 2,
//       (Math.random() - 0.5) * Math.PI * 2,
//       0
//     )
//   );

//   const matrix = new THREE.Matrix4();               //create transformation Matrix for each instance
//   matrix.makeRotationFromQuaternion(quaternion);
//   matrix.setPosition(position);
//   mesh.setMatrixAt(i, matrix);
// } 
//tip 23 - MODELS - use low poly models
//few polygons, better
//details - use normal maps

//tip24 - DRACO COMPRESSION
//loading Draco libraries - files are compressed

//tip25 - Gzip
//use gzip, compression on server side - content-encoding: gzip

//Tip26 - field of view
//objects not in field of view wont be rendered - fustrum culling
//so just reduce the cameras field of view

//tip27 - near and far
//can also reduce near and far proprties of the camera

// // Tip 29
// renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)) //correct method to set pixel ratio with max at 2

// Tip 31 Anti-alias
//the default anti-alias is performant, but less performant than no anti-alias , only add if you have visible aliasing and no performance issues

//32 post processing - limit passes
//if you have 1920x1080 resolution with (4 passes) and a pixel ratio of 2, that makes:
//1920 x 2 * 1080 * 2 * 4 = 33 177 600 pixels to render
//try regroup your passes into one.

//33 - shaders - specify the shader precision
// you can force the precision of the shaders in the materials by changing their precision property
//  precision: "lowp",
//keep code simple 
  //use clamp() , max() without if()
  //use "mix" to optimize code


const shaderGeometry = new THREE.PlaneGeometry(10, 10, 256, 256);

const shaderMaterial = new THREE.ShaderMaterial({
  precision: "lowp",
  uniforms: {
    uDisplacementTexture: { value: displacementTexture },
  },
  defines: {
    DISPLACMENT_STRENGH: 1.5,
  },
  vertexShader: `
        uniform sampler2D uDisplacementTexture;
        uniform float uDisplacementStrength;

        varying vec3 vColor;    //sending vColor

        void main()
        {
            // Position
            vec4 modelPosition = modelMatrix * vec4(position, 1.0);
            float elevation = texture2D(uDisplacementTexture, uv).r;
            modelPosition.y += max(elevation, 0.5) * DISPLACMENT_STRENGH;
            gl_Position = projectionMatrix * viewMatrix * modelPosition;

            //color 
            float colorElevation = max(elevation, 0.25);
            // vec3 depthColor = vec3(1.0, 0.1, 0.1);
            // vec3 surfaceColor = vec3(0.1, 0.0, 0.5);
            //replace with mix
            // vec3 finalColor = vec3(0.0);
            // finalColor.r += depthColor.r + (surfaceColor.r - depthColor.r) * elevation;
            // finalColor.g += depthColor.g + (surfaceColor.g - depthColor.g) * elevation;
            // finalColor.b += depthColor.b + (surfaceColor.b - depthColor.b) * elevation;
            vec3 color = mix(vec3(1.0, 0.1, 0.1), vec3(0.1, 0.0, 0.5), elevation); //pick between 2 color depending on elevation

            //varying
            vColor = color;

        }
    `,
  fragmentShader: `
        varying vec3 vColor;    //receiving vColor

        void main()
        {
          gl_FragColor = vec4(vColor, 1.0);
        }
    `,
});

const shaderMesh = new THREE.Mesh(shaderGeometry, shaderMaterial);
shaderMesh.rotation.x = -Math.PI * 0.5;
scene.add(shaderMesh);

// instead of perlin noise function, can maybe get better performance with textures

// uniforms - beneficial because they can be tweaked with DAT.ui
