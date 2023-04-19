import { Component } from "./components";
import { DEFAULT_RESOLUTION } from "./data";
import Renderer from "./renderer";
import { Resolution, AppOptions } from "./types";


export default abstract class Surface extends Component {
  public readonly canvas: HTMLCanvasElement;
  public readonly resolution: Resolution;
  public readonly renderer: Renderer;

  public constructor(options: AppOptions) {
    super();

    const { resolution } = options;

    this.resolution = resolution ? resolution : DEFAULT_RESOLUTION;
    this.canvas = document.createElement('canvas');
    this.setupCanvas();

    this.renderer = new Renderer(this);
  }

  private setupCanvas(): void {
    this.canvas.width = this.resolution.width;
    this.canvas.height = this.resolution.height;
  }

  public mount(on: 'body'): void;
  public mount(on: HTMLElement): void;
  public mount(on: HTMLElement | 'body') {
    if (typeof on === 'string') {
      switch (on) {
        case 'body':
          document.body.append(this.canvas);
          break;
      
        default:
          throw Error(`invalid target '${on}'`)
      }
      return;
    }

    on.appendChild(this.canvas);
  }
}