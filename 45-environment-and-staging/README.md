# Environment and staging with R3F

- changing background color methods:

1. CSS

- default background seems to be white, but thats actually transparent and ur seeing the html background

```css
//src/style/css

html,
body,
#root {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: red;
}
```

2. setClearColor on renderer (3min 20sec)

The WebGLRenderer has a method named setClearColor. It’s a way of filling the <canvas> with a color before rendering the various objects in the scene.

To use setClearColor, we need to have access to the renderer and we need to do that only once when the renderer has been created.

In index.jsx create a created function and send it to the <Canvas> attribute named onCreated:

- this takes precedence over setting background on css.

```js
const created = () => {
  console.log("created");
};

root.render(
  <Canvas
    camera={{
      fov: 45,
      near: 0.1,
      far: 200,
      position: [-4, 3, 6],
    }}
    onCreated={created}
  >
    <Experience />
  </Canvas>
);
```

#### access to renderer via "gl"
The state will be sent as an argument of the function and the "renderer will be available in the gl property":

- We can then call the setClearColor with the color as the first parameter and the alpha as the second parameter:

```js
// const created = (state) =>
// {
//     console.log(state.gl)
// }


//destructured
const created = ({ gl }) =>
{
  console.log(gl)
  gl.setClearColor('#ff0000', 1);
}
```

3. using scene background
- instead of setting the background on the renderer, set it on the scene
- then access it in the "created" function
- We can now instantiate a Color using Three.js and assign it to the background property (don’t forget to import THREE or just Color from three)


```js
import * as THREE from 'three'
const created = ({ scene }) =>
{
  console.log(scene)
  scene.background = new THREE.Color('#ff0000')
}
```

4. using R3F color to set background (9min)

- using R3F to set the color
- create a <color> inside <Canvas>
- R3F will auto create a Color instance. ie: <color> substitutes new THREE.Color()
- need to assign color: We can add an attach attribute to specify what that component should be attached to.
- we can put the code anywhere as long as the direct parent is the scene (still the case if we put it in Experience)


```js
<Canvas
  camera={ {
      fov: 45,
      near: 0.1,
      far: 50,
      position: [ 1, 2, 6 ]
  } }
>
  <color args={ [ '#00FF00' ] } attach="background" />
  <Experience />
</Canvas>
```

--- 
# Lights (13min 40sec)


```js
// r3f lights

<ambientLight />
<hemisphereLight />
<directionalLight />
<pointLight />
<rectAreaLight />
<spotLight />

```

### Light Helpers (14min 21sec)
- We can still use Three.js light helpers too.
- To do so, we are going to use useHelper from drei, but first, we need a reference to the <directionalLight>.
- useRef is already import from react to animate the cube.
- Associate it with the <directionalLight> using the ref attribute:
- Import useHelper from @react-three/drei:
- useHelper - 
  - 1st param is the reference to the light source
  - 2nd is the helper class we want to use from Three.js
- import THREE, to get access to the DirectionalLightHelper
- can call useHelper() -     useHelper(directionalLight, THREE.DirectionalLightHelper, 1);  //1 is the size of helper
- useHelper() can be used for Camera too with CameraHelper

```js
import { useHelper, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

export default function Experience()
{
    const directionalLight = useRef();
    useHelper(directionalLight, THREE.DirectionalLightHelper, 1);

    // ...

    return (
      //...
      <directionalLight ref={ directionalLight } position={ [ 1, 2, 3 ] } intensity={ 4.5 } />
  );
}
```