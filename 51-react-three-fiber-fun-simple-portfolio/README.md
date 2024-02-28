# 51 - react-three-fiber-fun simple portfolio

- create `<color>` set bg and attach="background" 
- load free 3dmodels from: https://market.pmnd.rs/
  - model file - https://market.pmnd.rs/model/macbook
  - CDN Link (tutorial) - "copy direct link": https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/macbook/model.gltf
- in Experience.js, import {useGLTF} from '@react-three/drei';
- load the model with useGLTF
- add it with a `<primitive>` and object attribute

### lighting and environment (11min 30sec)
- environment lighting with "Environment" helper from drei - lights model using lighting from environment helper
- import {Environment} 
- add it to scene with "preset" value "city"

### floating animation - make the model move a little
- make laptop move slowly
- center laptop to middle of scene: `position-y={-1.2}`
- `<Float>` helper from Drei - wrap the `<primitive>`
- lower float intensity - rotationIntensity = {0.4}

### Camera and Position with `<PresentationControls>`
- restricting users ability to move the model
- PresentationControls - Drei helper letting you manipulate model instead of camera
- rotate the model, releasing it, it goes back to initial position 
- remove `<OrbitControls>`
- add `<PresentationControls>` around `<Float>`

### Global scene interaction (1min 29sec)
- globally be able to interact with scene instead of just touching the model.
- add "global" prop: `<PresentationControls global>`

### Fixing the mobile gesture issue (19min)
- the issue is that on mobile, you finger is fighting for interaction actions with mobile interface.
- PresentationControls uses "use-gesture" library to interact with elements using natural gesture
- TODO: in the css for `canvas`,  touch-action: none
- READ: https://use-gesture.netlify.app/docs/extras/#touch-action

### Rotation (22min)
- can change the default rotation via "rotation" attribute on PresentationControls
- can limit the rotations of both horizontally and vertically
- the vertical one is named "polar" and we must send an array of 2 values (minimum and maximum)
- horizontal one is named "azimuth" works the same

### Spring configuration (24min)
- tweak the physics of the animation
- PresentationControls uses "Spring" for animation (https://react-spring.dev/docs)

There are 2 different string configurations:
  1. when drag-and-dropping can be set with "config": config={{mass:2, tension:400}}
  2. when releasing - snap resets animation: snap={{mass:4, tension:400}}

### Shadow (26min 37sec)
- Drei has `ContactShadows`
- add it outside of PresentationControls
- move it down with "position-y"

### iFrame (28min)
- using iFrame to add html to 3d model
- you need an html website: https://bruno-simon.com/html
- make sure surver allows url as an iFrame
- want to make iFrame follow 3d model as if its part of the WEBGL scene, use "Html" helper from "drei"
- add it inside the primitive so the html sticks to the laptop model
- replace the text by an `<iframe src="websiteurl here...">`

### Transform
- we want iframe to transform itself as if its part of the scene.
- on html add attribute "transform" `<Html transform>`
- it seems transform as a child, follows x,y,z of the model (parent)

### Size
- it shouldnt be a small iframe with contents stretched.

- 1. make iframe bigger (css) 
  - decide on a size that will make the content inside the iframe look decent
  - on `<Html transform wrapperClass="htmlScreen">` add a class
  - in css: 
  - src/style.css add "width" and "height" attributes
  - remove border on iFrame
  - add border-radius
  - add background to iframe (default: white)

  ```css
  .htmlScreen iframe
  {
      width: 1024px;
      height: 670px;
      border: none;
      border-radius: 20px;
      background: #000000;
  } 
  ```
  - need to make the element smaller (can use attribute "distanceFactor")

- 2. position and rotation
  - move iframe against the screen of the model
  - position={[0, 1.56, -1.4]} (relative to the model)
  - rotate on x-axis with rotation-x (rotation-x: 0.256)

### screen light
- light of screen should iluminate the laptop
- add more realism by adding a orange RectAreaLight at the screen position so that we can see the light reflected on the laptop keyboard.
- add RectAreaLight inside `<Float>`

### title for the image
- Text helper from 'drei'
- the iframe is ontop of the `<canvas>`
- font - can pick from google font / Google Webfonts Helper (gives .woff files)

```js
//Experience.js
import {Text, Html, ContactShadows, PresentationControls, Float, Environment, useGLTF} from '@react-three/drei';

export default function Experience() {
  const computer = useGLTF('https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/macbook/model.gltf');

  return (
    <>

      {/* <OrbitControls makeDefault /> */}

      <Environment preset="city" />

      <color args={["#241a1a"]} attach="background" />
      
      <PresentationControls 
        global
        rotation={ [ 0.13, 0.1, 0 ] }
        polar={ [ - 0.4, 0.2 ] }  //vertical limitations
        azimuth={ [ - 1, 0.75 ] } //horizontal limitations
        config={{mass:2, tension:400}}
        snap={{mass:4, tension:400}}
      >
        <Float rotationIntensity = {0.4}>

          <rectAreaLight
            width={ 2.5 }
            height={ 1.65 }
            intensity={ 65 }
            color={ '#ff6900' }
            rotation={ [ - 0.1, Math.PI, 0 ] }
            position={ [ 0, 0.55, - 1.15 ] }
          />

          <primitive object={ computer.scene } position-y={-1.2}>
            <Html transform
              wrapperClass="htmlScreen"
              distanceFactor={1.17}
              position={[0, 1.56, -1.4]}
              rotation-x={-0.256}
            >
              // iFrame here..
              <iframe src="https://bruno-simon.com/html"/>
            </Html>
          </primitive>

          <Text
            font="./bangers-v20-latin-regular.woff"
            fontSize={ 1 }
            position={ [ 2, 0.75, 0.75 ] }
            rotation-y={ - 1.25 }
            maxWidth={ 2 }
            textAlign="center"
          >
            BRUNO SIMON
          </Text>

        </Float>
      </PresentationControls>    

      <ContactShadows
        position-y={ - 1.4 }
        opacity={ 0.4 }
        scale={ 5 }
        blur={ 2.4 }
      /> 
    </>
  );
}
```
