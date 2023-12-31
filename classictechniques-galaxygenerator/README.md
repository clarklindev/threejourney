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

#### which angle to place object

- divide by branches to give number between 0 and 1 (circle ratio)
- half circle is Math.PI (3.14)
- full circle is 2 Math.PI (to get angle, we just multiply ratio by 2PI) (2x 3.14 = 6.28)
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

- spinAngle - particles (stars) closer to center of galaxy should move (spin) slower than edge

```js
//UPDATED CODE:

parameters.spin = 1;

const radius = Math.random() * parameters.radius;

const branchAngle =
  ((i % parameters.branches) / parameters.branches) * Math.PI * 2;

//for each star
const spinAngle = radius * parameters.spin;

positions[i3 + 0] = Math.cos(branchAngle + spinAngle) * radius;
positions[i3 + 1] = 0;
positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius;
```

### Randomness

- we want particles to spread more on the outside.
- create a random value for each axis and multiply it by the radius and randomness parameters then apply them to the position.
- basically, we want the disperse effect where the concentration of stars is intense closer to center.
  this can be achieved and controlled with prop params using Math.pow(A, B) where higher B values will give smaller result values (meaning closer to "core" / guide / normal).
- gui.add(parameters, "randomnessPower").min(1).max(10).step(0.001).onFinishChange(generateGalaxy);
- then apply the power with Math.pow() and multiply it by -1 randomly to have negative values too.
- NOTE: cant use negative values so first calculate Math.pow() then multiple by -1 randomly to get negative values too.

```jsx
parameters.randomness = 0.2;

gui
  .add(parameters, "randomness")
  .min(0)
  .max(2)
  .step(0.001)
  .onFinishChange(generateGalaxy);

const radius = Math.random() * parameters.radius;

const branchAngle =
  ((i % parameters.branches) / parameters.branches) * Math.PI * 2;

//for each star
const spinAngle = radius * parameters.spin;

const randomX =
  Math.pow(Math.random(), parameters.randomnessPower) *
  (Math.random() < 0.5 ? 1 : -1);
const randomY =
  Math.pow(Math.random(), parameters.randomnessPower) *
  (Math.random() < 0.5 ? 1 : -1);
const randomZ =
  Math.pow(Math.random(), parameters.randomnessPower) *
  (Math.random() < 0.5 ? 1 : -1);

positions[i3 + 0] = Math.cos(branchAngle + spinAngle) * radius + randomX;
positions[i3 + 1] = randomY;
positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;
```

#### Color

- activate the vertexColors:true on the material.
- create a third color (inside for-loop) by cloning the colorInside and use the lerp() method to mix it with the colorOutside.
- lerp() is the crossfade between colors

```js
parameters.insideColor = "#FF6030";
parameters.outsideColor = "#1b3984";

const mixedColor = colorInside.clone();
mixedColor.lerp(colorOutside, radius / paramters.radius);

gui.addColor(parameters, "insideColor").onFinishChange(generateGalaxy);
gui.addColor(parameters, "outsideColor").onFinishChange(generateGalaxy);

const colors = new Float32Array(parameters.count * 3); //rgb

//colors
const mixedColor = colorInside.clone();
mixedColor.lerp(colorOutside, radius / parameters.radius);

colors[i3 + 0] = mixedColor.r; //r
colors[i3 + 1] = mixedColor.g; //g
colors[i3 + 2] = mixedColor.b; //b

for(...){
  color[i3 + 0] = 1;
  color[i3 + 1] = 0;
  color[i3 + 2] = 0;
}

//MATERIAL
material = new THREE.PointsMaterial({
  size: parameters.size,
  sizeAttenuation: true,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
  vertexColors: true,
});
```
