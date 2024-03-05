## Textures

- Textures based on images, covering surface of geometries

1. Color texture (Albedo) - color applied to geometry
2. Alpha texture - greyscale image - white visible / black invisible / grey - inbetween alpha
3. height displacement - greyscale image - white, vertices raised / black, vertices sink / perfect grey, still vertex - need subdivision
4. normal - adds details (light) - dont need subdivision
5. ambient occlusion - greyscale - faking shadows
6. metalness - white metalic / black non-metalic - mostly used for reflection
7. roughness - greyscale - white is rough , black is smooth - mostly for light dissipation

- textures are based on PBR (physically based rendering)

### loading textures

#### image path: getting url of the image

- adding assets to static/ folder, direct access to image as if it is in root directory localhost:3000/

#### loading textures with texture loader (easier):

- single texture loader can load multiple textures

```js
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load("/textures/door/color.jpg");
```

#### loading textures image (harder method):

```js
const image = new Image();
const texture = new THREE.Texture(image); //provide image to texture
image.onload = () => {
  texture.needsUpdate = true;
};

image.src = "/textures/door/color.jpg";

const material = new THREE.MeshBasicMaterial({ map: texture });
```

