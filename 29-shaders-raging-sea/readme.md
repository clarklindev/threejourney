# Three.js Journey

## Setup
Download [Node.js](https://nodejs.org/en/download/).
Run this followed commands:

``` bash
# Install dependencies (only the first time)
npm install

# Run the local server at localhost:8080
npm run dev

# Build for production in the dist/ directory
npm run build
```

### Scene - Material - ShaderMaterial

- scene with PlaneGeometry
- change THREE.MeshBasicMaterial() to THREE.ShaderMaterial() NOT RawShaderMaterial()
- create src/shaders/water - folder with vertex.glsl and fragment.glsl
- import shaders and use in ShaderMaterial
- create waves - use sin()
  - in the vertex shader, move the y value of the modelPosition with a sin() based on x
- add a uBigWavesElevation uniform
- lower the elevation - retrieve and use the uBigWavesElevation uniform in the vertex shader (makes values go from -0.2 to 0.2)
- create a elevation variable in order to use it later to colorize the waves.
- add uBigWavesElevation to Dat.GUI

#### FREQUENCY 
- we want to control the frequency on the x AND z axes
  - create a uBigWavesFrequency uniform with a Vector2.
- retrieve the uniform and apply it in the sin() with only the x
- use the y property of uBigWavesFrequency to add waves on the z axis, we are going to multiply them.
- add the x and y properties of uBigWavesFrequency to Dat.GUI.

#### ANIMATION 
- we are going to use elapsed time to offset the value in the sin() - ie. send the elapsed time
- create a uTime uniform in the ShaderMaterial
- update it in the tick() function
- retrieve and use the uTime in both sin() functions
- update the speed

#### WAVE SPEED
- we want to control the speed of the wave
- we use the same speed for both axes
- create a uBigWavesSpeed uniform - add it to the elevation variable by multiplying the uBigWavesSpeed value
- add it *(uBigWavesSpeed) to Dat.GUI 
- retrieve the uBigWavesSpeed uniform and multiply the utime by it in both sin() functions

#### COLORS
- to use 2 colors - one for depth, one for the surfrace (eg. high-wave color / low-wave color)
- to be able to control color, create a debugObject (something to the color value in)
- add depthColor property and surfaceColor property to the debugObject
- create a uDepthColor and uSurfaceColor uniforms with those properties by using the Color class
- add them to Dat.UI with addColor() method and update "waterMaterial" uniforms with onChange()
- import uDepthColor and uSurfaceColor - then update the fragment shader
- use only one in the gl_FragColor to test
- we are going to create a mix (transition colors) between the uDepthColor and the uSurfaceColor according to the wave elevation.
- work out color to use depending on elevation:
- in the vertext shader, create a vElevation varying - its "sent" to the fragment shader
- in fragment shader, retrieve the varying and create a color variable that mixes the "uDepthColor" and the "uSurfaceColor" according to the vElevation.
- we cant see much because vElevation goes from -0.2 to +0.2
- add uColorOffset and uColorMultiplier uniforms. (46min17sec)
- add them to Dat.GUI
- retrieve the uColorOffset and uColorMultiplier uniforms in the fragment shader
  - create a mixStrength variable and use it in the mix() function - 
  ```js 
  //fragment shader
    float mixStrength = (vElevation + uColorOffset) * uColorMultiplier;
    vec3 color = mix(uDepthColor, uSurfaceColor, mixStrength);
  ```

### Shaders .glsl
/src/shaders/water/vertex.glsl
```js 

varying float vElevation;

//glsl file
uniform float uBigWavesElevation; //import uniforms from script.js
uniform float uTime;

void main(){
  //variables auto created with ShaderMaterial modelMatrix, viewMatrix, projectionMatrix
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition; 

  //elevation
  float elevation = sin(modelPosition.x * uBigWavesFrequency.x + uTime * uBigWavesSpeed) *     //on the x
                    sin(modelPosition.z * uBigWavesFrequency.y + uTime * uBigWavesSpeed) *     //on the y
                    uBigWavesElevation;                               //lower the elevation with small uBigWavesElevation value
  
  vElevation = elevation;

  modelPosition.y += elevation;
  
  gl_Position = projectedPosition;
}
```

---

/src/shaders/water/fragment.glsl
```js
uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
uniform float uColorOffset;
uniform float uColorMultiplier;

varying float vElevation;

//glsl file
void main(){
  
  float mixStrength = (vElevation + uColorOffset) * uColorMultiplier;
  vec3 color = mix(uDepthColor, uSurfaceColor, mixStrength);
  gl_FragColor = vec4(color, 1.0);
}
```

---

/src/script.js
### JS
```js

//import shaders
import waterVertexShader from './shaders/water/vertex.glsl';
import waterFragmentShader from './shaders/water/fragment.glsl';

const debugObject = {};

debugObject.depthColor = '#186691';      //low
debugObject.surfaceColor = '#9bd8ff';    //high

const waterGeometry = new THREE.PlaneGeometry(2, 2, 512, 512);
const waterMaterial = new THREE.ShaderMaterial({
  vertexShader: waterVertexShader,
  fragmentShader: waterFragmentShader,
  uniforms:{
   
    uTime: {value: 0},  //shader changes with time
    uBigWavesElevation: {value: 0.2},
    uBigWavesFrequency: {value: new THREE.Vector2( 4, 1.5) }, //x,y (x,z)
    uBigWavesSpeed: {value: 0.75},
    uDepthColor: { value: new THREE.Color(debugObject.depthColor) },
    uSurfaceColor: { value: new THREE.Color(debugObject.surfaceColor) },
    uColorOffset: { value: 0.08 },
    uColorMultiplier: { value: 5 }
  }
});

//add uBigWavesElevation to Dat.GUI
gui.add(waterMaterial.uniforms.uBigWavesElevation, 'value').min(0).max(1).step(0.001).name('uBigWavesElevation');
gui.add(waterMaterial.uniforms.uBigWavesFrequency.value, 'x').min(0).max(10).step(0.001).name('uBigWavesFrequencyX');
gui.add(waterMaterial.uniforms.uBigWavesFrequency.value, 'y').min(0).max(10).step(0.001).name('uBigWavesFrequencyY');
gui.add(waterMaterial.uniforms.uBigWavesSpeed, 'value').min(0).max(4).step(0.001).name('uBigWavesSpeed')
gui.addColor(debugObject, 'depthColor').onChange(() => { waterMaterial.uniforms.uDepthColor.value.set(debugObject.depthColor) });
gui.addColor(debugObject, 'surfaceColor').onChange(() => { waterMaterial.uniforms.uSurfaceColor.value.set(debugObject.surfaceColor) });
gui.add(waterMaterial.uniforms.uColorOffset, 'value').min(0).max(1).step(0.001).name('uColorOffset');
gui.add(waterMaterial.uniforms.uColorMultiplier, 'value').min(0).max(10).step(0.001).name('uColorMultiplier');

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () =>
{
  const elapsedTime = clock.getElapsedTime();

  // Water
  waterMaterial.uniforms.uTime.value = elapsedTime;
  ...

}
```
