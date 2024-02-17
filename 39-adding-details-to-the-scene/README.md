# Adding details to the scene

- add fireflies
- change shader in the portal

### Background color
- ability to set background to an uniform color (tweak using dat.ui)
- create a debug object
- add a clearColor
- add to Dat.GUI with gui.addColor()
- use it with the renderer.setClearColor() method
- call the renderer.setClearColor() when change occurs
```js

const debugObject = {};

cibst gui = new dat.GUI({
  width: 400
});

debugObject.clearColor = "#431e43";
renderer.setClearColor(debugObject.clearColor);

gui.addColor(debugObject, "clearColor").onChange(() => {
  renderer.setClearColor(debugObject.clearColor); //setClearColor() is a three.js function 
});

```

### Fireflies
- use particles to create fireflies
- create an empty BufferGeometry 
- create a BufferAttribute named "position" and add random positions  //threejs expects "position"
- send the array as BufferAttribute, specify how many values per vertex
- we are going to use a PointsMaterial and change it later to a custom ShaderMaterial
- create a PointsMaterial with size of 0.1 and set the sizeAttenuation to true
- create the Points (fireflies)
- improve the positions

```js
const firefliesGeometry = new THREE.BufferGeometry();

const firefliesCount = 30;
const positionArray = new Float32Array(firefliesCount * 3);

for (let i = 0; i < firefliesCount; i++) {
  positionArray[i * 3 + 0] = Math.random() * 4
  positionArray[i * 3 + 1] = Math.random() * 4 
  positionArray[i * 3 + 2] = Math.random() * 4

  // improve the positions
  positionArray[i * 3 + 0] = (Math.random() - 0.5) * 4; //x4 because scene is 4 units large
  positionArray[i * 3 + 1] = Math.random() * 1.5;
  positionArray[i * 3 + 2] = (Math.random() - 0.5) * 4;
}

firefliesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positionArray, 3) //send the array as BufferAttribute, specify how many values per vertex
);

//material
const firefliesMaterial = new THREE.PointsMaterial({size: 0.1, sizeAttenuation: true});

const fireflies = new THREE.Points(firefliesGeometry, firefliesMaterial);
scene.add(fireflies);
```

### Custom Shader Material
- create a basic vertex shader in /src/shaders/fireflies/vertex.glsl    (vert.glsl)
- create a basic fragment shader  /src/shaders/fireflies/fragment.glsl  (frag.glsl)

```js (glsl)

//shaders/fireflies/vert.glsl

uniform float uPixelRatio;
uniform float uSize;
uniform float uTime;

attribute float aScale;

void main()
{
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    // modelPosition.y += sin(uTime);
    // modelPosition.y += sin(uTime + modelPosition.x * 100.0);
    // modelPosition.y += sin(uTime + modelPosition.x * 100.0) * aScale * 0.2;
    // modelPosition.x += sin(uTime + modelPosition.y * 100.0) * aScale * 0.01;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;

    gl_Position = projectionPosition;

    gl_PointSize = 40.0;
    // gl_PointSize *= (1.0 / - viewPosition.z);
    // gl_PointSize = uSize * aScale * uPixelRatio; 
}
```

```js (glsl)
//shaders/fireflies/frag.glsl

void main()
{
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);

    // vec2 uv = gl_PointCoord.xy / iResolution.xy;

    // float distanceToCenter = distance(gl_PointCoord, vec2(0.5));

    // if (distanceToCenter > 0.5)
    // {
    //     discard;
    // }
    // float strength = 0.05 / distanceToCenter;
    // float strength = 0.05 / distanceToCenter - 0.1 ;


    // gl_FragColor = vec4(1.0, 1.0, 1.0, strength);
}
```

### import those shaders into our script
- replace the PointsMaterial (size, sizeAttenuation) by a ShaderMaterial 
- ShaderMaterial with the vertexShader and fragmentShader

```js
import firefliesVertexShader from "./shaders/fireflies/vert.glsl";
import firefliesFragmentShader from "./shaders/fireflies/frag.glsl";

const firefliesMaterial = new THREE.ShaderMaterial({
  vertexShader: firefliesVertexShader,
  fragmentShader: firefliesFragmentShader,
});

```