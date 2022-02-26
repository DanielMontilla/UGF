import Surface from "../Core/Surface";
import { MANAGERS } from "../Renderer/CONST";
import { rgb } from "../Types/UFG";
import Entity from "./Entity";

export default class Rectangle extends Entity {

   public readonly manager = MANAGERS.rectangle;
   protected id: number;

   constructor(
      x: number = 0,
      y: number = 0,
      width: number = 2 ** 4,
      height: number = 2 ** 4,
      public color: rgb = [ .5, 1, 0 ]
   ) {
      super( x, y, width, height);
      this.id = this.manager.add(this);
   }

   public getVertexData(): number[] {
      let [ x, y, z ] = [ this.x, this.y, this.layer ];
      let [ ofx, ofy ] = [ this.xOffset, this.yOffset ];
      let [ orx, ory ] = [ this.xOrigin, this.yOrigin ];
      let [ width, height ] = [ this.width, this.height ];
      let a = this.angle;
      let [ r, g, b ] = this.color;

      return [
         x        , y         , z, ofx, ofy, orx, ory, a, r, g, b,  // ↖ TOP LEFT VERTEX
         x + width, y         , z, ofx, ofy, orx, ory, a, r, g, b,  // ↗ TOP RIGHT VERTEX
         x        , y + height, z, ofx, ofy, orx, ory, a, r, g, b,  // ↙ BOT LEFT VERTEX
         x + width, y + height, z, ofx, ofy, orx, ory, a, r, g, b   // ↘ BOT RIGHT VERTEX
      ]
   }
}