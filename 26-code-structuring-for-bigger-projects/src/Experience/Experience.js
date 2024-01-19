import Sizes from './Utils/Sizes.js';
import Time from './Utils/Time.js';
import Camera from './Camera.js';
import World from './World/World.js';
import sources from './sources.js';
import Resources from './Utils/Resources.js';
import Renderer from './Renderer.js';
import Debug from './Utils/Debug.js';

import * as THREE from 'three';

let instance = null;


export default class Experience{
  constructor(canvas){

    if(instance){
      return instance;
    }
    instance = this;

    //global access
    window.experience = this;

    //param options
    this.canvas = canvas;

    //setup
    this.debug = new Debug();
    this.sizes = new Sizes();
    this.time = new Time();
    this.scene = new THREE.Scene();
    this.resources = new Resources(sources);
    this.camera = new Camera(this);
    this.renderer = new Renderer();
    this.world = new World();

    //Sizes resize event
    this.sizes.on('resize', ()=>{
      this.resize();
    })

    //Time tick event
    this.time.on('tick', ()=>{
      this.update();
    })
  }

  resize(){
    this.camera.resize();
    this.renderer.resize();
  }

  update(){
    this.camera.update();
    this.renderer.update();
    this.world.update();
  }

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
}