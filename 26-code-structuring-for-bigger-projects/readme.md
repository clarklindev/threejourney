### restructure code

- Experience class emits and triggers events 
- centralize loading in single Resource class
    - instantiate all loaders we need
    - loop through an array of assets and load them
    - trigger an event when all assets are loaded
- each resource in array will be defined by an object
    - name
    - type (so we know which loader to use)
    - path 
- retrieve resources instance in the environment and use the environmentMapTexture item to create the environment map

- smooth transition between animations we use the methods in AnimationAction class
    - use crossFadeFrom();
    - the method needs to be called on the incoming action, with the previous action as the first parameter and the duration of the transition (in seconds) as the second parameter
    - need to reset and play the new animation

### Testing animation without dat.ui
because we added 'experience' as global parameter to window, we can run from browser console

```js
window.experience.world.fox.animation.play('walking');
window.experience.world.fox.animation.play('running');
window.experience.world.fox.animation.play('idle');
```

### testing with dat.ui
debug accessed via #debug in url

eg: http://192.168.155.41:8080/#debug 

after browser refresh

### Destroying objects on scene
- stopping time and resize events
- put everything in Experience class
- stop listening to the Time and Sizes events with off()
- destroy things - use traverse() function on the scene 
- THREEJS documentation - How to dispose of objects
    - geometries
    - materials
    - textures
    - controls, passes etc
- if its a mesh, call dispose() on the geometry
- the last frame is still rendered - to remove it remove the canvas

```js

  destroy(){
    this.sizes.off('resize');
    this.time.off('tick');

    //traverse scene and look for things to destroy

    //geometries
    this.scene.traverse((child)=>{
      if(child instanceof THREE.Mesh){
        child.geometry.dispose();
        for(const key in child.material){
          const value = child.material[key];
          if(value && typeof value.dispose === "function"){
            value.dispose();
          }
        }
      }
    });

    //controls
    this.camera.controls.dispose();
    
    //webglrenderer
    this.renderer.instance.dispose();

    //debug ui
    if(this.debug.active){
      this.debug.ui.destroy();
    }
  } 

```
- to test - from browser console
```js

experience.destroy(); 
//window.experience.destroy();

```