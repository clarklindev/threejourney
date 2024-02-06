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
- / key - focus on object and hide everything else

### tree trunks (36min.22sec)
- cylinder 

### tree cutting / logs (41min.39sec)
- NEW cylinder -> cap fill type -> triangle fan (this is regarding how the faces that make up the ends of log are shaped)
- select vertices and F (to complete the face)

### Axe (54min)
loop cut to create subdivision - vertices mode -> select one vertice on the object -> CTRL + R -> use mouse to adjust number of divisions -> left click + move to OFFSET -> SET with right click
- edit mode -> (B + drag select) bottom left + bottom right vertices to multi-select on X axis (front and back vertices).
- move the remaining inner vertices slightly up 

### street light (64min.50sec)
inssets -> select faces then press "i" (i for insets) - DONT MOVE THE MOUSE - then click again 
- note the inset window
- select "individual" to do inset on each individual face
- e + rightclick to show the extrude menu
  - 1. change orientation -> normal
  - 2. also change transform pivot point -> individual origins
- separate the lamp from lamp frame

### Rocks (82min 53sec)
- start with cube
- set origin to base - so its level with the floor
- cut shape using bisect tool: tools -> bisect
OR
- (in edit mode)... F3 (search: Bisect)
OR
- menu -> mesh -> bisect

- in edit mode, select EVERTHING ie all vertex of geometry (once in edit mode, press A)
- drag and drop while bisect tool is active
- "clear outer" OR "clear inner"
- fill
- before doing another bisect have to select everything again

### Portal (95min 51sec)
- create cube - make brick origin far above geometry so it can span like clock around circumference
- OBJECT MODE -> ALT + D (LINKED duplicate) AND (R) to rotate at same time + Y (ONLT ON Y)
- F3 (search "repeat last") or (Shift + R)

### the actual portal
- create circle -> CTRL+A -> mesh -> circle -> fill type: triangle fan
- create a constraint on the camera to track plane
- material view on main window -> viewport shading
- select plane, material -> base color
- roughness-> max

### Material
- select all you want to color 
    AND THEN select one with the color to get from -> apply material from active one to selected CTRL + L -> LINK MATERIALS
- light 
  -> material -> surface -> emission 
  -> strength -> 80

  