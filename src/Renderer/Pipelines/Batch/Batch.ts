import Entity from "../../../Entities/Entity";
import Renderer from "../../Renderer";
import Pipeline from "../Pipeline";

/**
 * @member UNIT_SIZE          Size in bytes of single value -> for floats ⇒ sizeof(float) = 4 ⇒ 4 bytes
 * @member MAX_ELEMS          Max amount of pipeline target entity in single draw call
 * @member VERTEX_PER_ELEM    Amount of vertices in an element -> for quad ⇒ has 4 corners ⇒ 4 vetices
 * @member UNITS_PER_VERTEX   Amount of values per single vertex -> for vertex with 3 values ⇒ [ x, y, z ].length = 3 ⇒ 3 units (values)
 * @member INDICES_PER_ELEM   Indeces required to build one element -> for quad ⇒ made up of 2 triangles, a triangle has 3 poitns ⇒ 2 * 3 = 6
 * @member VERTEX_SIZE        Size in bytes of all values in vertex -> for 3 component vertex ⇒ 3 * sizeof(float) = 4 ⇒ 12 bytes
 * @member UNITS_PER_ELEM     Amount of values in an element -> for quad with 2 component vertices ⇒ 4 vertices * 2 units = 8 units (values)
 * @member MAX_INDICES        Max amount of indices to describe vao
 * @member MAX_UNITS          Max capacity for vao storage
 * @member MAX_SIZE           Max bytes inside vao
 */
export default abstract class BatchPipeline <
   E extends Entity,
   attributes extends string = string,
   uniforms extends string = string
>  extends Pipeline <E, attributes, uniforms> {
   
   public readonly UNIT_SIZE: number;
   public readonly MAX_ELEMS: number;
   public readonly VERTEX_PER_ELEM: number;
   public readonly UNITS_PER_VERTEX: number;
   public readonly INDICES_PER_ELEM: number;

   public readonly VERTEX_SIZE: number;
   public readonly UNITS_PER_ELEM: number;
   public readonly MAX_INDICES: number;
   public readonly MAX_UNITS: number;
   public readonly MAX_SIZE: number;

   protected vao: Float32Array;  // Vertex Array Object  -> CPU side vertex (draw) buffer
   protected vbo: WebGLBuffer;   // Vertex Buffer Object -> GPU side vertex buffer
   protected iao: Uint16Array;   // Index Array Buffer   -> CPU side index buffer
   protected ibo: WebGLBuffer;   // Index Buffer Object  -> GPU side index buffer

   protected nextElemOffset: number = 0;
   protected elemsToDraw: number = 0;

   // DEBUGING & PERFORMANCE/STATS
   public lastDrawCalls: number = 0;

   public constructor(
      renderer: Renderer, 
      entityList: E[],
      vsSource: string, 
      fsSource: string, 
      attributeList: readonly attributes[], 
      uniformList: readonly uniforms[],

      UNIT_SIZE: number,
      MAX_ELEMS: number,
      UNITS_PER_VERTEX: number,
      VERTEX_PER_ELEM: number,
      INDICES_PER_ELEM: number,
      ) {
      super(renderer, entityList, vsSource, fsSource, attributeList, uniformList);

      // SETTING UP PIPELINE CONSTANTS
      this.UNIT_SIZE          = UNIT_SIZE;
      this.MAX_ELEMS          = MAX_ELEMS;
      this.UNITS_PER_VERTEX   = UNITS_PER_VERTEX;
      this.VERTEX_PER_ELEM    = VERTEX_PER_ELEM;
      this.INDICES_PER_ELEM   = INDICES_PER_ELEM;

      this.VERTEX_SIZE        = this.UNITS_PER_VERTEX * this.UNIT_SIZE;
      this.UNITS_PER_ELEM     = this.UNITS_PER_VERTEX * this.VERTEX_PER_ELEM;
      this.MAX_INDICES        = this.INDICES_PER_ELEM * this.MAX_ELEMS;
      this.MAX_UNITS          = this.UNITS_PER_ELEM   * this.MAX_ELEMS;
      this.MAX_SIZE           = this.MAX_UNITS        * this.UNIT_SIZE;

      let gl = this.renderer.gl;
      gl.useProgram(this.program);

      this.vao = new Float32Array(this.MAX_UNITS);
      this.vbo = <WebGLBuffer> gl.createBuffer();
      this.iao = new Uint16Array(this.MAX_INDICES);
      this.ibo = <WebGLBuffer> gl.createBuffer();
   }


   protected setAttribute(a: attributes) {
      let gl = this.renderer.gl;
      let { location, unitType, units, offset } = this.attributes[a];

      gl.useProgram(this.program);  // TODO: remove

      gl.enableVertexAttribArray(location);
      gl.vertexAttribPointer(location, units, unitType, false, this.VERTEX_SIZE, offset);
   }

   protected setAllAttributes() {
      for (const key in this.attributes) {
         this.setAttribute(key);
      };
   }

   protected setAttributes(a?: attributes[]) {
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

      this.setPerDrawCallUniforms();
      
      this.lastDrawCalls = 0;
      this.nextElemOffset = 0;

      this.flush();
   };

   protected flush(): void {
      let gl = this.renderer.gl;
      let toDrawElementCount: number;
      let entities = this.entityList;
      let offset = this.nextElemOffset;

      if (this.elemsToDraw > this.MAX_ELEMS) {
         toDrawElementCount = this.MAX_ELEMS;
      } else {
         toDrawElementCount = this.elemsToDraw;
      }
      
      for (let i = 0; i < toDrawElementCount; i++) {
         const rectangle = entities[i + offset];
         this.vao.set(this.createQuadData(rectangle), i * this.UNITS_PER_ELEM);
      };

      gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
      this.setAllAttributes();
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.vao);

      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo);
      gl.drawElements(
         gl.TRIANGLES,
         this.INDICES_PER_ELEM * toDrawElementCount, 
         gl.UNSIGNED_SHORT,
         0
      );

      this.elemsToDraw -= toDrawElementCount;
      this.lastDrawCalls++;
      if (this.elemsToDraw) this.flush();
   };
   protected abstract createQuadData(r: Entity): number[];

   /**
    * can only be called within begin method or itself recursively
    */
   protected abstract setPerDrawCallUniforms(): void;
}