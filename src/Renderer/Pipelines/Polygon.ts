import Pipeline from "./Pipeline";
import Renderer from "../Renderer";

import {
   vertexShader   as vsSource,
   fragmentShader as fsSource,
   attributes     as attribArr,
   uniforms       as uniforArr
} from '../../Shaders/Polygon';

import Entity from "../../Entities/Entity";

export default class PolygonPipeline extends Pipeline <
   typeof attribArr[number],
   typeof uniforArr[number]
> {
   private vao: Float32Array = new Float32Array(1000);

   public constructor(renderer: Renderer) {
      super(renderer, 'polygon', vsSource, fsSource, attribArr, uniforArr);
   }

   public prepDraw(e: Entity): number {
      return 2;
   }
}