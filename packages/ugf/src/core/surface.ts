import { defineOptions } from "solzu";
import { Component } from "../core";
import { DEFAULT_RESOLUTION } from "../data";
import { type Renderer, WebGL2Renderer } from "../renderer";
import { Resolution, AppOptions, Color } from "../types";
import { Rgb } from "../utility";

export default abstract class Surface extends Component {
  public readonly canvas: HTMLCanvasElement;
  public readonly resolution: Resolution;
  public readonly renderer: Renderer;
  public readonly backgroundColor: Color;

  public constructor(options?: Partial<AppOptions>) {
    super();

    const { resolution, backgroundColor } = defineOptions<AppOptions>(options, {
      resolution: DEFAULT_RESOLUTION,
      backgroundColor: Rgb.All(0)
    });

    this.resolution = resolution;
    this.backgroundColor = backgroundColor;

    this.canvas = document.createElement('canvas');
    this.setupCanvas();

    this.renderer = new WebGL2Renderer(this);
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