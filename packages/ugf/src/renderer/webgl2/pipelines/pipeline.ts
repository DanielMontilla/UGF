import { Attribute, ComponentPrimitive, Mat4 } from "../../../types";
import { WebGL2Renderer } from "../../../renderer";
import { constructAttributes, tryCreateBuffer, tryCreateProgram, tryCreateShader, tryCreateVertexArrayObject } from "../../../functions";
import { Component } from "../../../core";

export abstract class Pipeline<C extends Component = Component> {
  public abstract readonly primitive: ComponentPrimitive;
  
  public readonly attributes: Record<string, Attribute>;

  get context(): WebGL2RenderingContext { return this.rendererRef.context };
  get viewMatrix(): Mat4 { return this.rendererRef.viewMatrix };
  get projectionMatrix(): Mat4 { return this.rendererRef.projectionMatrix };

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

  /** Vertex Array Object. Stores layout state (IBO, attributes, ) */
  protected VAO: WebGLVertexArrayObject;
  /** Vertex Buffer Object. GPU side vertex buffer */
  protected VBO: WebGLBuffer;
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
    const { context } = this;

    this.vertexShader = tryCreateShader(context, 'vertex', vertexShaderSource).unwrap();
    this.fragmentShader = tryCreateShader(context, 'fragment', fragmentShaderSource).unwrap();
    this.program = tryCreateProgram(context, this.vertexShader, this.fragmentShader).unwrap();

    const { attributes, stride, units } = constructAttributes(context, this.program, attributesNames).unwrap();

    this.attributes = attributes;

    this.VERTEX_STRIDE = stride;
    this.UNITS_PER_VERTEX = units;
    this.MAX_OBJECTS = MAX_OBJECTS;
    this.VERTEX_PER_PRIMITIVE = VERTEX_PER_PRIMITIVE;
    this.INDICES_PER_PRIMITIVE = INDICES_PER_PRIMITIVE;
    this.UNITS_PER_OBJECT = this.UNITS_PER_VERTEX * this.VERTEX_PER_PRIMITIVE;
    this.MAX_INDICES = this.INDICES_PER_PRIMITIVE * this.MAX_OBJECTS;
    this.MAX_UNITS = this.UNITS_PER_OBJECT * this.MAX_OBJECTS;

    this.VAO = tryCreateVertexArrayObject(context).unwrap();
    this.VBO = tryCreateBuffer(context).unwrap();
    this.IBO = tryCreateBuffer(context).unwrap();

    this.setup();
  }

  protected stage() {
    const { context, program, VAO } = this;
    context.useProgram(program);
    context.bindVertexArray(VAO);
  }

  protected unstage() {
    const { context } = this;
    context.useProgram(null);
    context.bindVertexArray(null);
  }

  /** The required gl calls to setup pipeline */
  protected abstract setup(): void;

  public abstract draw(components: C[]): void;

  protected abstract getVertexData(component: C): number[];
}