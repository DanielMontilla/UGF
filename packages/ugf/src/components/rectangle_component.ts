import { defineOptions } from "solzu";
import { PositionComponent } from ".";
import { RectangleComponentOptions } from "../types";
import { Color } from "../utility";
import { Vec2 } from "../math";

export class RectangleComponent extends PositionComponent {

  public color: Color;

  public constructor(options?: RectangleComponentOptions) {
    const opts = defineOptions<RectangleComponentOptions>(options, {
      position: Vec2.zero(),
      scale: Vec2.all(1),
      size: Vec2.all(32),
      rotation: 0,
      layer: 0,
      anchor: 'center',
      color: Color.white()
    });

    super({ ...opts });

    const { color } = opts;

    this.color = color;
  }

  public get width() { return this.size.x };
  public get height() { return this.size.y };

  public get r() { return this.color.r };
  public get g() { return this.color.g };
  public get b() { return this.color.b };
  public get alpha() { return 1 };
}