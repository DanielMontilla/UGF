import { Attribute, ComponentPrimitive } from "../../../types";
import { WebGL2Renderer } from "../../../renderer";
import { constructAttributes, tryCreateBuffer, tryCreateProgram, tryCreateShader, tryCreateVertexArrayObject, unwrap } from "../../../functions";
import { Component } from "../../../core";

export abstract class Pipeline<C extends Component = Component> {
  public abstract readonly primitive: ComponentPrimitive;
  
  public readonly attributes: Record<string, Attribute>;

  get context(): WebGL2RenderingContext { return this.rendererRef.context };

  /** Corresponding `WebGLProgram` program */
  public readonly program: WebGLProgram;

  /** Corresponding vertex shader object */
  public readonly vertexShader: WebGLShader;

  /** Corresponding fragment shader object */
  public readonly fragmentShader: WebGLShader;
  
  /**
   * Maximium amount of objects drawn per draw call
   */
  public readonly MAX_OBJECTS: number;

  /**
   * Values (units) per vertex
   */
  public readonly UNITS_PER_VERTEX: number;

  /**
   * Amount of unique vertices in component
   * - a quad has 4 cornners, so for quad `VERTEX_PER_COMPONENT = 4`
   */
  public readonly VERTEX_PER_PRIMITIVE: number;

  /**
   * Indicies required to draw component primitive
   * - a quad is made of 2 triangles made from 3 points, so for a quad `INDICES_PER_PRIMITIVE = 2 * 3 = 6`
   */
  public readonly INDICES_PER_PRIMITIVE: number;

  /**
   * Total size (in bytes) of a single vertex
   * - for a float (4 bytes) 3 unit vertex `VERTEX_SIZE = 3 * 4 = 12`
   */
  public readonly VERTEX_STRIDE: number;

  /**
   * Amount of units in an element
   * - for quad (4 vertices) with 2 units, `UNITS_PER_COMPONENT = 4 * 2 = 8`
   * - for triangle (3 vertices) with 3 units, `UNITS_PER_COMPONENT = 3 * 3 = 9`
   */
  public readonly UNITS_PER_OBJECT: number;

  /** Max amount of indices possible. Used to set IBO length */
  public readonly MAX_INDICES: number;

  /** Max amount of units. Used to set VAO length */
  public readonly MAX_UNITS: number;

  /** Vertex Array Object. Stores vertex layout state*/
  protected VAO: WebGLVertexArrayObject;
  /** Vertex Buffer Object. GPU side vertex buffer */
  protected VBO: WebGLBuffer;
  /** Index Array Buffer. CPU side index buffer */
  protected IAO: Uint16Array;
  /** Index Buffer Object. GPU side index buffer */
  protected IBO: WebGLBuffer;

  public constructor(
    public rendererRef: WebGL2Renderer,
    vertexShaderSource: string,
    fragmentShaderSource: string,
    attributesNames: string[],
    MAX_OBJECTS: number,
    VERTEX_PER_PRIMITIVE: number,
    INDICES_PER_PRIMITIVE: number,
  ) {
    const { context, program } = this;

    this.vertexShader = unwrap(tryCreateShader(context, 'vertex', vertexShaderSource));
    this.fragmentShader = unwrap(tryCreateShader(context, 'fragment', fragmentShaderSource));
    this.program = unwrap(tryCreateProgram(context, this.vertexShader, this.fragmentShader));

    const { attributes, stride, units } = unwrap(constructAttributes(context, program, attributesNames));

    this.attributes = attributes;

    this.VERTEX_STRIDE = stride;
    this.UNITS_PER_VERTEX = units;
    this.MAX_OBJECTS = MAX_OBJECTS;
    this.VERTEX_PER_PRIMITIVE = VERTEX_PER_PRIMITIVE;
    this.INDICES_PER_PRIMITIVE = INDICES_PER_PRIMITIVE;
    this.UNITS_PER_OBJECT = this.UNITS_PER_VERTEX * this.VERTEX_PER_PRIMITIVE;
    this.MAX_INDICES = this.INDICES_PER_PRIMITIVE * this.MAX_OBJECTS;
    this.MAX_UNITS = this.UNITS_PER_OBJECT * this.MAX_OBJECTS;

    this.VAO = unwrap(tryCreateVertexArrayObject(context));
    this.VBO = unwrap(tryCreateBuffer(context));
    this.IAO = new Uint16Array(this.MAX_INDICES);
    this.IBO = unwrap(tryCreateBuffer(context));

    this.setupIndexBuffer();
    this.setupAttributes();
    this.setupUniforms();
  }

  protected stageProgram(): void {
    this.context.useProgram(this.program);
  }

  public begin(components: C[]): void {
    this.stageProgram();
    this.stageUniforms();
    this.stageAttributes();
    this.draw(components, 0);
  }

  protected abstract setupIndexBuffer(): void;
  protected abstract setupAttributes(): void;
  protected abstract setupUniforms(): void;

  protected abstract stageUniforms(): void;
  protected abstract stageAttributes(): void;

  protected abstract draw(components: C[], offset: number): void;
}