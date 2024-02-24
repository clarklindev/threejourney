# 47 - 3D text

- Text3D from drei
- need typeface font (/public/fonts/helvetiker_regular.typeface.json)
- to use custom font (gero3.github.io/facetype.js)
- add `<Text3D>` with "font" attribute
- MeshBasicMaterial is applied, can change the material
- Text3D: all paramters that we can use to create the TextGeometry can be set as attributes

#### Centering
- instead of offsetting the geometry itself, use `<Center>` from drei

#### material - matcap
- TODO: load matcap texture
- drei helper to load matcap textures: useMatcapTexture automatically from https://github.com/emmelleppi/matcaps
- import useMatcapTexture from drei
- to use a matcap, you go to the https://github.com/nidorx/matcaps/tree/master website and get the ID which will be a prop of useMatcapTexture('ID', 256)
- 2nd parameter is the desired width: 64, 128, 256, 512, 1024
- text3d triggers a re-render
- useMatcapTexture returns an array and we need the fist value (the texture)
- replace `<meshNormalMaterial>` with a `<meshMatcapMaterial>` and use the matcapTexture on the mapcap attribute

```js
import { useMatcapTexture, Center, Text3D } from "@rect-three/drei";

export default function Experience() {

  const [matcapTexture] = useMatcapTexture('7B5254_E9DCC7_B19986_C8AC91', 256);

  return (
    <>
      <Center>
        <Text3D
          font="./fonts/helvetiker_regular.typeface.json"
          size={ 0.75 }
          height={ 0.2 }
          curveSegments={ 12 }
          bevelEnabled
          bevelThickness={ 0.02 }
          bevelSize={ 0.02 }
          bevelOffset={ 0 }
          bevelSegments={ 5 }
          // material={ material }
        >
          HELLO R3F
          <meshNormalMaterial/>
        </Text3D>
      </Center>
    </>
  );
}
```
