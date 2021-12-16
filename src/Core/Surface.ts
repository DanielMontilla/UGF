import Entity from "../Entities/Entity";
import Rectangle from "../Entities/Rectangle";
import Sprite from "../Entities/Sprite";
import InputHandler from "../Input/InputHandler";
import Key from "../Input/Key";
import Camera from "../Renderer/Camera";
import Renderer from "../Renderer/Renderer";
import RGB from "../Util/Classes/RGB";
import Size from "../Util/Classes/Transform/Size";
import { emptyFunc } from "../Util/general";
import { createCanvas } from "../Util/webgl";

export default class Surface {

   public readonly size: Size;
   public readonly canvas: HTMLCanvasElement;
   public readonly background: RGB;
   public entityLists: Record<EntityType, Entity[]>;

   public readonly renderer: Renderer;
   public readonly camera: Camera;
   public readonly inputHandler: InputHandler;

   public update: (dt: number) => void;
   private previousTime: number;

   public fps: number = 0;

   // TODO: create overloads for constructor
   constructor(width: number = 1200, height: number = 900, background: rgb = [50, 50, 50]) {

      this.size         = new Size(width, height);
      this.canvas       = createCanvas(width, height);
      this.update       = emptyFunc;
      this.background   = RGB.fromArr(background);

      this.entityLists  = {   // TODO: create a const array to tidy up this code
         rectangle:  [],
         sprite:     []
      }

      this.camera       = new Camera(0, 0, width, height);
      this.renderer     = new Renderer(this);
      this.inputHandler = new InputHandler(this.canvas);
      this.previousTime = performance.now();

      requestAnimationFrame(this.loop);
   }

   /**
    * @description main game loop. Callback order:
    *    1. update
    *    2. draw
    * @param currentTime number, basically performance.now() 
    */
   private loop = (currentTime: number) => {
      let timeElapsed = currentTime - this.previousTime;
      this.fps = 1000 / timeElapsed;

      this.update(timeElapsed *= 0.001);
      this.renderer.draw();

      this.previousTime = currentTime;
      requestAnimationFrame(this.loop);
   }

   public addEntity(e: Entity) {
      let entityType: EntityType = 'rectangle';
      if (e instanceof Rectangle)   entityType = 'rectangle';
      if (e instanceof Sprite)      entityType = 'sprite';

      this.entityLists[entityType].push(e);
   }

   public addKeyInput = (
      keyCode: keyCode,
      onDownCallback?: () => void,
      onUpCallback?: () => void
      ): Key => {
      return this.inputHandler.addKey(keyCode, onDownCallback, onUpCallback);
   }

   public createKeys = (
      keyCodes: keyCode[]
   ) => {
      let arr: Key[] = [];

      keyCodes.forEach( code => { arr.push(this.addKeyInput(code) )} )

      return arr;
   }

   get width() { return this.size.width }
   get height() { return this.size.height }
   get center() { return this.size.mid }
}