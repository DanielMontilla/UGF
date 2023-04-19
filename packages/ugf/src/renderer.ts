import Surface from "./surface";
import VERTEX_SOURCE from "./data/shaders/rectangle/vertex.glsl?raw";
import FRAGMENT_SOURCE from "./data/shaders/rectangle/fragment.glsl?raw";
import { Resolution } from "./types";
import { createShader, createProgram } from "./functions";

export default class Renderer {
  public readonly surfaceRef: Surface;
  public readonly context: WebGL2RenderingContext;

  public readonly vertexShader: WebGLShader;
  public readonly fragmentShader: WebGLShader;
  public readonly program: WebGLProgram;
  
  get canvas(): HTMLCanvasElement { return this.surfaceRef.canvas };
  get resolution(): Resolution { return this.surfaceRef.resolution };

  public constructor(surfaceRef: Surface) {
    this.surfaceRef = surfaceRef;

    const context = this.canvas.getContext('webgl2')!;

    this.context = context;

    this.vertexShader = createShader(context, 'vertex', VERTEX_SOURCE);
    this.fragmentShader = createShader(context, 'fragment', FRAGMENT_SOURCE);
    this.program = createProgram(context, this.vertexShader, this.fragmentShader);

  }
}