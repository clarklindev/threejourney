# React Three Fiber - game

- separating files (Level.jsx)
- physics @react-three/rapier (npm install @react-three/rapier@1.1)
- instead of passing "geometry" and "material" as child elements, pass as props

```js
<mesh geometry={boxGeometry} material={obstacleMaterial} />
```

### Startblock (6:51)

- position configured via props to make it generic
- add thickness to the planes (required for physics)
- configured via props

### Geometry (14:22)

- BoxGeometry for blocks
- to reuse geometry (1,1,1), put scale on the mesh

### Material (17:22)

- floor1Material (start, end) blocks ("limegreen")
- floor2Material trap blocks ("greenyellow")
- obstacleMaterial - obstacles ("orangered")
- wallMaterial - walls ("slategray")

### Obstacle Physics (22:20)
- RigidBody
- wrap obstacle mesh with <RigidBody>
- DO NOT wrap floor mesh with <RigidBody type="fixed"> 
- <RigidBody type="kinematicPosition"> - kinematicPosition - the obstacle needs to move at constant speed without being affected by outside forces
- create ref to obstacle
- use useFrame() to animate
- in useFrame(state) get time from state `const time = state.clock.getElapsedTime();`

### Rotating objects (25:30 -> 32:36)
- use time as angle to rotate. to rotate, use "setNextKinematicRotation()" 
- expects a quaternion, create a quaternion from a Euler
- randomize speed of rotation by multiplying time by random value (useState: speed)
- fixate time to 2 values: if its below 0.5 -> speed * -1 , else change direction -> speed * 1

```js
const [speed] = useState(()=> Math.random() + 0.2 * Math.random() < 0.5 ? -1 : 1);

useFrame((state)=>{
  const time = state.clock.getElapsedTime();
  const rotation = new THREE.Quarternion();
  rotation.setFromEuler(new THREE.Euler(0, time * speed, 0));
  obstacle.current.setNextKinematicRotation(rotation);
});

```

### Translate objects (32:21)
- limbo trap block moves vertically
- use setNextKinematicTranslation()
- repeated up and down movement with Math.sin() and time
- same animation speed, but timeOffset will be different
