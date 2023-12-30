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

#### galaxy branches

- branches should be equidistant from each other
- to calculate which branch the star should go, calculate branch = star modular the number of branches (eg. 100 % 3)
- divide by branches to give number between 0 and 1 (circle ratio)
- half circle is Math.PI
- full circle is 2 Math.PI (to get angle, we just multiply ratio by 2PI)
- to position things on the circle, use cos and sin on the axes (by default the radius is 1)

```js
const radius = Math.random() * parameters.radius;

const branchAngle =
  ((i % parameters.branches) / parameters.branches) * Math.PI * 2;

positions[i3 + 0] = Math.cos(branchAngle) * radius;
positions[i3 + 1] = 0;
positions[i3 + 2] = Math.sin(branchAngle) * radius;
```

#### Spin

- particles (stars) closer to center of galaxy should move (spin) slower than edge

```js
parameters.spin = 1;

//for each star
const spinAngle = radius * parameters.spin;

positions[i3 + 0] = Math.cos(branchAngle + spinAngle) * radius;
positions[i3 + 1] = 0;
positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius;
```
