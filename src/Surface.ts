import Entity from "./Entities/Entity";
import Rectangle from "./Entities/Rectangle";
import Sprite from "./Entities/Sprite";
import InputHandler from "./Input/InputHandler";
import Key from "./Input/Key";
import Camera from "./Renderer/Camera";
import Renderer from "./Renderer/Renderer";
import { emptyFunc } from "./util";
import { createCanvas } from "./Renderer/webgl-utils";

export default class Surface {

   public readonly width: number;
   public readonly height: number;
   public readonly canvas: HTMLCanvasElement;
   public readonly background: rgb;
   public entityLists: Record<EntityType, Entity[]>;

   public readonly renderer: Renderer;
   public readonly camera: Camera;
   public readonly inputHandler: InputHandler;

   public update: (dt: number) => void;
   private previousTime: number;

   public fps: number = 0;

   constructor(width: number = 1200, height: number = 900, background: rgb = [1, 1, 1]) {

      this.width        = width;
      this.height       = height;
      this.canvas       = createCanvas(width, height);
      this.update       = emptyFunc;
      this.background   = background;

      this.entityLists  = {   // TODO: create a const array to tidy up this code
         rectangle:  [],
         sprite:     []
      }

      this.camera       = new Camera(this);
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
}