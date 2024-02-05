# Creating a scene in blender

- learning BAKING (technique uses RayTracing for shadows, colors, ambient occlusion)
- Ray Tracing - casting multiple rays in many directions, multiple times to simulate indirect lighting - the rays will collide with objects and refract light back
- realistic, but takes time not available to us in THREE.js (which has to render 60fps - cant use ray tracing)
- the idea of baking is to save those awesome ray tracing renders (with good lighting) as textures that we then place onto the geometries in the scene.
- no light, no realtime shadows, just texture being placed on the geometries. - good for performance.
- Drawbacks 
  1. have to bake everything in 3d software
  2. have to load the textures
  3. lights arent dynamic (baked)
- you can also mix baked and unbaked techniques

### Process
- create scene in 3d software
- optimize all the objects
- UV wrap everything (UV UNWRAPPING)
- Bake the render into textures (BAKING)
- export the scene and the textures
- import everything in three.js and apply the texture on the mesh
- use Blender (currently 4.0.3) to create our scene, bake it and export it.

### Setup
- create a basic scene - object, light, camera  
- point light - change renderer engine to CYCLES (from Eevee): render properties -> CYCLES
- delete the cube

### Floor (18min.18sec)
- create plane (SHIFT+A -> mesh -> plane)
- scene properties tab -> units -> unit system -> none
- 4 x 4

### Gates (20min.25sec)
- create one geometry and then duplicate 6x

### first render (27min)
- SEE WHAT CAMERA SEES - on the view (NUM 0)
- preview render - Z and select RENDERER
- renderer - CYCLES
- render - F12 (or F3 (search) -> render)

### tree trunks (35min.31sec)
