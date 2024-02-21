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

2. setClearColor on renderer

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