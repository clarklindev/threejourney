# Adding details to the scene

- add fireflies
- change shader in the portal

### Background color
- ability to set background to an uniform color (tweak using dat.ui)
- create a debug object
- add a clearColor
- add to Dat.GUI with gui.addColor()
- use it with the renderer.setClearColor() method
- call the renderer.setClearColor() when change occurs
```js

const debugObject = {};

cibst gui = new dat.GUI({
  width: 400
});

debugObject.clearColor = "#431e43";
renderer.setClearColor(debugObject.clearColor);

gui.addColor(debugObject, "clearColor").onChange(() => {
  renderer.setClearColor(debugObject.clearColor); //setClearColor() is a three.js function 
});

```