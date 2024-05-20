### 3D Text

- NB: TextGeometry and FontLoader have been moved out of the core some time ago so you have to import them
- TextGeometry
- need a font called typeface
- convert webfont to typeface - gero3.github.io/facetype.js
- also: node_modules/three/examples/fonts/[typefacefont] : DONT DO THIS!  
   import typefacefont from 'three/examples/fonts/helvetiker_regular.typeface.json'
- drop the font and license into assets folder: static/fonts etc (see what this is for vite)
- use FontLoader to handle loading: https://threejs.org/docs/#examples/en/loaders/FontLoader
- FontLoader uses a callback - loaded font received as prop in callback
- Bounding is the space taken up by the geometry
- Bounding can be box or sphere (default)
- bounding is for frustum culling - to render or not to render - eg. if geometry is within scene

```js
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { FontLoader } from "three/addons/loaders/FontLoader.js";

const fontLoader = new FontLoader();

fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
  console.log("font loaded");
  const textGeometry = new TextGeometry("helloworld", {
    font: font,
    size: 0.5,
    height: 0.2,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 5,
  });
  textGeometry.computeBoundingBox();
  console.log(textGeometry.boundingBox);

  const textMaterial = new THREE.MeshBasicMaterial();
  const text = new THREE.Mesh(textGeometry, textMaterial);
  scene.add(text);
});
```

