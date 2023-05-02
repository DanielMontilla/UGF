import { ComponentPrimitive } from "../../../types";
import { WebGL2Renderer } from "../../../renderer";
import { Component } from "../../../core";
import { Mat4 } from "../../../math";

export abstract class Pipeline<C extends Component = Component> {
  public abstract readonly primitive: ComponentPrimitive;

  get context(): WebGL2RenderingContext { return this.rendererRef.context };
  get viewMatrix(): Mat4 { return this.rendererRef.viewMatrix };
  get projectionMatrix(): Mat4 { return this.rendererRef.projectionMatrix };

  public readonly rendererRef: WebGL2Renderer;

  /** Corresponding `WebGLProgram` program */
  public abstract readonly program: WebGLProgram;

  /** Corresponding vertex shader object */
  public abstract readonly vertexShader: WebGLShader;

  /** Corresponding fragment shader object */
  public abstract readonly fragmentShader: WebGLShader;

  /** Vertex Array Object. Stores layout state (IBO, attributes, ) */
  protected abstract VAO: WebGLVertexArrayObject;
  /** Vertex Buffer Object. GPU side vertex buffer */
  protected abstract VBO: WebGLBuffer;
  /** Index Buffer Object. GPU side index buffer */
  protected abstract IBO: WebGLBuffer;

  public constructor(renderRef: WebGL2Renderer) {
    this.rendererRef = renderRef;
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

  public abstract draw(components: C[]): void;
}