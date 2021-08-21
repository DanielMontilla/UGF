import Game from './Game';
import GameObject from './gameObjects/gameObject';
import Rectangle from './gameObjects/Rectangle';
import Sprite from './gameObjects/Sprite';
import { vertexShader as vs, fragmentShader as fs } from './Shaders/Primatives';
import { vertexShader as vs2, fragmentShader as fs2 } from './Shaders/Sprite';
import { renderType } from './util';

type attributeInfo = {
   location: number; // location inside shader program
   buffer: WebGLBuffer; // buffer object for attribute
   size: number; // Amount of data units per component
   type: number; // type of data
};

type uniformInfo = {
   location: WebGLUniformLocation;
}

type program = {
   program: WebGLProgram;
   attributes: Record<string, attributeInfo>;
   uniforms: Record<string, uniformInfo>;
}

export default class Renderer {
   private gl: WebGLRenderingContext;
   private vertexShader: WebGLShader;
   private fragmentShader: WebGLShader;
   private program: WebGLProgram;

   private programs: Record<string, program> = {};

   private projectionMatrix: number[];

   private attributeObjects: Record<string, attributeInfo> = {};
   private uniformObjects: Record<string, uniformInfo> = {};

   public constructor(canvas: HTMLCanvasElement) {
      // * Setting up WebGL rendering context
      let gl = canvas.getContext('webgl');
      if (!gl) console.error(`couldn't get webgl context`);
      gl = <WebGLRenderingContext>gl;
      this.gl = gl;

      // * Creating & Setting up Shaders
      this.vertexShader = this.createShader('vertex', vs);
      this.fragmentShader = this.createShader('fragment', fs);

      // * Creating & Setting up Programs
      this.program = this.createProgram(
         this.gl,
         this.vertexShader,
         this.fragmentShader
      );

      let program2 = this.createProgram(
         this.gl,
         this.createShader('vertex', vs2),
         this.createShader('fragment', fs2)
      );

      this.programs['sprites'] = {
         program: program2,
         attributes: {
            a_vertexPosition: {
               location: gl.getAttribLocation(program2, `a_vertexPosition`),
               buffer: <WebGLBuffer>gl.createBuffer(),
               size: 2,
               type: gl.FLOAT
            },
            a_texCoord: {
               location: gl.getAttribLocation(program2, `a_texCoord`),
               buffer: <WebGLBuffer>gl.createBuffer(),
               size: 2,
               type: gl.FLOAT
            }
         },
         uniforms: {
            u_projection: {
               location: <WebGLUniformLocation>gl.getUniformLocation(program2, `u_projection`)
            },
            u_texture: {
               location: <WebGLUniformLocation>gl.getUniformLocation(program2, `u_texture`)
            }
         }
      }

      gl.useProgram(this.program);

      // * Setting attributes & uniforms
      // this.generateAttributeObjects(); // TODO: make this work
      // this.generateUniformObjects(); // TODO: make this work

      this.attributeObjects = {
         a_vertexPosition: {
            location: gl.getAttribLocation(this.program, `a_vertexPosition`),
            buffer: <WebGLBuffer>gl.createBuffer(),
            size: 2,
            type: gl.FLOAT
         }
      }

      // * Local/Per object uniforms
      this.uniformObjects = {
         u_color: {
            location: <WebGLUniformLocation>gl.getUniformLocation(this.program, `u_color`),
         }
      }

      // * Global uniforms
      let u_projectionLocation = gl.getUniformLocation(this.program, `u_projection`);
      let projection = [
         2 / canvas.clientWidth, 0, 0,
         0, -2 / canvas.clientHeight, 0,
         -1, 1, 1
      ]

      this.projectionMatrix = projection;

      gl.uniformMatrix3fv(u_projectionLocation, false, projection);
      
      // * Prepare drawing surface
      gl.clearColor(0.84, 0.81, 0.92, 1);
      gl.viewport(0, 0, canvas.clientWidth, canvas.clientHeight);
   }

   public draw() {
      let gl = this.gl;
      gl.clear(gl.COLOR_BUFFER_BIT);

      Game.gameObjects.forEach((object) => {

         switch (object.renderType) {
            case 'primitive':
               this.drawPrimitive(object)
               break;
         
            case 'texture':
               this.drawTexture(<Sprite>object)
               break;
         }

      });
   }
   
   drawPrimitive(object: GameObject) {
      let gl = this.gl;
      gl.useProgram(this.program);
      let rect = <Rectangle>object;
   
      let data = rect.getBufferData();
   
      this.setBuffer(data, this.attributeObjects['a_vertexPosition']);
   
      let loc = gl.getUniformLocation(this.program, `u_color`);
      gl.uniform3f(loc, rect.color.r, rect.color.g, rect.color.b);
   
      gl.drawArrays(gl.TRIANGLES, 0, 6);
   }

   drawTexture(sprite: Sprite) {
      let gl = this.gl;
      let programInfo = this.programs.sprite;

      gl.bindTexture(gl.TEXTURE_2D, sprite.texture);

      gl.useProgram(programInfo.program);

      let attribute: attributeInfo;
      let data: Float32Array;

      attribute = programInfo.attributes.a_vertexPosition;
      data = sprite.getPositionBufferData();
      this.setBuffer(data, attribute);

      attribute = programInfo.attributes.a_texCoord;
      data = new Float32Array([
         0, 0,
         0, 1,
         1, 0,
         1, 0,
         0, 1,
         1, 1
      ]);
      this.setBuffer(data, attribute);

      let uniform = programInfo.uniforms.u_texture;




      
      gl.drawArrays(gl.TRIANGLES, 0, 6);
   }

   /* ATTRIBUTE & UNIFORM HELPER METHODS */
   /**
    * ! NOT USING THIS FOR NOW
    */
   private generateAttributeObjects(): void {
      let gl = this.gl;
      let program = this.program;
      let quantityAttributes = gl.getProgramParameter(
         program,
         gl.ACTIVE_ATTRIBUTES
      );

      for (let index = 0; index < quantityAttributes; index++) {
         let info = <WebGLActiveInfo>gl.getActiveAttrib(program, index);
         this.attributeObjects[info.name] = {
            location: index,
            buffer: <WebGLBuffer>gl.createBuffer(),
            size: info.size,
            type: info.type
         };
      }
   }

   /**
    * ! NOT USING THIS FOR NOW
    */
   private generateUniformObjects(): void {
      let gl = this.gl;
      let program = this.program;
      let quantityUniforms = gl.getProgramParameter(
         program,
         gl.ACTIVE_UNIFORMS
      );

      for (let index = 0; index < quantityUniforms; index++) {
         let info = <WebGLActiveInfo>gl.getActiveUniform(program, index);
         this.uniformObjects[info.name] = {
            location: index
         }
      }
   }

   private setBuffer(data: Float32Array, info: attributeInfo): void {
      let gl = this.gl;

      gl.bindBuffer(gl.ARRAY_BUFFER, info.buffer);
      gl.enableVertexAttribArray(info.location);
      gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW);
      gl.vertexAttribPointer(
         info.location,
         info.size,
         info.type,
         false,
         0,
         0
      )
   }

   /* WEBGL UTILITY METHODS */
   private createShader(
      type: 'vertex' | 'fragment',
      source: string
   ): WebGLShader {
      let gl = this.gl;
      let shaderType = type == 'vertex' ? gl.VERTEX_SHADER : gl.FRAGMENT_SHADER;
      let shader = <WebGLShader>gl.createShader(shaderType);

      gl.shaderSource(shader, source);
      gl.compileShader(shader);

      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
         console.error(`Error compiling shader `, gl.getShaderInfoLog(shader));
         gl.deleteShader(shader);
      }

      return shader;
   }

   private createProgram(
      gl: WebGLRenderingContext,
      vertextShader: WebGLShader,
      fragmentShader: WebGLShader
      ): WebGLProgram {

      let program = <WebGLProgram>gl.createProgram();

      gl.attachShader(program, vertextShader);
      gl.attachShader(program, fragmentShader);

      gl.linkProgram(program);

      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
         console.error(
            `Error compiling program `,
            gl.getProgramInfoLog(program)
         );
         gl.deleteProgram(program);
      }

      return program;
   }

   private getAttributeLocation(attributeName: string): number {
      // TODO error checking
      let gl = this.gl;
      let program = this.program;

      return gl.getAttribLocation(program, attributeName);
   }

   private getUniformLocation(uniformName: string): WebGLUniformLocation {
      // TODO error checking
      let gl = this.gl;
      let program = this.program;

      let location = gl.getUniformLocation(program, uniformName);

      return <WebGLUniformLocation>location;
   }

   public getContext(): WebGLRenderingContext {
      return this.gl;
   }
}