import Surface from "../Surface";
import Pipeline from "./Pipelines/Pipeline";
import SpritePipeline from "./Pipelines/Sprite";
import RectanglePipeline from "./Pipelines/Rectangle";
import Entity from "../Entities/Entity";
import { createContext, createOrthoMatrix, createTranslationMatrix } from "../webgl-utils";
import Texture from "./Texture";
import Camera from "./Camera";

export default class Renderer {

   private readonly surface: Surface;
   private readonly camera: Camera;
   public readonly gl: WebGLRenderingContext;

   private pipelines: Record<EntityType, Pipeline>;
   public entityLists: Record<EntityType, Entity[]>;
   
   public projection: number[];

   constructor(surface: Surface) {
      this.surface         = surface;
      this.camera          = surface.camera;
      this.gl              = createContext(surface.canvas);
      this.projection      = createOrthoMatrix(surface.width, surface.height);
      this.entityLists     = surface.entityLists;

      // Initilizing other systems
      Texture.init(this.gl);

      this.pipelines       = {
         rectangle:  new RectanglePipeline(this),
         sprite:     new SpritePipeline(this)
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
      
      this.pipelines.sprite.flush(this.entityLists.sprite);
      this.pipelines.rectangle.flush(this.entityLists.rectangle);
   }

   public getCameraTransalation = () => createTranslationMatrix(this.camera.x, this.camera.y);
}