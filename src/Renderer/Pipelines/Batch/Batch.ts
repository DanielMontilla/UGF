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

   protected vab: Float32Array; // Vertex Array Buffer  -> CPU side vertex buffer
   protected vao: Float32Array;  // Vertex Array Object  -> CPU side vertex (draw) buffer
   protected vbo: WebGLBuffer;   // Vertex Buffer Object -> GPU side vertex buffer
   protected iao: Uint16Array;   // Index Array Buffer   -> CPU side index buffer
   protected ibo: WebGLBuffer;   // Index Buffer Object  -> GPU side index buffer

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

      this.vab = new Float32Array();
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
      let vao = this.vao;
      let vab = this.vab;
      
      this.lastDrawCalls = 0;                            // 1. Reset stats
      this.populateVAB();                                // 2. Populate Vertex Array Buffer with all vertex values from entityList
      while (vab.length != 0) {                          // 3. check if the lenght of Vertex Array Buffer is != 0
         if (vab.length > vao.length) {                  // 4. if vab is more than vao then:
            vao.set(vab.subarray(0, vao.length));        // 4a. Fill vao with vab segment
            this.elemsToDraw = this.MAX_ELEMS;           // 4b. set elems to draw to max
            vab = vab.subarray(vao.length, vab.length);  // 4c. delete/shift values in vab
         } else {                                        // 5. if vao is less than or equal to vab lenght then:
            vao.set(vab);                                // 5a. Copy vab contents into vao
            this.elemsToDraw =                           // 5b. set elems to draw to elems in vab
               vab.length / this.UNITS_PER_ELEM
            vab = new Float32Array();                    // 5c. empty vab
         }

         this.flush();                             // 6. flush
      }
   };

   private populateVAB(): void {
      for (let i = 0; i < this.entityList.length; i++) {
         let data = this.createQuadData(this.entityList[i]);
         this.vab.set(data, i * this.UNITS_PER_ELEM)
      };
   }

   protected abstract createQuadData(r: Entity): number[];

   protected abstract flush(): void;
}