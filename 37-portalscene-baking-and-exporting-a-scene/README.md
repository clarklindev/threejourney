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
    - fix: in object mode -> go into solid shading -> viewport overlays -> face orientation 
    - this shows wrongly oriented faces: blue === good, red is flipped 
    - how does this even happen??? most likely when you do an extrude in the wrong direction
    - THE FIX: select geometry -> edit mode -> / to isolate geometry -> select all "RED" faces (those are the problem faces) -> F3 (search "Flip") OR Mesh -> Flip
    - search (F3 + "recalculate outside")
    OR 
    - select geometry -> go into edit mode -> vertices -> select the vertices of the missing face, click "F" to fill, then select the whole shape -> (F3 + "flip") -> then remove the bottom face of the correctly flipped geometry
    - ensure everything is Blue before moving on - the flate single faces should have correct side showing blue -> turn off face orientation

### scaling issues