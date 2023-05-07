import { defineOptions } from "solzu";
import { Camera, Component, Sprite } from "../core";
import { DEFAULT_SURFACE_SIZE } from "../data";
import { Renderer, WebGL2Renderer } from "../renderer";
import { AppOptions } from "../types";
import { Vec2 } from "../math";
import { Color } from "../utility";

export class Surface extends Component {
  public readonly canvas: HTMLCanvasElement;
  public readonly size: Vec2;
  public readonly renderer: Renderer;
  public readonly backgroundColor: Color;
  public readonly camera: Camera;

  public constructor(options?: AppOptions) {
    super();

    const { size, backgroundColor } = defineOptions<AppOptions>(options, {
      size: DEFAULT_SURFACE_SIZE,
      backgroundColor: Color.black(),
    });

    this.size = size;
    this.backgroundColor = backgroundColor;
    this.camera = new Camera();

    this.canvas = document.createElement('canvas');
    this.syncCanvas();

    this.renderer = new WebGL2Renderer(this);
    requestAnimationFrame(this.tick);
  }

  private lastTime = 0;
  private tick = (currentTime: DOMHighResTimeStamp) => {

    const dt = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;

    this.update(dt);

    this.draw();

    requestAnimationFrame(this.tick);
  }

  private draw() {
    this.renderer.draw(this.getAllChildren());
  }

  private syncCanvas(): void {
    this.canvas.width = this.size.x;
    this.canvas.height = this.size.y;
  }

  protected onDescendantAdded(child: Component): void {
    if (child instanceof Sprite) this.renderer.declareTexture(child.texture);
    super.onDescendantAdded(child);
  }

  protected onDescendantRemoved(child: Component): void {
    if (child instanceof Sprite) this.renderer.declareTextureRemoved(child.texture);
    super.onDescendantRemoved(child);
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