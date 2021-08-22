import Game from '../Game';
import GameObject from '../gameObjects/gameObject';
import Rectangle from '../gameObjects/Rectangle';
import Sprite from '../gameObjects/Sprite';

// Shaders
import {
   vertexShader as shape_vs,
   fragmentShader as shape_fs,
   attributes as shape_attribs,
   uniforms as shape_uniforms
} from './Shaders/Shape';

import {
   vertexShader as sprite_vs,
   fragmentShader as sprite_fs,
   attributes as sprite_attribs,
   uniforms as sprite_uniforms
} from './Shaders/Sprite';

import { attributeData, ProgramDetail, pipelineName, uniformData } from '../types';
import { createProgram } from './util';
import Pipeline from './Pipelines/Pipeline';
import SpritePipeline from './Pipelines/SpritePipeline';
import ShapePipeline from './Pipelines/ShapePipeline';

export default class Renderer {
   public static context: WebGLRenderingContext;

   private shapePipeline: ShapePipeline;
   private spritePipeline: SpritePipeline;

   // Global uniform data for all objects
   private static projectionMatrix: number[];

   public constructor(canvas: HTMLCanvasElement) {
      // * Setting up WebGL rendering context
      let gl = canvas.getContext('webgl');
      if (!gl) console.error(`couldn't get webgl context`);
      gl = <WebGLRenderingContext>gl;
      Renderer.context = gl;

      // TODO: this is kinda a mess... maybe abstract further with pipeline classes?
      let spritePipeline = new SpritePipeline();
      let shapePipeline = new ShapePipeline();

      let projection = [
         2 / canvas.clientWidth, 0, 0, 
         0, -2 / canvas.clientHeight, 0,
         -1, 1, 1
      ];

      // SETTING UP GLOBAL UNIFORMS
      let uniform = spritePipeline.unifs.u_projection;
      let program = spritePipeline.program;
      gl.useProgram(program);
      gl.uniformMatrix3fv(uniform.location, false, projection);
      program = shapePipeline.program;
      uniform = shapePipeline.unifs.u_projection;
      gl.useProgram(program);
      gl.uniformMatrix3fv(uniform.location, false, projection);

      // SETTING UP GLOBAL ATTRIBS
      let attrib = spritePipeline.attribs.a_texCoord;
      program = spritePipeline.program;
      gl.useProgram(program);
      this.setAttribute(new Float32Array([
         // T1
         0, 0,
         1, 0,
         0, 1,
         0, 1,
         1, 0,
         1, 1
       ]), attrib)
      
      // * Prepare drawing surface
      gl.clearColor(0.84, 0.81, 0.92, 1);
      gl.viewport(0, 0, canvas.clientWidth, canvas.clientHeight);
      
      // SETTING CLASS MEMEBERS
      
      this.spritePipeline = spritePipeline;
      this.shapePipeline = shapePipeline;
      Renderer.projectionMatrix = projection;
   }

   public draw() {
      let gl = Renderer.context;
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      Game.gameObjects.forEach((object) => {
         switch (object.renderType) {
            case 'shape':
               this.drawShape(object);
               break;

            case 'sprite':
               this.drawSprite(<Sprite>object);
               break;
         }
      });
   }

   drawShape(object: GameObject) {
      let gl = Renderer.context;
      let pipeline = this.shapePipeline;
      gl.useProgram(pipeline.program);

      // SETTING ATTRIBUTES
      this.setAttribute(object.getPositionData(), pipeline.attribs.a_position);

      // SETTING UNIFORMS // TODO CREATE METHOD
      let rect = <Rectangle>object;
      gl.uniform3f(pipeline.unifs.u_color.location, rect.color.r, rect.color.g, rect.color.b);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
   }

   drawSprite(sprite: Sprite) {
      let gl = Renderer.context;
      let pipeline = this.spritePipeline;
      gl.useProgram(pipeline.program);

      gl.bindTexture(gl.TEXTURE_2D, sprite.texture);

      // SETTING ATTRIBUTES
      this.setAttribute(sprite.getPositionData(), pipeline.attribs.a_position);

      // SETTING UNIFORMS
      gl.uniform1i(pipeline.unifs.u_texture.location, 0);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
   }

   private setAttribute(data: Float32Array, info: attributeData): void {
      let gl = Renderer.context;

      gl.bindBuffer(gl.ARRAY_BUFFER, info.buffer);
      gl.enableVertexAttribArray(info.location);
      gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW);
      gl.vertexAttribPointer(info.location, info.size, info.type, false, 0, 0);
   }

   public getContext(): WebGLRenderingContext {
      return Renderer.context;
   }

   public static getProjectionMatrix() {
      return this.projectionMatrix;
   }
}
