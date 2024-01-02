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
