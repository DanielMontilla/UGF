import { pipelineName, rgb } from "../types";
import GameObject from "./gameObject";

export default class Rectangle extends GameObject {
   public color: rgb;

   public renderType: pipelineName;

   constructor(
      x: number = 100,
      y: number = 100,
      width: number = 100,
      height: number = 100,
      color: rgb = { r: 0.5, g: 0, b: 0.5 }
   ) {
      super(x, y, width, height);
      this.color = color;

      this.renderType = `shape`;
   }

   public getPositionData(): Float32Array {
      
      let x1 = this.x;
      let y1 = this.y;
      let x2 = this.x + this.width;
      let y2 = this.y + this.height;

      let data = [
         x1, y1,
         x2, y1,
         x2, y2,
         x1, y1,
         x2, y2,
         x1, y2
      ];

      return new Float32Array(data);
   }

}