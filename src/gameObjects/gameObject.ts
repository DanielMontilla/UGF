import { renderType } from '../util';

export default abstract class GameObject {

   public x: number;
   public y: number;

   public abstract renderType: renderType;
   public abstract getBufferData(): Float32Array;

   constructor(x: number = 0, y: number = 0) {
      this.x = x;
      this.y = y;
   }
}