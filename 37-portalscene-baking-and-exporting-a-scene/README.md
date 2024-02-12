# 37 Portal scene - baking and exporting a scene

- optimize before baking by removing geometry faces that viewer cannot see in rendered image (faces facing floor)
- with UV unwrapping, you need every geometry to have its own wrap texture especially if its placed at different position - thats why it cant be linked geometry
- FIX: select ALL -> menu -> OBJECT -> relations -> make single user -> object & data 

### 37 portal scene - baking and exporting
- FIX REMOVE LINKED DUPLICATES: select ALL -> menu -> OBJECT -> relations -> make single user -> object & data 
- FIX Face orientations:
    - geometry with faces wronly oriented appear black

### how do you know which geometry is wrongly oriented (19min)
    - usually only front facing rendered (unless doubleside is selected) - but when baking, its different

#### 17min.40sec
    - fix: in object mode -> go into solid shading -> viewport overlays (interface main top right) -> geometry -> face orientation 
    - this shows wrongly oriented faces: blue === good, red is flipped 
    - how does this even happen??? most likely when you do an extrude in the wrong direction
    - THE FIX: select geometry -> edit mode -> / to isolate geometry -> select all "RED" faces (those are the problem faces) -> F3 (search "Flip") OR Mesh -> Flip
    - search (F3 + "recalculate outside")
    OR 
    - select geometry -> go into edit mode -> vertices -> select the vertices of the missing face, click "F" to fill, then select the whole shape -> (F3 + "flip") -> then remove the bottom face of the correctly flipped geometry
    - ensure everything is Blue before moving on - the flate single faces should have correct side showing blue -> turn off face orientation

### scaling issues (22min 22sec)
- you want to keep the scale of geometries at 1.0
- if you scale, scale in edit mode! 
- if you scale in "object mode" - it changes the scale and you have problems when doing uv unwrap because blender doesnt take into consideration scale of gemetry on the scene, only scale on the settings.
- fix: scale in "edit mode"

#### normalize the objects (24min 37sec)
- make everything scale of 1x: select all objects -> apply stuff (CTRL + A) -> scale (this will normalize all objects scale to 1)

### UNWRAP the scene (26min 15sec)
- objects on scene should be "linked duplicates" so that when you unwrap, all get unwrapped.
- fix, remove old and duplicate geometry with an unwrap

2 techniques
1. - auto smart unwrap (fast, not optimized) - for complex objects
2. - manual (slower, but optimized) - simple objects

- NOTE: unwrap is always in (geometry edit mode + U) to unwrap

#### uv editor area (28min 37sec)
- "uv sync selection" icon -> ensures viewports are nsync

#### fence (35min30 - 42min) - mark seams
- telling blender it can split the unwrap parts... think folding pattern where would the cuts be
- REPEAT: edge mode -> select edges 
- "U" -> "mark seam" (becomes red) / "clear SEAM" (unselect)
- try cutting on hidden edges
- select an edge then CTRL+L , it should select the whole item  -> then (U -> unwrap)
- unwrap -> can add margins to space out the unwraped geometry (0.045 margin is good)

#### group unwrap 40min.36sec
- select all geometry 
- "U" -> unwrap -> set a margin to create space between items

### separate the emission materials (light emitting materials)
-  because we wont bake this...

### Rocks (62min)
- select all rocks 
- go in edit mode
- "u" -> smart UV projection -> give margin (0.02)

- select all -> UV editing -> display stretch

### UV unwrap
- arrange in square shape, but try keep related items together

### Baking (89min.35sec)
- uv editor window -> NEW -> creates new image
- use high resolution like 4096px
- color -> white 
- alpha -> OFF
- generated type -> blank
- select 32bit float

#### creating the texture:
- save hdr version of baked texture -> this saves information (full data of scene) 
    uv editor window -> image -> save -> type: radiance HDR -> PUT IN SAME FOLDER AS BLENDER FILE / OR SUBFOLDER
- blender.blend
- baked.hdr
- have to specifically tell blender which texture to bake in
- create new SHADER editor window 
- and ensure "use nodes" is checked

#### create a new node (99min)
- SHIFT + A while over shader editor window -> texture -> image texture -> select image icon -> select BAKED
- then ensure within the shader editor window -> the active node is the newly created node

- blender -> render properties tab -> bake (ensure rendering engine is CYCLES)
- output -> margin -> 16px
- output -> margin -> UNCHECK "clear image" - so it doesnt delete everything
- sampling -> render "128" or "256"
then click on "BAKE"
- after bake, baked texture should appear on uv editor

### Compositor
- fixing color profiles (blender uses standard filmic color profile, but rendered doesnt have any)
- the generated uv editor has noise but rendererd doesnt
- change shader editor to "composition"
- to activate compositor (which lets you do compositions) -> click use nodes
    - its about what gets output when you do a render
- but you can tell compositor to (instead of just rendering the scene)
    - render the texture through nodes (apply denoizer)
    - apply "filmic color" filter and to output the
-> output it through the render

- SHIFT+A -> input -> image 
- choose the baked image
- then link-join "image" to composite "image"
- AND mute old by selecting old node and M (press M)
- but resolution is wrong, FIX INA BIT

- between the nodes, add new node (SHIFT + A) -> search "denoise" or Filter -> denoise
- rewire image output from texture to denoise to composit
- rerender (takes a while)

- render properties tab -> view transform -> filmic
- output properties tab -> change resolution -> match the texture resolution
- save image (same folder as baked hdr file)-> jpg
- reset compositor to reset by muting denoiser node and unmuting default and relink
- reset resolution (1920 x 1920) default

### Export model (GLTF binary)

- select ALL:
- dont need "other" collection 
- DO NEED "emissions" collection

-> export -> gltf 2.0

- select format-> glb (gltf binary)
- remember export settings
- limit to selected objects
- transform -> +y up

- geometry -> 
    - UV's (ON), 
    - normals (OFF), 
    - vertex color (OFF)
    - data-> materials -> no export
    - compression -> OFF (on -> might get bug not being able to export)
