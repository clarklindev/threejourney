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

### Pivot controls (21min)
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

### LABELS - html text (30min 51sec)
- html adds a DOM element that will stick to your object
- add a `<Html>` anywhere in JSX and write any text you want in it
- we an add it to a `<mesh>`, a `<group>` or anything that inherits from Object3D
- put it in the sphere `<mesh>`
- we can offset with the "position" attribute
#### label (class and style)
- we can add style to it, but we are going to add a class first in order to target it in CSS
- add a wrapperClass attribute
- in style.css add some css by targeting the div inside .label
- center it on itself with the center attribute
- we can simulate perspective with distanceFactor attribute
- we can hide it (LABEL) when objects are in front of it with "occlude" attribute, to use occlude, you first need a reference to the various objects that can occlude the label
- we already have the cube reference but not the sphere
- create a "sphere" ref with "useRef" and associate it with the "<mesh>" using the "ref" attribute
- send the references as an array to the occlude attribute: occlude={[sphere, cube]} (this means there objects are allowed to obscure the view)

```js
import {Html} from "@react-three/drei";

const sphere = useRef();

//...

return (
  <mesh ref={sphere} position-x={-2}>
    <sphereGeometry />
    <meshStandardMaterial color="orange" />
    <Html
      position={[1, 1, 0]}
      wrapperClass="label"
      center
      distanceFactor={8}
      occlude={[sphere, cube]}
    >
      That's a sphere 👍
    </Html>
  </mesh>
);
```

```css
.label > div
{
  font-family: Helvetica, Arial;
  position: absolute;
  background: #00000088;
  color: white;
  padding: 15px;
  white-space: nowrap;
  overflow: hidden;
  border-radius: 30px;
  user-select: none;
}
```

### Text (adding text in 3d)
- SFD Fonts

#### Native Three.js solution
- in three.js native, we use 3d TextGeometry class
- problems: noticing polygons, takes cpu resources, fonts dont look good, no line-break support

#### SDF Fonts (41min 46sec) Explained
- used in fragment shaders to draw shapes
- we send a 2d or 3d point to an sdf shape function that returns how far the point is from the shape.

- explaination (remember the Shader pattern lessons..that would be the SDF function to draw a circle):
  - imagine you want to draw a simple disc on a flat plane
  - we get the distance of the UV coordinate (the fragment we are drawing) to the center of the disc
  - we decide on a radius
  - if the distance we got earlier is less than the radius, we are in the disc and we can draw the pixel
  - if the distance exceeds the radius, we have moved beyond the disc and we draw nothing

- it gets more complicated for more complex shapes (especially 3d)
- Inigo Quilez (https://iquilezles.org/) wrote a good article with good examples of SDF functions (https://iquilezles.org/articles/)
- developers have created scripts that generate textures containing the distance information for each character of a font
- we can use that texture to indicate the distance between the fragment we are drawing and the supposed character.
- if the distance is closer to a specific value, we draw the text, otherwise we draw nothing.
- the values saved in the texture is the distance betweeen the point we are drawing and the character (center of character)
- this enables features:
  - change the thickness
  - adding an outline
  - adding a blur
  - drawing huge text
  - having a lot of words while using the same collection of characters
- the "natural interpolation between pixels" (meaning guessing whats inbetween 2 pixels) makes the technique work with huge texts
- some developers have dont most of the heavy lifting in the Troika library (and more precisely troika-three-text) and drei is implementing that solution in the Text helper

#### SDF Fonts (implementation) (58min 31sec)
- import Text from @react-three/drei
- add `<Text>` anywhere in the scene
- default font is Roboto (google fonts CDN)
- you can put fonts in public/ 
- files provided in the "public/" dir are accessible as if they are in the same folder as the website root url 
  eg. localhost:3000/bangers-v20-latin-regular.woff
- Troika supports woff, tt, otf formats, woff is usually lighter
- can convert fonts with fontsquirrel
- google webfonts helper helps convert google fonts
- can change the size of the font
- can change color
- can play with position, rotation, scale
- can limit the width to see the line breaks with the maxWidth attribute
- can center the text
```js
import {

  Text,

} from "@react-three/drei";

<Text 
  font="./bangers-v20-latin-regular.woff" 
  color="salmon" 
  fontSize={1}
  position-y={2}
  maxWidth={2}
  textAlign="center"
>hello</Text>

```
### Float
- float makes object float like a baloon in the air 
- wrap it around <Text> 
- play with speed
- play with floatIntensity

```js
import {Float} from '@react-three/drei'
<Float speed={5} floatIntensity={2}>
  <Text></Text>
</Float>
```

### Reflections
- reflections in webgl are complicated, but "MeshReflectorMaterial" isnt
- replace `<meshStandardMaterial>` of the floor with `<MeshReflectorMaterial>` without the color attribute
- MeshReflectorMaterial wont work well with non-planar meshes *(ie it works well with a plane floor)
- set the resolution attribute to 512 to improve the quality
- control blurryness of reflection 
- set the blur to [1000, 1000] and the mixBlur to 1 to make the reflection blurry
- add mirror effect (reflection "alpha") - add a mirror attribute of 0.5 to make the reflection clearer
- add color back in if you want to add a tint to your plane

```js
import { 
  MeshReflectorMaterial,
} from '@react-three/drei'

<mesh position-y={-1} rotation-x={-Math.PI * 0.5} scale={10}>
  <planeGeometry />
  <MeshReflectorMaterial
    resolution={512}
    blur={[1000, 1000]}
    mixBlur={1}
    mirror={0.5}
    color="greenyellow"
  />
</mesh>

```