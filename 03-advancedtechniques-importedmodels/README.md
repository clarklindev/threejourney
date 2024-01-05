# 23 - Imported Models

- importing models into THREEjs
- use 3d software for complex modeling

### Formats

- https://en.wikipedia.org/wiki/List_of_file_formats#3D_graphics

- popular formats:
  - 3DS (3dstudio max)
  - GLTF (becoming standard) - made by Khronos group (opengl, webgl, vulkan)
    - companies backing Khronos (AMD, Nvidia, Apple, Google, Nintendo)
    - supports geometries and others like (camera, lights, scene, animations, skeletons)
    - various file formats (json, binary, embed textures)

#### GLTF formats

    - glTF
    - glTF-binary
    - glTF-Draco
    - glTF-Embedded

##### gltf

- multiple files in export
  - .gltf (json with properties/data)
  - .bin (has geometries, uv coordinates, vertex positions, colors etc)
  - .png (texture)
- load the gltf which then references the .bin and .png

##### gltf-binary

- only one file containing all data above
- binary file
- easier to load
- harder to modify data

##### gltf-draco

- like gltf but lighter
- buffer data is compressed

##### gltf-embedded

- json
- like gltf but instead of multiple files, the files are embedded as base64 data
- heavier as it is the combination of all the output files
