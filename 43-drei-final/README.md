# DREI

https://github.com/pmndrs/drei

```cmd
npm i @react-three/drei@9.32   or @latest
```

```js
import {
  MeshReflectorMaterial,
  Float,
  Text,
  Html,
  PivotControls,
  TransformControls,
  OrbitControls,
} from "@react-three/drei";
```

- OrbitControls via drei
- TransformControls via drei
  - note: you can play with mode="" prop like: 'rotate, scale, translate etc'

```js
<TransformControls>// put mesh here</TransformControls>
```

Problems:

1. - gizo should be at center of object not scene (esp when object is moved, should move with object)
   
- fix 1 (PREFFERED - more elegant method): separate them and re-associate them using a reference and an attribute
  - associate it with the <mesh> using the ref attribute
  - add it to the object attribute of the `<TransformControl/>`
  - makes the cube `<mesh>` and its positions independent from `<TransformControl/>`
  - deactivate `<TranformControl>` without side effect

```js
const cube = useRef();

<mesh ref={cube} scale={1.5} position-x={2}>
  <boxGeometry />
  <meshStandardMaterial color="red" />
</mesh>
<TransformControls object={cube} mode="translate"/>
```

  - fix 2 move the "position" transform to the parent `<TransformControls position-x={2}>`
```js

<TransformControls position-x={2}>
  <mesh scale={1.5}>
    <boxGeometry />
    <meshStandardMaterial color="red" />
  </mesh>
</TransformControls>

```

2. - when moving camera gizmo currently also moves
  - in threejs if you have orbit controls and say some interactive object, there is conflict of what gets mouse commands
  - fix: add "makeDefault" to Orbit Controls so by default, it gets interactivity UNLESS another object that also has interactivity is interacted with

```js
<OrbitControls makeDefault />
```  

### Pivot controls
- alternative solution to TransformControls 
- looks good
- wrap the whole mesh inside `<PivotControls></PivotControls>`
- doesnt work as a group like for TransformControls
- if you want it to be at center of the sphere, have to change its position using the anchor attribute
- add the anchor attribute and set it to [0,0,0]
- but placing it here hides it because of 'depthTest' as it is inside the object...YOU SHOULD SET DEPTHTEST to false so it renders ontop.
- NOTE: the anchor is RELATIVE to the object itself, set anchor attribute to [0,1,0] and see its positioned at top of `<mesh>`
- can control the look: like thickness of the lines with lineWidth, the color of the axes with axisColors or size with scale.
- PivotControls has perspective, scales with the object.
- can change fixed={true} to fix the scale but then adjust scale (which is actually in PIXELS)

```js
import {PivotControls, TransformControls, OrbitControls} from "@react-three/drei";

<PivotControls 
  anchor={[0,0,0]} 
  depthTest={false}
  lineWidth={4}
  axisColors={['#FF0000', '#00FF00', '#0000FF']}
  scale={100}       //100px
  fixed={true}
>
  <mesh>
    {...}
  </mesh>
</PivotControls>
```