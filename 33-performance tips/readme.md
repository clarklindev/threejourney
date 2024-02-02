# Performance tips
- target is 60fps experience

### stats.js
- measure fps stats.js: npm i stats.js
- create an instance of Stats() 
- select panel to show
- append to document.body
- in tick() call its begin() and end() methods


```js
import Stats from "stats.js";

const stats = new Stats();
stats.showPanel(0); //0 is fps
document.body.appendChild(stats.dom);

...

const tick = () =>{
  stats.begin();

  stats.end();
}

```

### monitoring draw calls
- draw calls are actions of drawing by the GPU
- less draw calls the better
- chrome ext to monitor - spector.js - see how scene is being drawn

### renderer.info
- provide info of whats in scene and being drawn

```
console.log(renderer.info);

```

### tick function
- make sure its optimized and not heavy

### memory 
- dispose things from memory https://threejs.org/docs/#manual/en/introduction/How-to-dispose-of-objects

* see tip 6

```js
scene.remove(cube)
cube.geometry.dispose()
cube.material.dispose()
```

### lights
- avoid three.js lights
- use baked lights or cheap light (ambient, directional, hemisphere)
- when add/removing lights, all materials supporting lights will have to be recompiled

### shadows
- avoid shadows
- use baked shadows
- optimize shadow maps, make sure shadow maps fit perfectly for the scene (optimized - not too far)
- each light add a camera helper
- check object if they can cast/receive shadows

- deactivate shadow autoupdate 
```js
renderer.shadowMap.autoUpdate = false
renderer.shadowMap.needsUpdate = true //allows render shadow on first render
```

### see script.js

#### tip 30 - power preferences
- set gpu usage - giving hints on what power is required when instantiating the WebGLRenderer via .powerPreference

```js
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  powerPreference: 'high-performance'
});

```


### use DEFINE for constants 

```js
#define uDisplacementStrength 1.5
```

- or in defines property of the ShaderMaterial

```js
const shaderMaterial = new THREE.ShaderMaterial({

  defines:{
    uDisplacementStrength: 1.5
  }
})
```

### 35 - do calculations in the vertex shader

- better to do calculations in vertex shader and send values to fragment shader using "varying"
- move whats possible out of fragment shader into vertex shader

```js

```
