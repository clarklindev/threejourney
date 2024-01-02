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

```js
const textureLoader = new THREE.TextureLoader();
const gradientTexture = textureLoader.load("/textures/gradients/3.jpg");
gradientTexture.magFilter = THREE.NearestFilter;

//add texture to material
const material = new THREE.MeshToonMaterial({
  color: parameters.materialColor,
  gradientMap: gradientTexture,
});
```
