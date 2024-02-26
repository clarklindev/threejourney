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

