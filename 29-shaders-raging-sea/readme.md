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
- add it to Dat.GUI

### Shaders .glsl
/src/shaders/water/vertex.glsl
```js 
//glsl file
uniform float uBigWavesElevation; //import uniforms from script.js
uniform float uTime;

void main(){
  //variables auto created with ShaderMaterial modelMatrix, viewMatrix, projectionMatrix
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition; 

  //elevation
  float elevation = sin(modelPosition.x * uBigWavesFrequency.x + uTime) *     //on the x
                    sin(modelPosition.z * uBigWavesFrequency.y + uTime) *     //on the y
                    uBigWavesElevation;                               //lower the elevation with small uBigWavesElevation value
  
  modelPosition.y += elevation;
  
  gl_Position = projectedPosition;
}
```

---

/src/shaders/water/fragment.glsl
```js
//glsl file
void main(){
  gl_FragColor = vec4(0.5, 0.8, 1.0, 1.0);
}
```

---

/src/script.js
### JS
```js

//import shaders
import waterVertexShader from './shaders/water/vertex.glsl';
import waterFragmentShader from './shaders/water/fragment.glsl';

const waterGeometry = new THREE.PlaneGeometry(2, 2, 512, 512);
const waterMaterial = new THREE.ShaderMaterial({
  vertexShader: waterVertexShader,
  fragmentShader: waterFragmentShader,
  uniforms:{
   
    uTime: {value: 0},  //shader changes with time
    uBigWavesElevation: {value: 0.2},
    uBigWavesFrequency: {value: new THREE.Vector2( 4, 1.5) }, //x,y (x,z)
    uBigWavesSpeed: {value: 0.75}
  }
});

//add uBigWavesElevation to Dat.GUI
gui.add(waterMaterial.uniforms.uBigWavesElevation, 'value').min(0).max(1).step(0.001).name('uBigWavesElevation');
gui.add(waterMaterial.uniforms.uBigWavesFrequency.value, 'x').min(0).max(10).step(0.001).name('uBigWavesFrequencyX');
gui.add(waterMaterial.uniforms.uBigWavesFrequency.value, 'y').min(0).max(10).step(0.001).name('uBigWavesFrequencyY');
gui.add(waterMaterial.uniforms.uBigWavesSpeed, 'value').min(0).max(4).step(0.001).name('uBigWavesSpeed')

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
