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

### Shaders .glsl
/src/shaders/water/vertex.glsl
```js 
//glsl file
uniform float uBigWavesElevation; //import uniforms from script.js

void main(){
  //variables auto created with ShaderMaterial modelMatrix, viewMatrix, projectionMatrix
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition; 

  //elevation
  float elevation = sin(modelPosition.x) * uBigWavesElevation; //lower the elevation with small uBigWavesElevation value
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
    uBigWavesElevation: {value: 0.2}
  }
});

//add uBigWavesElevation to Dat.GUI
gui.add(waterMaterial.uniforms.uBigWavesElevation, 'value').min(0).max(1).step(0.001).name('uBigWavesElevation');

```
