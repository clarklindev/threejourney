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
- replace the PointsMaterial (size, sizeAttenuation) by a ShaderMaterial. 
- ShaderMaterial with the vertexShader and fragmentShader.

### Point size (22min)
- it creates the squares with the now ShaderMaterial -> BUT the squares might look smaller on screens with high pixel ratio.
- ie. the size of particles is different depending on pixel ratio...

#### FIX: 
- REMINDER: to send values from js to shaders, we need uniforms:{}

- SEND A uPixelRatio uniform with the same formula for renderer.setPixelRatio() to the shader.
- use the uPixelRatio uniform in the vertex shader on the gl_PointSize: `gl_PointSize = 40.0 * uPixelRatio;`
- NOTE: Material is being created before the renderer, so we cant
use renderer.getPixelRatio()...hardcode `Math.min(window.devicePixelRatio, 2)` //limit pixel ratio to 2
- add it to the resize callback (assists when screens with different pixelRatio AND a window resize occurs)
- (27min27sec): the size of the squares is the same regardless of the distance, 

#### JS: ability to control the size of particles
- create a uSize uniform:  `uSize: {value:100}`
- which is sent to vertex shader
- add a tweak to Dat.GUI `gui.add(firefliesMaterial.uniforms.uSize, "value")`

```js

//script
import firefliesVertexShader from "./shaders/fireflies/vert.glsl";
import firefliesFragmentShader from "./shaders/fireflies/frag.glsl";

const firefliesMaterial = new THREE.ShaderMaterial({
  uniforms: {
    uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
    uSize: {value:100}
  },
  vertexShader: firefliesVertexShader,
  fragmentShader: firefliesFragmentShader,
});

// Fireflies debug
gui
  .add(firefliesMaterial.uniforms.uSize, "value")
  .min(0)
  .max(500)
  .step(1)
  .name("firefliesSize");

window.addEventListener("resize", () => {

  //...

  //update fireflies
  firefliesMaterial.uniforms.uPixelRatio.value = Math.min(
    window.devicePixelRatio,
    2
  );
});

```

#### Vertex Shader
- use the uPixelRatio uniform in the vertex shaer on the gl_PointSize
- we need to activate the size attenuation in vertex shader: 
`gl_PointSize *= (1.0 / - viewPosition.z); `
- instead of fixed value, we can pass in from js: `uSize: {value:100}`
- use it in the vertex shader

```js (glsl)

//shaders/fireflies/vert.glsl

uniform float uPixelRatio;
uniform float uSize;

void main()
{
    //...
    // gl_PointSize = 40.0 * uPixelRatio; //replaced with uSize (below)
    gl_PointSize = uSize * uPixelRatio; 

    gl_PointSize *= (1.0 / - viewPosition.z);      //for size attenuation
}
```

### firefly pattern
- increase the particle size to 200 and show the UV coordinates with gl_PointCoord
- each vertex of the geometry will be a particle
- we can access the uv coordinates of each square (particle) using gl_PointCoord (from fragment shader)
- create a "distanceToCenter" variable and calculate the distance between the center (vec2(0.5)) and gl_PointCoord.
- use this distanceToCenter variable as the alpha of gl_FragColor
- dont forget to set transparent to "true" on the material
- to create the pattern, start with a very small value and divide it by the distanceToCenter

```js
//fragment shader
void main(){
  float distanceToCenter = distance(gl_PointCoord, vec2(0.5));

  gl_FragColor = vec4(1.0, 1.0 , 1.0, distanceToCenter);
}
```


- create a strength variable, divide 0.05 by distanceToCenter and send it to the gl_FragColor: `gl_FragColor = vec4(1.0, 1.0, 1.0, strength);`
- the value gets low but never reaches 0 , but you still see background on the particle
- to fix that, we can subtract a small value

```js
//fragment shader
void main(){
  float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
  float strength = 0.05 / distanceToCenter - 0.1; //(0.05 * 2.0); 

  gl_FragColor = vec4(1.0, 1.0 , 1.0, strength);
}

```

### scale randomness
- always good to add randomness
- create an "aScale" attribute and fill it with random values
- use the attribute in the gl_PointSize formula

```js
const scaleArray = new Float32Array(firefliesCount);

for (let i = 0; i < firefliesCount; i++) {
  //...
  scaleArray[i] = Math.random();
}

firefliesGeometry.setAttribute(
  "aScale",
  new THREE.BufferAttribute(scaleArray, 1)
);
```

```js (glsl)
//shaders/fireflies/vert.glsl

uniform float uPixelRatio;
uniform float uSize;
attribute float aScale;

void main()
{
    //...
    // gl_PointSize = 40.0 * uPixelRatio; //replaced with uSize (below)
    gl_PointSize = uSize * aScale * uPixelRatio; 

    gl_PointSize *= (1.0 / - viewPosition.z);      //for size attenuation
}
```

### blending
- make stars EVEN SHINNIER (like a light)
- set the blending property of the material to THREE.AdditiveBlending

```js
const firefliesMaterial = new THREE.ShaderMaterial({blending: THREE.AdditiveBlending});
```

### Depth Write
- at some specific angles, you will notice some clipping issues
eg. larger (closer) particle, hides the one behind it

- meaning the buffer that threejs uses to remind particles of other particles are in front of it and whether it should render, turning depthWrite off is telling threejs to ignore the buffer so render everthing and dont worry about depth and particles obscuring other particles.

- to fix that, deactivate depth writing by setting the depthWrite property to false on the material

```js
const firefliesMaterial = new THREE.ShaderMaterial({
  depthWrite: false,
});

```

### floating animation
- move fireflies by floating up and down
- because we are animating with time in shader, we need to provide the time to vertex shader
- create a uTime uniform and update it in the tick function by using the elapsedTime variable: `firefliesMaterial.uniforms.uTime.value = elapsedTime;`
- use the uTime uniform in the vertex shader and update the modelPosition.y using sin()
- we need randomness
- VERTEX shader: we can use the x axis to offset the value:
`modelPosition.y += sin(uTime + modelPosition.x * 100.0);`
- randomize and reduce the amplitude 
- we can use the aScale 
- this way, the smaller particles move less, large particles move more
- 

```js
const firefliesMaterial = new THREE.ShaderMaterial({
  //...
  
  uniforms:{
    uTime: {value: 0}
  },

  blending: THREE.AdditiveBlending
  
});

//...
const tick = ()=>{
  const elapsedTime = clock.getElapsedTime();
  firefliesMaterial.uniforms.uTime.value = elapsedTime;

}
```

```js (glsl)
//shaders/fireflies/vert.glsl

uniform float uTime;
void main()
{
  //...
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  modelPosition.y += sin(uTime);
  //...
}
```
---

### PORTAL
- draw something within the portal

### custom shader material (portal)
/shaders/portal/vert.glsl
/shaders/fragment/frag.glsl

```js (glsl)
//vertex shader


varying vec2 vUv;

void main()
{
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectionPosition = projectionMatrix * viewPosition;

  gl_Position = projectionPosition;
}

```

```js (glsl)
//fragment shader

void main(){
  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);

}
```
- import the shaders in js (57min17sec)

```js
import portalVertexShader from "./shaders/portal/vert.glsl";
import portalFragmentShader from "./shaders/portal/frag.glsl";

```
- (58min20) replace the MeshBasicMaterial by a ShaderMaterial with the vertexShader and fragmentShader properties

```js
const portalLightMaterial = new THREE.ShaderMaterial({
  vertexShader: portalVertexShader,
  fragmentShader: portalFragmentShader,
});
```
- we are goin to use the UV Coordinates to draw on the portal
- send the uv coordinates from the vertex shader to the fragment shader using a vUv varying
- REMEMBER: because ShaderMaterial() has the default props already created eg. uv in the shader, you already have access to the UV coordinates.
- BUT because we want to send to fragment shader, we create a varying with same name accessible in fragment shader.
- retrieve it in the fragment shader (60min 47sec)

#### Fix the UV Coordinates (60min47sec -> 64min)
- If there is not UV, when creating the geometry, you did not select "generate UV"
- REMEMBER: if the portal is not displaying gradient mix of colors it needs to be unwrapped. 
- select the portal, then "U -> unwrap" -> export gltf 2.0
 
```js (glsl)
//vertex shader
varying vec2 vUv;   //vUv .. v before Uv stands for varying

void main()
{
  //...
  vUv = uv;
}

```

```js (glsl)
//fragment shader
varying vec2 vUv;   //vUv passed here from vertex shader
void main(){
  gl_FragColor = vec4(vUv, 1.0, 1.0);
}
```

### Perlin
- we are going to start with a classic Perlin noise
- we will use a 3D Perlin (even though its 2d coordinates), so we can animate the third value with the time
- use the Classic perlin 3D noise from Stefan gustavson 
- put in shaders/portal/frag.glsl
- create a strength variable and use the cnoise function with th vUv (we will use the time variable)
- create a uTime uniform and update it in the tick function
- use it in the fragment shader
- to get even better result we are going to displace the UV coordinates
- slow down the animation with different values (60min 14sec)

### Outer glow (75min 41sec)
- portal should shine onto bricks and those c
- losest should be totally white
- get the distance to the center and display the result in gl_FragColor
- we need to push the value at the edges (78min)
- multiply and offset the value until you are satisfied
- add the outerGlow to the strength and send the strength to the gl_FragColor

### Step - using step to fix edges of portal
- the pattern is too smooth and we want to add some sharpness
- we can apply a step() function to the strength 

### Colors
- uniforms: add a uColorStart and uColorEnd
- use them in the fragment shader with a mix()
- add them to Dat.GUI
- to fix colors issue where the other is not a definite color, after creating portalColorInner, and portalColorOuter...
- use clamp() on the value in the shader
- reason: we loose a bit of sharpness when using various colors because the strength can go below 0.0 and above 1.0 which results in extrapolated colors -fix with clamp

```js (glsl)
//fragment shader
uniform float uTime;
varying vec2 vUv;

//...


//float strength = cnoise(vec3(vUv.x * 5.0, vUv.y * 5.0, 0.0));
//float strength = cnoise(vec3(vUv * 5.0, 0.0));

// Displace the UV 
vec2 displacedUv = vUv + cnoise(vec3(vUv * 5.0, uTime * 0.1)) ;

//PERLIN NOISE - AND use uTime
float strength = cnoise(vec3(displacedUv * 5.0, uTime * 0.2));

//outer glow
float outerGlow = distance(vUv, vec2(0.5)) * 5.0 - 1.4;
strength += outerGlow;

//apply cool step
//strength = step(-0.2, strength);
strength += step(- 0.2, strength) * 0.8;

//clamp
strength = clamp(strength, 0.0, 1.0);

gl_FragColor = vec4(strength, strength, strength, 1.0);

```

```js
const debugObject = {};
debugObject.portalColorInner = "#6e6cd5";
debugObject.portalColorOuter = "#e6a2d8";


const portalLightMaterial = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },

    uColorInner: { value: new THREE.Color(
    //  0xFF0000
     debugObject.portalColorInner
    ) },

    uColorOuter: { value: new THREE.Color(
      // 0x0000FF
      debugObject.portalColorOuter
    ) },
  
  },
});

gui.addColor(debugObject, "portalColorInner").onChange(() => {
  portalLightMaterial.uniforms.uColorInner.value.set(
    debugObject.portalColorInner
  );
});

gui.addColor(debugObject, "portalColorOuter").onChange(() => {
  portalLightMaterial.uniforms.uColorOuter.value.set(
    debugObject.portalColorOuter
  );
});


const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  portalLightMaterial.uniforms.uTime.value = elapsedTime;
}

```