import Surface from "../Surface";
import Pipeline from "./Pipelines/Pipeline";
import SpritePipeline from "./Pipelines/Batch/Sprite";
import RectanglePipeline from "./Pipelines/Batch/Rectangle";
import Entity from "../Entities/Entity";
import { createContext, createOrthoMatrix, createTranslationMatrix } from "./webgl-utils";
import Texture from "./Texture";
import Camera from "./Camera";

export default class Renderer {

   private readonly surface: Surface;
   private readonly camera: Camera;
   public readonly gl: WebGLRenderingContext;

   public pipelines: Record<EntityType, Pipeline>;
   public entityLists: Record<EntityType, Entity[]>;
   
   public projectionMat: number[];
   public cameraMat: number[];

   constructor(surface: Surface) {
      this.surface         = surface;
      this.camera          = surface.camera;
      this.gl              = createContext(surface.canvas);
      this.projectionMat   = createOrthoMatrix(surface.width, surface.height);
      this.cameraMat       = createTranslationMatrix(this.camera.x, this.camera.y);
      this.entityLists     = surface.entityLists;

      // Initilizing other systems
      Texture.init(this.gl);
      this.pipelines       = {
         sprite:     new SpritePipeline(this),
         rectangle:  new RectanglePipeline(this)
      };
      
      // Setting up surface for drawing
      let gl         = this.gl;
      let [r, g, b]  = surface.background;

      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

      gl.clearColor(r, g, b, 1);
      gl.viewport(0, 0, surface.width, surface.height);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
   }

   public draw = () => {
      let gl   = this.gl;
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      
      for (const key in this.pipelines) {
         this.pipelines[key as EntityType].begin();
      }
   }

   public getCameraTransalation = () => createTranslationMatrix(this.camera.x, this.camera.y);  // TODO: optimize by modifying existing translation matrix
}