# scrollbased animation

- set renderer alpha to true - this sets the renderer background color to transparent
- .setClearAlpha() - value between 0 and 1
- set the html background color

```js
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
});

//renderer.setClearAlpha(1);
```

```css
html {
  background: #1e1a20;
}
```

- meshtoon material requires light (only visible with light)

## Gradient texture

- MeshtoonMaterial - by default one color for part in light, darker color for part in shade.
- you can use texture for more colors: /static/textures/gradients/

- instantiate TextureLoader before instantiating the material and load the texture:
- add texture to material
- the gradient is a small image of 3 pixels,
- instead of choosing one of those 3 pixels according to the light, WEBGL will try merge them.
- to get the effect of MeshtoonMaterial, provide a magFilter: gradientTexture.magFilter = THREE.NearestFilter;
- mesh positions are not affected by resize which makes positioning easier.
- increase objectsDistance until objects are enough far apart.
- in THREEjs - the field of view is vertical

```js
const textureLoader = new THREE.TextureLoader();
const gradientTexture = textureLoader.load("/textures/gradients/3.jpg");
gradientTexture.magFilter = THREE.NearestFilter;

//add texture to material
const material = new THREE.MeshToonMaterial({
  color: parameters.materialColor,
  gradientMap: gradientTexture,
});

const mesh1 = new THREE.Mesh(new THREE.TorusGeometry(1, 0.4, 16, 60), material);
const mesh2 = new THREE.Mesh(new THREE.ConeGeometry(1, 2, 32), material);
const mesh3 = new THREE.Mesh(
  new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
  material
);
scene.add(mesh1, mesh2, mesh3);

const objectsDistance = 4;

mesh1.position.y = -objectsDistance * 0;
mesh2.position.y = -objectsDistance * 1;
mesh3.position.y = -objectsDistance * 2;

//increase distance between objects
mesh1.position.x = 2;
mesh2.position.x = -2;
mesh3.position.x = 2;
```

#### permanent rotation + move camera with scroll

- give more life to the expereince - add permanent rotation to objects
- move camera with scroll
  - get window scroll: window.scrollY
- update scrollY when user is scrolling
- each section has same size as viewport
- scrolling size of one viewport should move to next object
- divide scrollY by the height of the viewport (which is sizes.height)

```js
const sectionMeshes = [mesh1, mesh2, mesh3];

const tick = () => {
  // Animate Meshes
  for (const mesh of sectionMeshes) {
    mesh.rotation.x += deltaTime * 0.1;
    mesh.rotation.y += deltaTime * 0.12;
  }
};

//scroll
let scrollY = window.scrollY;

camera.position.y = -scrollY / sizes.height;

window.addEventListener("scroll", () => {
  scrollY = -window.scrollY;
});
```

## Parralax

- Parralax is the action of seeing one object through different observation points.
- is is done naturally by our eyes and its how we feel the depth of things.
- apply the parralax effect by making the camera move horizontally and vertically according to mouse movements (cursor).
- the values we get from mouseevent - 'mousemove' should be adapted to fit the context.
- at this point the amplitude depends on this size of the viewport and users with different screen resolutions will have different results.
- to create the same experience for every user
  - we normalize the value (from 0 to 1) by dividing them by the size of the viewport.
  - make value go from -0.5 to 0.5 (make centerpoint at center) add 0.5 on x and y.
- we use this value to move the camera
- but at this point mouse movement and objects are inverted AND camera scroll doesnt work anymore.
- the problem is we are setting the value for camera.position.y twice.
  - once to move the camera up and down based on scroll position
  - and once for parallax effect.
- to fix: put camera in a group then apply parallax effect on the group and not the camera itself.
- in tick(), apply parallaxX, and parallaxY position to cameraGroup.
- create depth by adding particles

```js
// Group
const cameraGroup = new THREE.Group();
scene.add(cameraGroup);
// scene.add(camera);
cameraGroup.add(camera); //update by adding to camera group

// /**
//  * Cursor
//  */
const cursor = {
  x: 0,
  y: 0,
};

window.addEventListener("mousemove", (e) => {
  // 	/**
  // 	 * x, y ~ -0.5, 0.5
  // 	 */
  cursor.x = e.clientX / sizes.width - 0.5;
  cursor.y = e.clientY / sizes.height - 0.5;
});

const tick = () => {
  const parallaxX = cursor.x * 0.5;
  const parallaxY = -cursor.y * 0.5;
  camera.position.y = (-scrollY / sizes.height) * objectsDistance; //move the camera up and down based on the scroll position

  /**
   * to achive parallax effect as well as scrolling effect, we need to add the camera to a group and then set position of the group
   */
  // camera.position.x = parallaxX;
  // camera.position.y = parallaxY;
  cameraGroup.position.x = parallaxX;
  cameraGroup.position.y = parallaxY;
};
```

## Easing / lerping / smoothing animation

- on each frame, instead of moving the camera straight to the target, we move it (slight closer eg. a tenth), then on next frame, another 10th etc.
- then the closer we are the smaller the move - because as the distance decreases, so does the value of a 1/10 of the distance.
- adjust how we set camera group position with +=
- we need to calculate distance between updated position To destination (parallaxX, parallaxY)
- DELTA time - we also need to use delta time (time between each frame) - makes same experience for people with hight refresh rates or fps
- create previousTime variable
- at the beginning of the tick function, after setting elapsedTime, calculate the deltaTime by subtracting the previousTime from the elapsedTime
- deltaTime is in seconds - the value will be small. around 0.016 (RUNNING at 60fps)
- we can convert to larger value like 5
- now we have same animation speed (frame rate)

```js
let clock = new THREE.Clock();
let previousTime = 0;


const tick = () => {
  onst c = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime; //calc time difference
  previousTime = elapsedTime;  //update previous time for next frame

  camera.position.y = -scrollY / sizes.height * objectsDistance;

  const parallaxX = cursor.x * 0.5;
  const parallaxY = - cursor.y * 0.5;

  cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 5 * deltaTime;
  cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 5 * deltaTime;
}
```

## particles

- creating very simple square particles and spread them around the scene.
- positioning particles ourselves, we need a BufferGeometry (particles + galaxy generator lesson).
- create a particlesCount variable and a positions variable using a Float32Array
- create a loop and add random coordinates to the positions array
- instantiate the BufferGeometry and set the position attribute.
- create the material using PointsMaterial
- create the particles using Points
  - for the x (horizontal) and z (depth), can use random values that can be positive and negative.
  - for the y (vertical) we need to make the particles start high enough and then spread far enough below so that we reach the end with the scroll (use objects distance multiply by sections length)
- can change the color of particles in the change event

```js
//can change the color of particles in the change event
gui.addColor(parameters, "materialColor").onChange(() => {
  material.color.set(parameters.materialColor);
  particlesMaterial.color.set(parameters.materialColor);
});

//create a particlesCount variable and a positions variable using a Float32Array
const particlesCount = 200;
const positions = new Float32Array(particlesCount * 3); //this is how we store particle positions in Float32Array (x,y,z)

//create a loop and add random coordinates to the positions array
for (let i = 0; i < particlesCount; i++) {
  //fill array

  //x position of particle
  positions[i * 3 + 0] = (Math.random() - 0.5) * 10;

  //y position of particle
  positions[i * 3 + 1] =
    objectsDistance * 0.5 -
    Math.random() * objectsDistance * sectionMeshes.length;

  //z position of particle
  positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
}

//instantiate the BufferGeometry and set the position attribute.
const particlesGeometry = new THREE.BufferGeometry();

//provide array to BufferGeometry
particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3)
); //@props: the Float32Array, 3 is how many values per vertex\

// Material
const particlesMaterial = new THREE.PointsMaterial({
  color: parameters.materialColor,
  size: 0.03,
  sizeAttenuation: true,
});

//Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);
```

## Triggered rotation

- animation when arriving on section - make the objects do a little spin when arriving at corresponding section in addition to the permanent rotation.

1. need to know when we reach a section
2. we can use the scrollY value and do some calculations to check if we have changed sections.
3. in the scroll event callback function, calculate the current section by dividing the scrollY by sizes.height.
4. this works because each section is exactly the height of the viewport
5. test if newSection is different from currentSection
6. spin with GSAP: `import gsap from 'gsap';`
7. code doesnt work because tick() is updating mesh.rotation.x and mesh.rotation.y on each frame already...
8. fix: in tick(), instead of setting a specific rotation based on elapsedTime, add a deltaTime to current rotation

```js
import gsap from "gsap";

let currentSection = 0;

window.addEventListener("scroll", () => {
  scrollY = window.scrollY;

  const newSection = Math.floor(scrollY / sizes.height); //get section

  if (newSection !== currentSection) {
    currentSection = newSection;

    gsap.to(sectionMeshes[currentSection].rotation, {
      duration: 1.5,
      ease: "power2.inOut",
      x: "+=6",
      y: "+=3",
      z: "+=1.5",
    });
  }
});

const tick = () => {
  // Animate Meshes
  // for (const mesh of sectionMeshes) {
  // 	mesh.rotation.x = elapsedTime * 0.1;
  // 	mesh.rotation.y = elapsedTime * 0.12;
  // }

  // Animate Meshes - with delta
  for (const mesh of sectionMeshes) {
    mesh.rotation.x += deltaTime * 0.1;
    mesh.rotation.y += deltaTime * 0.12;
  }
};
```
