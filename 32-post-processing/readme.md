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
- send the renderTarget to effectComposer

```js
const renderTarget = new RenderTargetClass(800, 600, {
  minFilter: THREE.LinearFilter,
  magFilter: THREE.LinearFilter,
  format: THREE.RGBAFormat,
  // encoding: THREE.sRGBEncoding, //default is LinearEncoding //DEPRECATED
  encoding: THREE.SRGBColorSpace, 

});

//Composer
const effectComposer = new EffectComposer(renderer, renderTarget);
```

### Resizing screen
- render target not resizing because of: effectComposer.setSize(sizes.width, sizes.height); not resizing with window
- move code -> need to handle resize in window.addEventListener('resize', ()=>{});

```js 
//script.js


// effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// effectComposer.setSize(sizes.width, sizes.height);


window.addEventListener('resize', ()=>{
  //update effect composer
  effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  effectComposer.setSize(sizes.width, sizes.height);

});
```

### fixing initial anti-aliasing
- with effectComposer - the anti aliasing also isnt working, 
- if you only have the renderPass available,  you wont see the problem because
the render is done in the canvas with anti-alias support
- WebGLRenderTarget does not support the default antialias
- NB: https://github.com/mrdoob/three.js/wiki/Migration-Guide - WebGLMultisampleRenderTarget (threejs 138)
- WebGLMultisampleRenderTarget has been removed. To use multisampling as before, use WebGLRenderTarget 
  - set the new samples property to a value greater 0.

#### SOLUTION
1. ignore anti-aliasing
2. use a particular type of render target (WebGLMultisampleRenderTarget) that handles antialiasing (not working on all modern browsers)
3. add a new pass for anti-alias (bad for performance)
4. *PICKED SOLUTION - combination of 2 and 3 (test if browser supports this specific type of render target - if not, use antialias pass)

- using webgl multisample render target (WebGLMultisampleRenderTarget) - supports anti-alias (DEPRECATED)
- WebGLMultisampleRenderTarget is like WebGLRenderTarget but with support for multisample antialias (MSAA)

- add an antialias pass: 
    - FXAA - performant - but the result is just ok and can be blurry
    - SMAA - better than FXAA but less performant **pick**
    - SSAA - best quality but the worst performance
    - TAA - performant but limited result
    - other passes
- import the SMAAPass, instantiate it and add it to effectComposer
- combine the two solutions

#### pixelRatio > 1
  - if the pixel ratio is above 1, we use the WebGLRenderTarget and no antialias pass  //wont need anti-alias as no issues due to higher resolution ratio

#### pixelRatio === 1
  - if the pixel ratio is 1 and the browser supports WebGL2, we use WebGLMultisampleRenderTarget
  - if the pixel ratio is 1 but the browser doesnt support WebGL2, we use the WebGLRenderTarget and enable the SMAPass

- to get pixel ratio we use getPixelRatio() on the renderer
- to know if the browser supports WebGL2 we can use the capabilities property on the renderer (renderer.capabilities - isWebGL2 === true ?)

```js

//use WebGLMutlisampleRenderTarget
// const renderTarget = new THREE.WebGLMultisampleRenderTarget({}); //DEPRECATED WebGLMultisampleRenderTarget
const renderTarget = new THREE.WebGLRenderTarget({});
renderTarget.samples = 4;

//add an antialias pass
//using SMAA
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass.js'

if(renderer.getPixelRatio() === 1 && !renderer.capabilities.isWebGL2)
{
    const smaaPass = new SMAAPass();
    effectComposer.addPass(smaaPass);

  console.log('Using SMAA')
}


//render target
let RenderTargetClass = null
if(renderer.getPixelRatio() === 1 && renderer.capabilities.isWebGL2)
{
    RenderTargetClass = THREE.WebGLMultisampleRenderTarget;   //DEPRECATED -> use THREE.WebGLRenderTarget and .samples
    console.log('Using WebGLMultisampleRenderTarget');
}
else
{
    RenderTargetClass = THREE.WebGLRenderTarget
    console.log('Using WebGLRenderTarget')
}


```