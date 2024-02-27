# react three fiber - post processing

- effects merged together to reduce number of passes (think instagram filter)
- R3F @react-three/postprocessing
- THREE normal postprocessing

```cmd
npm i @react-three/postprocessing@2.6
```

### Multisampling

- multisampling is used to prevent the aliasing effect (default is 8)

```js
<EffectComposer multisampling={0}>
</EffectCompose>
```

### Finding effects

#### PostProcessing

- The repository: https://github.com/pmndrs/postprocessing
- The documentation (generated from the code): https://pmndrs.github.io/postprocessing/public/docs/
- A demo page (you can change the effect within the debug UI): https://pmndrs.github.io/postprocessing/public/demo/

#### React-PostProcessing

- The repository: https://github.com/pmndrs/reactpostprocessing
- The list of effects implemented from postprocessing to React postprocessing: https://github.com/pmndrs/postprocessing#included-effects
- The documentation (very similar to the repo, but more user-friendly): https://docs.pmnd.rs/react-postprocessing/introduction

---

##### Blending
- "blendFunction" is an attribute available for all effects
- works like image blending software (how colors merge with whats behind it)
- default is "normal"
- to change, we need to get the list of blending from postprocessing
- npm i postprocessing@6.28
- import {BlendFunction} from 'postprocessing';
- use LEVA to find the right blending function
- default: BlendFunction.NORMAL

### Vignette effect (18min)

- darkened borders
- fixing effect on TL and TR 
- FIX:add bg color to background of scene

```js
import { Vignette, EffectComposer} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";

return (

  <color args={["#ffffff"]} attach="background" />

  <EffectComposer>
    <Vignette
      offset={0.5} // vignette offset
      darkness={0.5} // vignette darkness
      eskil={false} // Eskil's vignette technique
      blendFunction={BlendFunction.NORMAL} // blend mode
    />
  </EffectComposer>
);
```

### Glitch (28min)

- glitch the screen
- see documentation
- attributes: delay, duration, strength 

```js
import {Glitch} from "@react-three/postprocessing";
import {
  GlitchMode,
  BlendFunction,
} from "postprocessing";
//...

return (
  <Glitch
    delay={[0.5, 1]}
    duration={[0.1, 0.3]}
    strength={[0.2, 0.4]}
    mode={GlitchMode.CONSTANT_MILD}     // CONSTANT_MILD, CONSTANT_WILD, CONSTANT_SPORADIC
  />
)
```

### Noise (33min 20sec)
- premultiply - multiply noise with input color before applying the blending (results in darker render)

```js
import {Noise} from "@react-three/postprocessing";
return (
  <Noise premultiply blendFunction={BlendFunction.SOFT_LIGHT}>
);
```

### Bloom effect (37min 11sec)
- makes scene glow
- suggestion: use dark background
- needs 'mipmapBlur'
- change background to black `<color args={["#000000"]} attach="background" />`
- requires color values to go beyond 1 to glow
- NOTE: a tone mapping is applied by default which clamps values between 0 and 1
- disable toneMapping on object that should glow: `toneMapped={false}`
- can control the general intensity via "intensity" on the Bloom via the postProcessing filter 
- luminanceThreshold - limit at which things start to glow.
- good to set intensity={0.1} luminanceThreshold={0}, then adjust the glow via the mesh color

##### `<meshStandardMaterial>`

- change color from words like "red" to an array [1.5, 1, 4] , this allows color values beyond 1.
- reddish `<meshStandardMaterial color={[4, 1, 2]} toneMapped={false}/>`
- orangish `<meshStandardMaterial color={[5, 2, 1]} toneMapped={false}/>`
- other ways to glow, use emissive and emissiveIntensity: use `emissive="orange"`, with `emissiveIntensity={2}`


##### `<meshBasicMaterial>`
- doesnt care about lighting, uniform glow color.
- if you want uniform emissive, switch to a `<meshBasicMaterial>` there is no "emissive" and "emissiveIntensity", you'l have to set the "color" attribute with channel values that go above 1.

```js
import {Bloom} from "@react-three/postprocessing";

<EffectComposer>
  <Bloom
    mipmapBlur
    intensity={ 0.5 }
    luminanceThreshold={ 0 }
  />
</EffectComposer>

<mesh castShadow position-x={2} scale={1.5}>
  <boxGeometry />
  // <meshStandardMaterial color={[5, 2, 1]} toneMapped={false}/>
  // <meshStandardMaterial color="orange" emissive="orange" emissiveIntensity={2} toneMapped={false}/>
  // <meshStandardMaterial color="white" emissive="orange" emissiveIntensity={2} toneMapped={false}/>
  <meshBasicMaterial color={[1.5, 1, 4]} toneMapped={false}/>
</mesh>

```

### 50-react-three-fiber-post-processing-depth-of-field (54min 45sec)
- blur something what's closer or further from a set distance
- 3 attributes:
  - focalDistance - distance at which image should be sharp
  - focalLength - distance to travel from the focusDistance before reaching maximum blur
  - bokehScale - blur radius
- these values are normalized (ie. between 0 -> 1)

```js
import {DepthOfField} from "@react-three/postprocessing";

<DepthOfField
  focusDistance={ 0.025 }
  focalLength={ 0.025 }
  bokehScale={ 6 }
/> 
```

### ScreenSpaceReflection (SSR) effect (60min)
- add a decent reflection to scene at a decent framerate
- search r3f website to see how examples are done:
  - https://codesandbox.io/s/ssr-test-8pbw1f
- set roughness and metalness to 0 on meshStandardMaterial
- use Leva to tweak
- add the imported props from example as props to `<SSR {...ssrProps}/>`

```js
import {SSR} from "@react-three/postprocessing";
import {useControls} from 'leva';

const ssrProps = useControls({
  temporalResolve: true,
  STRETCH_MISSED_RAYS: true,
  USE_MRT: true,
  USE_NORMALMAP: true,
  USE_ROUGHNESSMAP: true,
  ENABLE_JITTERING: true,
  ENABLE_BLUR: true,
  temporalResolveMix: { value: 0.9, min: 0, max: 1 },
  temporalResolveCorrectionMix: { value: 0.25, min: 0, max: 1 },
  maxSamples: { value: 0, min: 0, max: 1 },
  resolutionScale: { value: 1, min: 0, max: 1 },
  blurMix: { value: 0.5, min: 0, max: 1 },
  blurKernelSize: { value: 8, min: 0, max: 8 },
  blurSharpness: { value: 0.5, min: 0, max: 1 },
  rayStep: { value: 0.3, min: 0, max: 1 },
  intensity: { value: 1, min: 0, max: 5 },
  maxRoughness: { value: 0.1, min: 0, max: 1 },
  jitter: { value: 0.7, min: 0, max: 5 },
  jitterSpread: { value: 0.45, min: 0, max: 1 },
  jitterRough: { value: 0.1, min: 0, max: 1 },
  roughnessFadeOut: { value: 1, min: 0, max: 1 },
  rayFadeOut: { value: 0, min: 0, max: 1 },
  MAX_STEPS: { value: 20, min: 0, max: 20 },
  NUM_BINARY_SEARCH_STEPS: { value: 5, min: 0, max: 10 },
  maxDepthDifference: { value: 3, min: 0, max: 10 },
  maxDepth: { value: 1, min: 0, max: 1 },
  thickness: { value: 10, min: 0, max: 10 },
  ior: { value: 1.45, min: 0, max: 2 }
});
//...

<EffectComposer>
  <SSR {...ssrProps}/>
</EffectComposer>
```
---

### Custom effects (71min 33sec)
- to make your own effects, create it for post processing, then make it available for R3F
- post processing is merging effects together into one shader

#### how to? (73min)
Post Processing custom effect: https://github.com/pmndrs/postprocessing/wiki/Custom-Effects
React-postprocessing custom effect: https://github.com/pmndrs/react-postprocessing/blob/master/api.md#custom-effects

#### basic postprocessing effect
- this is just displaying the uv coordinates (if working)
- src/DrunkEffect.js
- need to extend Effect class from 'postprocessing';
- postprocessing will take our shader and merge it with other effect shaders
- our shader can be implemented in a function that must be named 'mainImage', return "void" and have the following specific params
  `void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor)`
- omitting one of the parameters or changing them will result in a bug
- put it in fragmentShader variable right before the class
- NOTE: syntax highlight install vscode extension: `es6-string-html`
- using WEBGL 2 syntax where we can specify more information associated with each patameter
  - const -> parameter wont be writable
  - in -> a copy of actual variable and changing it wont affect the initial variable sent when calling the function
  - out -> changing this value will change the variable sent when calling the function
  - inputColor -> contains the current color for that pixel which is defined by the previous effects
  - uv -> contains the render coordinates
  - outputColor -> is what we need to change in order to apply the effect
- TODO: assign the uv to the outputColor and fill the other values with 1.0
- calling super() in the constructor is like calling constructor of that parent class
  - provide 3 parameters to super() *this is the constructor of Effect()*
    1. name of the effect
    2. fragment shader we wrote
    3. options in an object 

```js
import {Effect} from 'postprocessing';

const fragmentShader = /* glsl */`
  void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor)
  {
    outputColor = vec4(uv, 1.0, 1.0); //assign the uv to the outputColor and fill the other values with 1.0
    // outputColor = vec4(0.8, 1.0, 0.5, inputColor.a);
  }
`

export default class DrunkEffect extends Effect{
  constructor(){
    super(
      'DrunkEffect', 
      fragmentShader, 
      {}
    );
  }
}

```
### the React post-processing part(84min 54sec)
- create src/Drunk.js export a Drunk function as default
- this is the react 3 fiber part...
- test with just a basic mesh
- instantiate DrunkEffect() in the function.
- return a `<primitive>` with object={effect}

### Props (90min)
- in Experience, import Drunk component
- want to be able to tweak attributes
- screen will wiggle with sinus function sin() and we want to be able to tweak: amplitude and frequency
- add a frequency={2} attribute and an amplitude={0.1} on `<Drunk>`
- retrieve the props in Drunk.js: add a props parameter to Drunk function, and forward it to DrunkEffect(props)
- support reference with useRef


```js
//Drunk.js
import DrunkEffect from './DrunkEffect.jS'
import { forwardRef } from 'react'

//export default function Drunk(props){
//}

//using forwardRef, and in args, add "ref"
export default forwardRef(function Drunk(props, ref){
  const effect = new DrunkEffect(props);

  // return <mesh><boxGeometry/></mesh>  //test with just a basic mesh
  return <primitive 
    ref={ ref } 
    object={ effect } 
  />
});

```
- in experience.js, import useRef from react
- create a drunkRef
- associate the ref with `<Drunk>` using ref attribute
- NOTE: function components cant be given ref or use forwardRef
- ENDGOAL: a reference to DrunkEffect
- so in Drunk.js, import forwardRef: `import { forwardRef } from 'react'`
- Drunk.js: using forwardRef, and in args, receive ref as 2nd arg of props
- Drunk.js: add ref to the primitive
- use drunkRef to get reference to the primitive in Drunk.js

```js
//Experience.js
import {useRef} from 'react';
import Drunk from './Drunk.js';

export default function Experience(){
  const drunkRef = useRef();
  
  const drunkProps = useControls('Drunk Effect', {
      frequency: { value: 2, min: 1, max: 20 },
      amplitude: { value: 0.1, min: 0, max: 1 }
  });

  return (
    <>
    <EffectComposer>
      <Drunk 
        ref={drunkRef}
        // frequency={2} 
        // amplitude={0.1}
        {...drunkProps}
      />
    </EffectComposer>
    </>
  );

}

```

- in DrunkEffect.js, in the fragmentShader, assign the inputColor to outputColor
- because inputColor is const, save it in a new variable called "color"
- multiply the rgb channels of the color by a green color
- we are manipulating the rgb channels because wE dont want to alter the alpha channel

### Wiggle the screen
- to make it wiggle, mess with uv coordinates
- there is a uv parameter in our mainImage function that gives us the uv coordinate - but its not that one...
- we need to change the uv coordinate! and to do that implement a neW mainUv() function
- inout means - both read and write to it
- we are going to use a sin() to move the y-coordinate of the uv according to the x coordinate
- later, we use the attributes we send to `<Drunk>`
- for now, multiply uv.x and sin() by arbitrary values

#### use the attributes
- we have already forwarded the props to DrunkEffect and we can retrieve them in the constructor
- we can destructure the props to get only what we want.
- we now need to send them as uniforms and we can do that in the empty object we sent as the third parameter of super();
- the format is different than what we are used to and we need to create a Map.
- a Map is a mix between an object and an array with helpful methods and properties.
- create a uniform property in the empty object and set a Map.
- the map should take an array, each item is an array in the array with this structure: 
  `['name-of-property', {value: the-value}]`,  
- NOTE: theres actually an official way to create a Uniform: `import {Uniform } from 'three';`
- replace the object containing each uniform by an instance of Uniform.
- retrieve those uniforms in the shader
- use them in the mainUv
- since we already have Leva installed in our project, make our effect tweakable
- in Experience.js, add a useControls call, name is "Drunk effect"
- associate drunkProps with our effect
- spread it on the `<Drunk>` instead of setting each attribute manually


### blending the colors
- until now we multiplied the inputColor by a green color, but 
- we can let the developer decide on a preferred blending
- in fragmentShader, send the green color directly in the outputColor and keep the alpha from the inputColor
- Experience.js: add a blendFunction attribute to the `<Drunk>` and set it to "BlendFunction.DARKEN"
- DrunkEffect.js: retrieve the blendFunction in the destructuring of the constructor
- send it to the same object that we used for the uniforms
- we didnt set a default `blendFunction` making the screen all green by default
- in DrunkEffect.js, import BlendFunction from postprocessing
- set the default value of blendFunction to BlendFunction.DARKEN in the constructor parameter


```js
//DrunkEffect.js
import { Uniform } from "three";
import {BlendFunction, Effect} from 'postprocessing';

const fragmentShader = /* glsl */`
  uniform float frequency;
  uniform flat amplitude;
  uniform float offset;

  void mainUv(inout vec2 uv){
    uv.y += sin(uv.x * frequency) * offset * amplitude;
  }

  void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor)
  {

    // vec4 color = inputColor;
    // color.rgb *= vec3(0.8, 1.0, 0.5);
    // outputColor = color;

    //send green color directly in the outputColor
    outputColor = vec4(0.8, 1.0, 0.5, inputColor.a);
  
  }
`
export default class DrunkEffect extends Effect{
  constructor({frequency, amplitude, blendFunction = BlendFunction.DARKEN}){
    super(
      "DrunkEffect", fragmentShader, {
      blendFunction,
      uniforms: new Map([
        ["frequency", new Uniform(frequency)],    //['frequency', {value:frequency}],
        ["amplitude", new Uniform(amplitude)],    //['amplitude', {value:amplitude}],
        ["offset", new Uniform(0)]
        // ["time", new Uniform(0)],
      ]),
    }
    )
  }

  update(renderer, inputBuffer, deltaTime) {
    // this.uniforms.get("offset").value += 0.02;
    this.uniforms.get("time").value += deltaTime;
  }
}

```
### Animating (117min 57sec)
- in DrunkEffect, add an "offset" uniform to 0
- retrieve it in the fragmentShader and add it in the sin();
- add an update method to the DrunkEffect class
- the function is being called on each frame automatically
- because we used a Map, we must access the values with the get() method
- we can retrieve the elapsed time since the last frame as the third parameter of update()
- the 2 first parameters are the "renderer" and the 'inputBuffer' (dont care about these...)