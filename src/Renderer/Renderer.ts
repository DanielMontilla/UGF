import Surface from "../Core/Surface";
import Pipeline from "./Pipelines/Pipeline";
import SpritePipeline from "./Pipelines/Sprite.pipeline";
import RectanglePipeline from "./Pipelines/Rectangle.pipeline";
import Entity from "../Entities/Entity";
import { createContext, createOrthoMatrix } from "../Util/webgl";
import Texture from "./Texture";
import Camera from "./Camera";
import { EntityPrimitiveKeys } from "../Types/UFG";

export default class Renderer {

   public readonly surface: Surface;
   private readonly camera: Camera;
   public readonly gl: WebGLRenderingContext;

   public pipelines: Record<EntityPrimitiveKeys, Pipeline>;
   public entityLists: Record<EntityPrimitiveKeys, Entity[]>;
   
   public projectionMat: number[];
   public cameraMat: number[];

   constructor(surface: Surface) {
      this.surface         = surface;
      this.camera          = surface.camera;
      this.gl              = createContext(surface.canvas);
      this.projectionMat   = createOrthoMatrix(surface.width, surface.height);
      this.cameraMat       = this.camera.mat;
      this.entityLists     = surface.entityLists;
      
      // Initilizing other systems
      Texture.init(this.gl);
      this.pipelines       = {
         sprite:     new SpritePipeline(this),
         rectangle:  new RectanglePipeline(this)
      };
      
      // Setting up surface for drawing
      let gl         = this.gl;
      let [r, g, b]  = surface.backgroundColor;

      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

      gl.clearColor(r, g, b, 1);
      gl.viewport(0, 0, surface.width, surface.height);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
   }

   public draw(): void {
      let gl   = this.gl;
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      
      for (const type in this.pipelines) {
         this.pipelines[type as EntityPrimitiveKeys].begin();
      }
   }
}