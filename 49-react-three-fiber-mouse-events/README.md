# Mouse / Pointer events

### click events

- NATIVE THREEJS - handling mouse events required Raycaster - cast ray and check if there is Intersecting objects
- R3F - no need for Raycaster - add a 'onClick' attribute to an object in our scene `<mesh onClick={}>`
- event handler "event" is mix of r3f information and native js information
- clicking then moving away -> does not count as a click (all the checks are handled by r3f)
  - a click implies the pointer went down onto the object and then up again while remaining on the object.
  - if it started outside or ended outside, the event doesnt count as a click

#### Event props

console.log('---')
console.log('distance', event.distance) // Distance between camera and hit point
console.log('point', event.point) // Hit point coordinates (in 3D)
console.log('uv', event.uv) // UV coordinates on the geometry (in 2D)
console.log('object', event.object) // The object that triggered the event
console.log('eventObject', event.eventObject) // The object that was listening to the event (useful where there is objects in objects)

console.log('---')
console.log('x', event.x) // 2D screen coordinates of the pointer
console.log('y', event.y) // 2D screen coordinates of the pointer

console.log('---')
console.log('shiftKey', event.shiftKey) // If the SHIFT key was pressed
console.log('ctrlKey', event.ctrlKey) // If the CTRL key was pressed
console.log('metaKey', event.metaKey) // If the COMMAND key was pressed

### onContextMenu (right click)
- desktop -> right click
- mobile -> long press
- onContextMenu={eventHandler}

### onDoubleClick
- onDoubleClick={eventHandler}
- delay between clicks to register double click is defined by OS

### onPointerDown / onPointerUp
- when pointer is down vs when pointer is up

### R3F 
- in R3F there is no difference between onPointerOver and onPointerEnter
- in R3F there is no difference between onPointerOut and onPointerLeave

#### onPointerOver 
- parent object contains children, when interacting by moving over the parent left-to-right, you will trigger an event for each child if listening to onPointerOver
#### onPointerEnter
- will trigger only for the parent object when it cursor initially collides with object

#### onPointerOut / onPointerLeave

#### onPointerMove
- if cursor moves -> triggers event

#### onPointerMissed (18min 11sec)
- after clicking on an object, and then clicking away from the object, it will trigger this event
- can add to `<Canvas>` onPointerMissed={ () => { console.log('You missed!') } }


### Occluding 
- when there is an object in front of the one that accepts interaction, by default, the click will register
- to occlude (ignore) the click if it is obscured while clicked, you need to add mouse event on the object obscurring the view
- use event.stopPropagation: `onClick={ (event) => event.stopPropagation() }`

### Cursor
- change cursor when something is clickable
- when mouse enters object (mouse cursor to show clickable): `onPointerEnter={ () => { document.body.style.cursor = 'pointer' } }`
- when mouse leaves object (reset cursor) `onPointerLeave={ () => { document.body.style.cursor = 'default' } }`
- DREI has a useCursor helper (does the same)

### Complex object interaction
- import useGLTF from drei
- load burger with useGLTF:   `const hamburger = useGLTF('./hamburger.glb');`
- add to scene with a `<primitive>`
- registering onClick on the primitive, every mesh object of the primitive group is causing cursor intersects is triggering events... 
- testing which object was clicked on that triggered event: event.object returns the name from blender
- `event.eventObject` is the one which is listening to the event
- FIX: `event.stopPropagation()`

### MeshBounds (43min)
- helper from drei
- less accurate hit testing
- creates a theorethical sphere around the mesh (called bounding sphere) and the pointer events will be tested on that sphere instead of testing teh geometry of the mesh
- meshBounds only works on single meshes - use `raycast={meshBounds}`
- import {meshBounds } from drei

### BVH (bounding volume hierarchy)
- if you have very complex geometries but need pointer events to be accurate, use BVH
- drei has useBVH()

```js
const eventHandler = (event) => {
  console.log(event);

  //change the color
  cube.current.material.color.set(`hsl(${Math.random() * 360}, 100%, 75%)`);
};

return (
  <>
    <mesh
      position-x={-2}
      onClick={ (event) => event.stopPropagation() }
      // onPointerEnter={ (event) => event.stopPropagation() }
    >
      <sphereGeometry />
      <meshStandardMaterial color="orange" />
    </mesh>

    <mesh
      ref={cube}
      raycast={ meshBounds }
      position-x={2}
      scale={1.5}
      onClick={eventHandler}
      onPointerEnter={ () => { document.body.style.cursor = 'pointer' } }
      onPointerLeave={ () => { document.body.style.cursor = 'default' } }
      // onContextMenu={eventHandler}
      // onDoubleClick={eventHandler}
      // onPointerDown={}
      // onPointerUp={}
      // onPointerOver = {}
      // onPointerOut = {}
      // onPointerMove = {}
      // onPointerMissed ={}
    >
      <boxGeometry />
      <meshStandardMaterial color="mediumpurple" />
    </mesh>

    <primitive
        object={ hamburger.scene }
        scale={ 0.25 }
        position-y={ 0.5 }
        onClick={ (event) =>
        {
          console.log(event.object)
          event.stopPropagation()
        }}
      />
  </>
);
```
