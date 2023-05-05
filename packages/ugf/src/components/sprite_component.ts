import { Sprite } from "../core";
import { PositionComponent } from "../components";
import { SpriteComponentOptions } from "../types";
import { defineOptions } from "solzu";
import { Vec2 } from "../math";

export class SpriteComponent extends PositionComponent {
  public readonly sprite: Sprite;

  public constructor(options: SpriteComponentOptions) {
    const opts = defineOptions<SpriteComponentOptions>(options, {
      position: Vec2.zero(),
      scale: Vec2.all(1),
      size: Vec2.all(32),
      rotation: 0,
      layer: 0,
      pivot: 'center'
    });

    super({ ...opts });

    const { sprite } = opts;

    this.sprite = sprite;
  }
}