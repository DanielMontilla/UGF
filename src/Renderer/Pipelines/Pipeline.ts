import Renderer from "../Renderer";
import Entity from "../../Entities/Entity";
import { createProgram, createShader, getDataFromType } from "../../Util/webgl";
import { emptyRecord } from "../../Util/general";
import { attributeInfo, uniformInfo } from "../../Types/webgl";


export default abstract class Pipeline<
   EntityT extends Entity = Entity,
   AttributeT extends string = string,
   UniformT extends string = string
> {
   /**  */
   public readonly program: WebGLProgram;
   /**  */
   public readonly vertexShader: WebGLShader;
   /**  */
   public readonly fragmentShader: WebGLShader;

   protected attributes = emptyRecord<AttributeT, attributeInfo>();
   protected uniforms = emptyRecord<UniformT, uniformInfo>();
   
   /** Size in bytes of single value -> for floats ⇒ sizeof(float) = 4 ⇒ 4 bytes */
   public readonly UNIT_SIZE: number;
   /** Max amount of pipeline target entity in single draw call */
   public readonly MAX_OBJS: number;
   /** Amount of vertices in an element -> for quad ⇒ has 4 corners ⇒ 4 vetices */
   public readonly VERTEX_PER_OBJS: number;
   /** Amount of values per single vertex -> for vertex with 3 values ⇒ [ x, y, z ].length = 3 ⇒ 3 units (values) */
   public readonly UNITS_PER_VERTEX: number;
   /** Indeces required to build one element -> for quad ⇒ made up of 2 triangles, a triangle has 3 poitns ⇒ 2 * 3 = 6 */
   public readonly INDICES_PER_OBJS: number;
   /** Size in bytes of all values in vertex -> for 3 component vertex ⇒ 3 * sizeof(float) = 4 ⇒ 12 bytes */
   public readonly VERTEX_SIZE: number;
   /** Amount of values in an element -> for quad with 2 component vertices ⇒ 4 vertices * 2 units = 8 units (values) */
   public readonly UNITS_PER_OBJ: number;
   /** Max amount of indices to describe vao */
   public readonly MAX_INDICES: number;
   /** Max capacity for vao storage */
   public readonly MAX_UNITS: number;
   /** Max bytes inside vao */
   public readonly MAX_SIZE: number;

   /** Vertex Array Object  -> CPU side vertex (draw) buffer */
   protected vao: Float32Array;
   /** Vertex Buffer Object -> GPU side vertex buffer */
   protected vbo: WebGLBuffer;
   /** Index Array Buffer   -> CPU side index buffer */
   protected iao: Uint16Array;
   /** Index Buffer Object  -> GPU side index buffer */
   protected ibo: WebGLBuffer;

   protected nextElemOffset: number = 0;
   protected elemsToDraw: number = 0;

   // DEBUGING & PERFORMANCE/STATS
   public lastDrawCalls: number = 0;

   public constructor(
      public readonly renderer: Renderer,
      protected entityList: EntityT[],
      vsSource: string,
      fsSource: string,
      attributeList: readonly AttributeT[],
      uniformList: readonly UniformT[],

      UNIT_SIZE: number,
      MAX_ELEMS: number,
      UNITS_PER_VERTEX: number,
      VERTEX_PER_ELEM: number,
      INDICES_PER_ELEM: number,
   ) {
      let gl = renderer.gl;
      this.vertexShader = createShader(gl, 'vertex', vsSource);
      this.fragmentShader = createShader(gl, 'fragment', fsSource);
      this.program = createProgram(gl, this.vertexShader, this.fragmentShader);

      this.generateAttributes(attributeList);
      this.generateUniforms(uniformList);

      // SETTING UP PIPELINE CONSTANTS FOR BATCHING
      this.UNIT_SIZE          = UNIT_SIZE;
      this.MAX_OBJS           = MAX_ELEMS;
      this.UNITS_PER_VERTEX   = UNITS_PER_VERTEX;
      this.VERTEX_PER_OBJS    = VERTEX_PER_ELEM;
      this.INDICES_PER_OBJS   = INDICES_PER_ELEM;

      this.VERTEX_SIZE        = this.UNITS_PER_VERTEX * this.UNIT_SIZE;
      this.UNITS_PER_OBJ      = this.UNITS_PER_VERTEX * this.VERTEX_PER_OBJS;
      this.MAX_INDICES        = this.INDICES_PER_OBJS * this.MAX_OBJS;
      this.MAX_UNITS          = this.UNITS_PER_OBJ    * this.MAX_OBJS;
      this.MAX_SIZE           = this.MAX_UNITS        * this.UNIT_SIZE;

      this.vao = new Float32Array(this.MAX_UNITS);
      this.vbo = <WebGLBuffer> gl.createBuffer();
      this.iao = new Uint16Array(this.MAX_INDICES);
      this.ibo = <WebGLBuffer> gl.createBuffer();
   }



   private generateAttributes(list: readonly string[]) {
      let gl = this.renderer.gl;
      let position = 0;
      for (const attrib of list) {
         let location = gl.getAttribLocation(this.program, attrib);
         let info = <WebGLActiveInfo>gl.getActiveAttrib(this.program, location);
         let type = info.type;

         let [unitType, units, size] = getDataFromType(type);
         let offset = position;
         position += size;

         this.attributes[attrib as AttributeT] = {
            id: attrib,
            location: location,
            type: type,
            unitType: unitType,
            units: units,
            size: size,
            offset: offset
         };
      }
   }

   private generateUniforms(list: readonly string[]) {
      let gl = this.renderer.gl;
      for (const [index, uniformID] of list.entries()) {
         let location = <WebGLUniformLocation>(
            gl.getUniformLocation(this.program, uniformID)
         );
         let info = <WebGLActiveInfo>gl.getActiveUniform(this.program, index);
         let size = info.size;
         let type = info.type;

         this.uniforms[uniformID as UniformT] = {
            location: location,
            size: size,
            type: type
         };
      }
   }

   protected setAttribute(a: AttributeT) {
      let gl = this.renderer.gl;
      let { location, unitType, units, offset } = this.attributes[a];

      gl.useProgram(this.program);  // TODO: remove

      gl.enableVertexAttribArray(location);
      gl.vertexAttribPointer(location, units, unitType, false, this.VERTEX_SIZE, offset);
   }

   protected setAllAttributes() {
      for (const attrib in this.attributes) this.setAttribute(attrib);
   }

   protected setAttributes(a?: AttributeT[]) {
      if (a) { // Only set a selected amount of attributes
         for (const key of a) {
            this.setAttribute(key);
         }
      } else { // Set all
         this.setAllAttributes();
      }
   }

   public begin(): void {
      this.elemsToDraw = this.entityList.length;

      if (!this.elemsToDraw) return;

      let gl = this.renderer.gl;
      gl.useProgram(this.program);

      this.setPerDrawUniforms();
      
      this.lastDrawCalls = 0;
      this.nextElemOffset = 0;

      this.flush();
   };

   protected flush(): void {
      let gl = this.renderer.gl;
      let toDrawElementCount: number;
      let entities = this.entityList;
      let offset = this.nextElemOffset;

      if (this.elemsToDraw > this.MAX_OBJS) {
         toDrawElementCount = this.MAX_OBJS;
      } else {
         toDrawElementCount = this.elemsToDraw;
      }
      
      for (let i = 0; i < toDrawElementCount; i++) {
         const e = entities[i + offset];
         this.vao.set(this.createQuadData(e), i * this.UNITS_PER_OBJ);
      };

      gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
      this.setAllAttributes();
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.vao);

      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo);
      gl.drawElements(
         gl.TRIANGLES,
         this.INDICES_PER_OBJS * toDrawElementCount, 
         gl.UNSIGNED_SHORT,
         0
      );

      this.elemsToDraw -= toDrawElementCount;
      this.lastDrawCalls++;
      if (this.elemsToDraw) this.flush();
   };

   protected abstract createQuadData(r: Entity): number[];
   /** can only be called within begin method or itself recursively */
   protected abstract setPerDrawUniforms(): void;
}