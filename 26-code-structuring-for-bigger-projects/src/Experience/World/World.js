import Experience from "../Experience.js";
import Environment from "./Environment.js";
import Fox from './Fox.js';
import Floor from './Floor.js';


export default class World {
  constructor(){
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    console.log(this.scene);

    //test mesh
    // const testMesh = new THREE.Mesh(
    //   new THREE.BoxGeometry(1,1,1),
    //   new THREE.MeshStandardMaterial()
    // );
    // this.scene.add(testMesh);

    //only when resources are ready
    this.resources.on('ready', ()=>{
       //setup
      this.floor = new Floor(); //order matters
      this.fox = new Fox();
      this.environment = new Environment();

    });
  }

  update(){
    if(this.fox){
      this.fox.update();
    }
  }
}