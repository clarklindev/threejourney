## Geometry

6 parameters

- width
- height
- depth
- width segments - subdivisions in x axis
- height segments - subdivisions in y axis
- depth segments - subdivisions in z axis

### subdivision

subdivisions correspond to how many triangles should compose a face
1 - 2 triangles per face
2 - 8 triangles per face

### vertices AND faces

- create vertices on geometry's .vertices property
- BufferGeometry is more efficient and optimized but less developer friendly

```js
/**
 * vertices for n random triangles
 *
 * (50 * 3 * 3): 50 triangles, 3 vertices per triangle, 3 components per vertex (x, y, z)
 */

const geometry = new THREE.BufferGeometry();

//float32 typed array - fixed length
const count = 50; //number of triangles

const positionsArray = new Float32Array(count * 3 * 3);
for (let i = 0; i < count * 3 * 3; i++) {
  positionsArray[i] = (Math.random() - 0.5) * 4;
}

const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3); //3 values for each vertex

geometry.setAttribute("position", positionsAttribute);

const material = new THREE.MeshBasicMaterial({
  color: 0xff0000,
  wireframe: true,
});

const mesh = new THREE.Mesh(geometry, material);

scene.add(mesh);
```
