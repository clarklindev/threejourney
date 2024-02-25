# Debugging with R3F / React

- enable strict mode
- wrap the <Canvas> in a <StrictMode>
- potential errors are shown as warnings in terminal
- strictmode is for dev mode, but in published mode, its removed
- install react-dev-tools -> developer tools -> components tab
- goto the settings for component -> components -> disable filter type (OFF) -> gives access to the messhes in component tab

```js
//index.js
import { StrictMode } from "react";

root.render(
  <StrictMode>
    <Canvas></Canvas>
  </StrictMode>
);
```

### debug ui with Leva (made by react) 12min20sec

- made by PMNDRS team
- npm i leva@0.9
- you can put it in any component
- each change in debug ui, rerender occurs
- we can destructure it in order to get only the position
- can use it in position-x attribute of mesh
- instead of input, we can have input range: send an object with specific properties to the position of the useControls

```js
import {useControls} from 'leva';

//...

// const {position} = useControls({position: -2});
const {position} = useControls({position: {
  value: -2,
  min:-4,
  max:4,
  step:0.01
}});

//...
<mesh position-x={position}>

```

### Range (22min 22sec)

A range - can be done by sending an object with specific properties to the position of the useControls:

```js
const { position } = useControls({
  position: {
    value: { x: -2, y: 0, z: 0 },
    step: 0.01,
  },
});
```

### Color (28min 40sec)
- can specify with string.
- can use a strong but the alpha channel wont work because threejs handles this with "opacity" and "transparent" properties

### Leva configuration

First, we need to add the component ourselves to our application so that we can tweak its attributes.

We can’t add it in the Experience because it is inside <Canvas> and everything in <Canvas> is intended for R3F. Instead, we need to add it in the index.jsx file outside of the <Canvas>.

- this allows us to use attributes like: `<Leva collapsed />`

In index.jsx, import Leva from leva:

```js
import { Leva } from "leva";

root.render(
  <StrictMode>
    <Leva />
    <Canvas
      camera={{
        fov: 45,
        near: 0.1,
        far: 50,
        position: [-4, 3, 6],
      }}
    >
      <Experience />
    </Canvas>
  </StrictMode>
);
```

### monitoring r3f-perf (44min)

- you can use Stats.js
- alt made by @onirenaud - more advanced solution for r3f - R3F-Perf

```console
npm install r3f-perf@7.1
```

```js
import { Perf } from "r3f-perf";
export default function Experience() {
  // ...

  return (
    <>
      <Perf position="top-left" />

      {/* ... */}
    </>
  );
}
```
