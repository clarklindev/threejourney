## DEBUG UI

- add debug ui elements as you go.
- debug elements should be added after the element to tweak.

- range
- color
- text
- checkbox
- select
- button
- folder

- DAT.ui(https://github.com/dataarts/dat.gui#readme not maintained) / https://www.npmjs.com/package/dat.gui

```js
// dat-ui
import * as dat from "dat.gui";
const gui = new dat.GUI();
gui.hide();//hide gui at start, use 'h' to show

gui.add(mesh.position, "y", -3, 3, 0.01); //min , max, precision (step)
gui
  .add(mesh.position, "y")
  .min(-3)
  .max(3)
  .step(0.03) //using function() min , max, precision (step)
  .name("name of prop");
gui.add(mesh, "visible");

gui.add(material, "wireframe");

const parameters = {
  color: 0xff0000,
};

gui.addColor(parameters, "color").onChange(() => {
  //update material
  material.color.set(parameters.color);
});

const material = new THREE.MeshBasicMaterial({
  color: parameters.color
  wireframe: true,
});
```

- lil-gui (https://lil-gui.georgealways.com/) / https://www.npmjs.com/package/lil-gui

```js
// lil-gui
import GUI from "lil-gui";
const gui = new GUI();