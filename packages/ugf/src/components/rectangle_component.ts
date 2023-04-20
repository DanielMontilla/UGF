import { defineOptions } from "solzu";
import { PositionComponent } from "../components";
import { Color, RectangleComponentOptions } from "../types";
import { Rgb, Size } from "../utility";
import { Vector2 } from "../math";

export default class RectangleComponent extends PositionComponent {

  public color: Color;

  public constructor(options: Partial<RectangleComponentOptions>) {
    const opts = defineOptions<RectangleComponentOptions>(options, {
      position: Vector2.Zero(),
      layer: 0,
      size: Size.All(32),
      anchor: 'center',
      scale: Vector2.All(1),
      rotation: 0,
      color: Rgb.All(0)
    });

    super({ ...opts });

    const { color } = opts;

    this.color = color;
  }
}