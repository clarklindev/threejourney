import EventEmitter from './EventEmitter.js';

export default class Sizes extends EventEmitter{
  constructor(){
    super();  ///call EventEmitter constructor

    //setup
    this.width = window.innerWidth; //full viewport width
    this.height = window.innerHeight;
    this.pixelRatio = Math.min(window.devicePixelRatio, 2); //whichever is less than 2

    //resize
    window.addEventListener('resize', ()=>{
      this.width = window.innerWidth; //full viewport width
      this.height = window.innerHeight;
      this.pixelRatio = Math.min(window.devicePixelRatio, 2); //whichever is less than 2
    })

    this.trigger('resize');
  }
}