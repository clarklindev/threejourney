# custom models with Blender

- Blender is free
- good performance
- light
- cross platform OS
- big community
- many updates

- download blender (current v 4.2) (https://www.blender.org/download/release/Blender4.0/blender-4.0.2-windows-x64.msi/)

- shortcuts are viewport sensitive
- drag / split area by corner -left and bottom-right and drag
- unsplit by dragging back FROM -> TO panel
- use gizmo to change view

#### SHORTCUTS

https://threejs-journey.com/lessons/custom-models-with-blender#shortcuts

https://docs.google.com/document/d/1wZzJrEgNye2ZQqwe8oBh54AXwF5cYIe56EGFe2bb0QU/edit

- F3 search for command

- SHIFT-A - menu
- X - delete
- NUM 1 - y AXEs
- NUM 3 - x AXEs
- NUM 7 - z AXEs
- SHIFT-C - reset/re-center view
- select object + (NUM + .) - focus on object
- select object + (NUMPAD /) - and hide everything else
- 0 - focus view on camera's view (for renders)
- A - select all
- B - select with rectangley
- C - select with circle (mouse wheel)
- H - hide oject
- ALT+H - unhide all hidden
- T tools menu
- when creating an object, use the small panel in the bottom left corner to tweak. re-open with F9
- G - change position
- G + (X / Y / Z) change only on that axes
- R - rotation
- R + (X / Y / Z) change only on that axes
- S - scale
- S + (X / Y / Z) change only on that axes

### Change modes

- CTRL + tab - change to different mode
- OR use top-left select button of any 3d viewport area.

#### types of modes

- object mode - create/delete/transform objects
- weight paint -
- vertex paint -
- texture paint -
- edit mode - edit vertices
- sculpt mode -

##### edit mode

- similar to object mode but we can edit the vertices, edges, and faces.
- KEY1 - vertices
- KEY2 - edge
- KEY3 - faces
  keyboard 1,2,3 to switch - tab to exit

### Shading - Modes

- Shading is how you see objects in 3D viewport - default (solid)
- z - change the shading with the buttons on the top-right corner of the 3D viewport or Z

- solid (default)
- material - see color / textures
- wireframe
- render - realistic/high quality - less performant

- dull scene probably requires point light -> add point light (SHIFT+A (menu)) -> set power

### modifiers

- like a filter
- non-destructive modifications like subdivide, bend, grow, shrink

### material properties (add new material)

- there is a default material

### render engines

- render properties tab
- 3 types of render engine
- F12 - to render scene

#### eevee

- realtime render engine
- uses the gpu like three.js
- performant
- limitations like realism, lightbounce, reflection, refraction

#### workbench

- legacy render engine
- not used a lot
- performant
- not very realistic

#### cycles

- raytracing engine
- very realistic
- handles light bounce, deep reflection, deep refraction
- can be tremendously long

### create startup setup

- file -> defaults -> save startup file
- validate the confirmation menu

### my render

- decide on a unit as one meter
- goto scene properties tab of properties -> choose none as unit system

#### burger time

##### BOTTOM BUN

- start from a cube
- add subdivision surface (MODIFIER (wrench icon) -> generate -> subdivision surface)
- add more subdivision in the subdivisions -> viewport field
  subdivisions -> levels viewport (value:4)
- right-click on the sphere and choose (shade smooth)
- to get back to normal choose (shade flat)
- subdivision modifier rounds everything
- toggle between edit mode and object mode (CTRL+TAB) or TAB
- we made a cube a sphere with the modifier but still edit it as a cube because its easier
- select face (key 3)
- in EDIT mode -> select the bottom face
- G + select vertices
- z (move only on z axes) and squeeze flat by dragging the helper Y-arrow
- divide shape in horizontal (to add more edges/vertices)
  - add a loop cut with (CTRL + R) OR F3 -> SEARCH loop cut
- need to select orientation to cut object
  - click once
  - then you can move to check where to cut

##### MEAT

- in (object mode - so that it creates a collection - cube layer )
- SHIFT+D - DUPLICATE BOTTOM BUN
- G (position) and select vertices and scale until it looks like a patty

##### CHEESE

- in (object mode - so that it creates a collection - plane layer )
- create plane
- PROPORTIONAL EDITING (O) - select corner of cheese and select proportional editing (circle icon )
- proportional editing falloff -> sharp
- then use mouse-wheel to change how much effect it has
- can select all edges at once and move
- change to smooth shape (right click )
- thickness -> add modifier -> generate -> solidify -> thickness 0.08
- OBJECT DATA PROPERTIES (upsidedown triangle icon)-> NORMALS -> AUTOSMOOTH 30 deg
  - this does smoothing on faces when angle is less than 30 deg.

##### top bun

- duplicate bottom bun
- rotate (R) and while holding down + X + CTRL (magnetic values)

##### color the render

- materials -> create material for each

  1. bun
  2. meat
  3. cheese

- roughness -> crank full
- color -> base color

### Exporting the burger

- select only the burger (not the lights etc)
- file -> export -> GLTF 2.0
  (it should save as .glb binary file) options are:
  - binary
  - embbeded,
  - separate binary + bin + texture
- select remember export settings
- transform -> Y is up -> selected
- geometry
  -> apply modifiers (selected)
  -> normals (selected)
  -> vertex colors
- compression (selected) - this is the draco compression
- animation (select if you have animation)

- put file in static folder (public (in vite))
