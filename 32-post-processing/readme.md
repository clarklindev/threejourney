# Post processing *(just for learning - going to use Effect Composer)
- adding effects to the final image
- Damaged helmet by Leonardo Carrion
- instead of rendering in the canvas, we do it in a render target (buffer)
- its like rendering a texture to be used later
- in threejs those effects are called "passes"
- each effect is another pass (you can have multiple passes on post-processing)
- and you need 2 render targets -  you cannot write to a render target while reading the same render target 
- a second render target to add the effect (to the previous render target)
- switch between write/read on the render targets (ping-pong buffering)
- the last render is written directly on the screen with all previous effects
- we dont have to do this on our own - use EffectComposer class

### Effect Composer
- https://threejs.org/docs/#examples/en/postprocessing/EffectComposer
- import the effectComposer class
- as the first pass, we usually start from a render of the scene - first render of scene with RenderPass
- import the RenderPass
- instantiate an EffectComposer 
    - use the renderer as parameter
    - set the pixel ratio with setPixelRatio() 
    - resize it with setSize()
- instantiate a RenderPass and add it to effectComposer with addPass() - this is a single render of the scene.
- In the tick function, replace the renderer.render() with: effectComposer.render();


```js
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } f  rom 'three/examples/jsm/postprocessing/RenderPass.js'

const effectComposer = new EffectComposer(renderer);
effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); //limit pixel ratio to 2
effectComposer.setSize(sizes.width, sizes.height);

// // Render pass
const renderPass = new RenderPass(scene, camera);
effectComposer.addPass(renderPass); 

```

### Dot screen pass
- import DotScreenPass
- to add a pass, instantiate it and add it to the effectComposer after the renderPass
- to disable a pass: // dotScreenPass.enabled = false;

```js
import { DotScreenPass } from 'three/examples/jsm/postprocessing/DotScreenPass.js';

const dotScreenPass = new DotScreenPass();
dotScreenPass.enabled = false;
effectComposer.addPass(dotScreenPass);

``` 

### GlitchPass
- import GlitchPass, instantiate it and add it.
- there is a .goWild property (to constantly glitch)

```js
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass.js'
const glitchPass = new GlitchPass();
glitchPass.goWild = true;
glitchPass.enabled = false;
effectComposer.addPass(glitchPass);

```

### RGBShift pass

- some passes require extra work like RGBSHift pass
- RGBShiftShader  is only available as a shader, need to use it with a ShaderPass
- import the ShaderPass and the RGBShiftShader
- can offset R, G or B
- the shaderPass receives a shader
- instantiate the ShaderPass with the RGBShiftShader as parameter and add it to effectComposer

```js
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { RGBShiftShader } from 'three/examples/jsm/shaders/RGBShiftShader.js';

const rgbShiftPass = new ShaderPass(RGBShiftShader);
effectComposer.addPass(rgbShiftPass);

```
### Fixing the color
- using Effect composer - colors are darker
- the renderer.outputEncoding = THREE.sRGBEncoding doesnt work anymore because the render targets of EffectComposer encoding is not set right.
- but we can provide our own render targets
- this is because if you only have a single pass (or the last render), effect composer doesnt render in render target1 or 2, it renders directly to the screen.
- but if we get into the EffectComposer ping-pong between render targets, the colors start going wrong because outputEncoding doesnt work.
- renderer.outputEncoding = THREE.sRGBEncoding //not working when using render target...
- in node_modules/three/examples/jsm/postprocessing/EffectComposer.js we can see how the renderTarget is made and we can copy this code.
- The width and height are not important because setSize() will update them
- but default is LinearEncoding and we need to change this...

```js
const renderTarget = new RenderTargetClass(800, 600, {
  minFilter: THREE.LinearFilter,
  magFilter: THREE.LinearFilter,
  format: THREE.RGBAFormat,
  // encoding: THREE.sRGBEncoding, //default is LinearEncoding //DEPRECATED
  encoding: THREE.SRGBColorSpace, 

});
```