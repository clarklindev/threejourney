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

### Shaders .glsl
/src/shaders/water/vertex.glsl
```js 
//glsl file

void main(){
  //variables auto created with ShaderMaterial modelMatrix, viewMatrix, projectionMatrix
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition; 

  gl_Position = projectedPosition;
}
```

/src/shaders/water/fragment.glsl
```js
//glsl file
void main(){
  gl_FragColor = vec4(0.5, 0.8, 1.0, 1.0);
}
```

### JS
```js

//import shaders
import waterVertexShader from './shaders/water/vertex.glsl';
import waterFragmentShader from './shaders/water/fragment.glsl';

const waterGeometry = new THREE.PlaneGeometry(2, 2, 512, 512);
const waterMaterial = new THREE.ShaderMaterial({
  vertexShader: waterVertexShader,
  fragmentShader: waterFragmentShader
});
```
