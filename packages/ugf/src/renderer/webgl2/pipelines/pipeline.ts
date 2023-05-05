import { ComponentPrimitive } from "../../../types";
import { WebGL2Renderer } from "../../../renderer";
import { Component } from "../../../core";
import { Mat4 } from "../../../math";
import { tryCreateBuffer, tryCreateProgram, tryCreateShader, tryCreateVertexArrayObject } from "../../../functions/webgl";

export abstract class Pipeline<C extends Component = Component> {
  public abstract readonly primitive: ComponentPrimitive;

  get context(): WebGL2RenderingContext { return this.rendererRef.context };
  get viewMatrix(): Mat4 { return this.rendererRef.viewMatrix };
  get projectionMatrix(): Mat4 { return this.rendererRef.projectionMatrix };

  public readonly rendererRef: WebGL2Renderer;

  /** Corresponding `WebGLProgram` program */
  public readonly program: WebGLProgram;

  /** Corresponding vertex shader object */
  public readonly vertexShader: WebGLShader;

  /** Corresponding fragment shader object */
  public readonly fragmentShader: WebGLShader;

  /** Vertex Array Object */
  protected readonly vertexArrayObject: WebGLVertexArrayObject;

  /** Index Buffer Object. GPU side index buffer */
  protected readonly indexBuffer: WebGLBuffer;

  /** Vertex Data Buffer. GPU side vertex data buffer */
  protected readonly vertexDataBuffer: WebGLBuffer;
  
  /** Instance Data Buffer. GPU side instance data buffer */
  protected readonly instanceDataBuffer: WebGLBuffer;

  public constructor(
    renderRef: WebGL2Renderer,
    vertexShaderSource: string,
    fragmentShaderSource: string,
  ) {
    this.rendererRef = renderRef;
    
    const { context } = this;

    this.vertexShader = tryCreateShader(context, 'vertex', vertexShaderSource).unwrap();
    this.fragmentShader = tryCreateShader(context, 'fragment', fragmentShaderSource).unwrap();
    this.program = tryCreateProgram(context, this.vertexShader, this.fragmentShader).unwrap();

    this.vertexArrayObject = tryCreateVertexArrayObject(context).unwrap();
    
    this.indexBuffer = tryCreateBuffer(context).unwrap();
    this.vertexDataBuffer = tryCreateBuffer(context).unwrap();
    this.instanceDataBuffer = tryCreateBuffer(context).unwrap();
  }

  protected stage() {
    const { context, program, vertexArrayObject } = this;
    context.useProgram(program);
    context.bindVertexArray(vertexArrayObject);
  }

  protected unstage() {
    const { context } = this;
    context.useProgram(null);
    context.bindVertexArray(null);
  }

  public abstract draw(components: C[]): void;
}