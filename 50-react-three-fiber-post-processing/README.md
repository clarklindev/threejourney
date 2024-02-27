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
