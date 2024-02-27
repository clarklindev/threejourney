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