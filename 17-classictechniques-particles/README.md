# Particles

- SOLUTION to animating particles: the best way to animate particles is to create our own shader.
- you can create stars, smoke, rain, dust, fire etc with particles.
- each particle is composed of a plane (2 triangles) always facing the camera
- creating particles is like creating a mesh:

  1. a geometry
  2. a material
  3. Points instance (instead of a mesh ):

- closer particles seem to obscure particles behind it. gpu is confused

  - use .alphaMap

  fix:

  - use .depthWrite = false (tell webgl not to write in the depth buffer)

  - use .alphaTest = 0.001
  - use .depthTest = false (draws all particles even if there are objects in front of it)
  - blending: THREE.AdditiveBlending (this can effect performance)

- set each particle a different color: particlesGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
- NOTE: base color affects other colors

```js
//geometry
// const particlesGeometry = new THREE.ShereGeometry(1, 32, 32);
const particlesGeometry = new THREE.BufferGeometry();

const count = 500;
const positions = new Float32Array(count * 3); //values of 3 (x,y,z)
const colors = new Float32Array(count * 3);

for (let i = 0; i < count * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 10;
  colors[i] = Math.random();
}

particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3)
);
particlesGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

//material
const particlesMaterials = new THREE.PointsMaterial({
  size: 0.1,
  sizeAttenuation: true, // this will resize the material w.r.t to the distance from the camera
  //   color: "#ff88cc", //affects other colors so comment out
  transparent: true,
  alphaMap: particleTexture,
  // 	/**
  // 	 * properties below are used to remove the transparent pixels
  // 	 */
  // techniques to use
  // alphaTest: 0.001, // this will (remove/not render) the transparent pixels
  // depthTest: false, // this will render the particles on top of the other objects, but depth testing might create bugs if you have other objects in your scene
  depthWrite: false,
  blending: THREE.AdditiveBlending, // this will add the color of the pixel to the color of the pixel below it/already drawn
  vertexColors: true,
});

//points
const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);
```
