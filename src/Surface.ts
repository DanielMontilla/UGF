import Entity from "./Entities/Entity";
import InputHandler from "./Input/InputHandler";
import Key from "./Input/Key";
import Renderer from "./Renderer/Renderer";
import { emptyFunc } from "./util";
import { createCanvas } from "./webgl-utils";

/**
 * @description singleton class that manages surface objects
 */
export default class Surface {

   public readonly width: number;
   public readonly height: number;
   public readonly canvas: HTMLCanvasElement;
   public readonly entities: Entity[] = [];
   public readonly background: rgb;

   public readonly renderer: Renderer;
   public readonly inputHandler: InputHandler;

   public update: (dt: number) => void;
   private previousTime: number;

   constructor(width: number = 1200, height: number = 900, background: rgb = [ 0, 0, 0]) {

      this.width        = width;
      this.height       = height;
      this.canvas       = createCanvas(width, height);
      this.update       = emptyFunc;
      this.background   = background
      this.renderer     = new Renderer(this);
      this.inputHandler = new InputHandler(this.canvas);
      this.previousTime = performance.now();

      requestAnimationFrame(this.loop);
   }

   /**
    * @description main game loop
    * @param currentTime number, basically performance.now() 
    */
   private loop = (currentTime: number) => {
      let timeElapsed = currentTime - this.previousTime;

      this.update(timeElapsed *= 0.001);
      this.renderer.draw();

      this.previousTime = currentTime;
      requestAnimationFrame(this.loop);
   }

   public addGameObject(gameObject: Entity) {
      this.entities.push(gameObject);
   }

   public addKeyInput = (
      keyCode: keyCode,
      onDownCallback?: () => void,
      onUpCallback?: () => void
      ): Key => {
      return this.inputHandler.addKey(keyCode, onDownCallback, onUpCallback);
   }
}