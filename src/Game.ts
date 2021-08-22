import GameObject from './gameObjects/gameObject';
import Rectangle from './gameObjects/Rectangle';
import Sprite from './gameObjects/Sprite';
import Renderer from './Renderer/Renderer';
import { nothing } from './util';

export default class Game {
   private static instance: Game;
   private canvas: HTMLCanvasElement;
   public update: (dt: number) => void;
   private start: number;
   private renderer: Renderer;

   public static gameObjects: GameObject[] = [];

   private constructor(width: number, height: number) {
      // * Creating & Setting up canvas element
      this.canvas = document.createElement('canvas');
      this.canvas.width = width;
      this.canvas.height = height;
      document.body.appendChild(this.canvas);

      // * Rendering!
      this.renderer = new Renderer(this.canvas);

      this.update = nothing;
      this.start = performance.now();
      requestAnimationFrame(this.loop.bind(this));
   }

   public static init(width: number = 640, heigth: number = 480): Game {
      if (Game.instance)
         console.warn(
            `A ${this.name} instance has already been initilized elsewhere`
         );
      if (!Game.instance) Game.instance = new Game(width, heigth);
      return Game.instance;
   }

   private loop() {
      // Time elapsed
      let dt = performance.now() - this.start;

      // Game update funciton
      this.update(dt);

      // Draw!
      this.renderer.draw();

      // Setting important data
      this.start = performance.now();

      // Request frame!
      requestAnimationFrame(this.loop.bind(this));
   }

   public createRect(x: number, y: number) {
      let rect = new Rectangle(x, y);
      Game.gameObjects.push(rect);
      return rect;
   }

   public createSprite(x: number, y: number, img: HTMLImageElement) {
      let sprite = new Sprite(x, y, img);
      Game.gameObjects.push(sprite);
      return sprite;
   }

   public get size(): { width: number; height: number } {
      return { width: this.canvas.width, height: this.canvas.height };
   }

   public get width() {
      return this.size.width;
   }

   public get height() {
      return this.size.height;
   }

   public static getRenderingContext(): WebGLRenderingContext {
      return this.instance.renderer.getContext();
   }
}
