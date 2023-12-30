# galaxygenerator

- BufferEGeometry -
- note for GUI editor - we use .onFinishChange() - calls function on interaction finish
- need to cleanup old galaxies from scene

```js
// destroy old galaxy
if (points !== null) {
  geometry?.dispose(); //free memory for geometry
  material?.dispose();
  scene.remove(points); //clearing points from scene
}
```

- to create galaxy:

  1. place stars on straight line - define a radius, then place stars between 0 and the radius

```js
const radius = Math.random() * parameters.radius;
position[i3 + 0] = radius;
position[i3 + 1] = 0;
position[i3 + 2] = 0;
```
