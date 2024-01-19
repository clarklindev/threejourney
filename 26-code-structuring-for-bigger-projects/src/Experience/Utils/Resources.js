import * as THREE from 'three';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import EventEmitter from "./EventEmitter";

/* centralize loading in single Resource class
- instantiate all loaders we need
- loop through an array of assets and load them
- trigger an event when all assets are loaded
*/
 
export default class Resources extends EventEmitter{
  constructor(sources){
    super();

    //Options
    this.sources = sources;
    
    //setup
    this.items = {}
    this.toLoad = this.sources.length;
    this.loaded = 0;

    this.setLoaders();
    this.startLoading();
  }

  setLoaders(){
    this.loaders = {}
    this.loaders.gltfLoader = new GLTFLoader();
    this.loaders.textureLoader = new THREE.TextureLoader();
    this.loaders.cubeTextureLoader = new THREE.CubeTextureLoader();
  }

  startLoading(){
    for(const source of this.sources){
      console.log(source);
      switch(source.type){
        case "gltfModel":
          this.loaders.gltfLoader.load(source.path, (file)=> {
            this.sourceLoaded(source, file);
          })
          break;
        case "texture":
          this.loaders.textureLoader.load(source.path, (file)=>{
            this.sourceLoaded(source, file);
          })
          break;
        case "cubeTexture":
          this.loaders.cubeTextureLoader.load(source.path, (file)=>{
            this.sourceLoaded(source, file);
          })
          break;
      }
    }
  }

  sourceLoaded(source, file){
    this.items[source.name] = file; //file: is what we've loaded 
    this.loaded++;

    if(this.loaded === this.toLoad){
      this.trigger('ready');
    }
  }

}