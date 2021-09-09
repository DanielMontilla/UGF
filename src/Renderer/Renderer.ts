import Surface from "../Surface";
import Pipeline from "./Pipelines/Pipeline";
import SpritePipeline from "./Pipelines/SpritePipeline";
import PolygonPipeline from "./Pipelines/Polygon";

import { createContext } from "../webgl-utils";

export default class Renderer {

   private surface: Surface;
   public readonly gl: WebGLRenderingContext;
   private pipelines: Record<PipelineName, Pipeline>;

   public readonly projection: number[];

   constructor(surface: Surface) {
      this.surface      = surface;
      this.gl           = createContext(surface.canvas);
      this.projection   = [ 2 / surface.width, 0, 0, 0, -2 / surface.height, 0, -1, 1, 1 ]

      this.pipelines = {
         sprite:  new SpritePipeline(this),
         polygon: new PolygonPipeline(this)
      }

      // Setting up surface for drawing
      let gl            = this.gl;
      let [r, g, b]     = surface.background;

      gl.enable(gl.BLEND);
      gl.enable(gl.DEPTH_TEST);
      gl.blendFunc(gl.SRC_ALPHA, gl.ZERO);

      gl.clearColor(r, g, b, 1);
      gl.viewport(0, 0, surface.width, surface.height);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
   }

   public draw() {
      let gl   = this.gl;
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      for (const gameObject of this.surface.entities) {
         let pipeline   = this.pipelines[gameObject.pipeline];
         let num        =  pipeline.prepDraw(gameObject);

         gl.drawArrays(gl.TRIANGLES, 0, num)
      }
   }
}