import { Vec2 } from "../math";
import { Color } from "../utility";
import { Sprite } from "../core";
import { Pivot } from "../utility/pivot";

export type AppOptions = {
  size?: Vec2;
  backgroundColor?: Color;
}

export interface PositionComponentOptions {
  position?: Vec2;
  layer?: number;
  size?: Vec2;
  scale?: Vec2;
  rotation?: number;
  pivot?: Pivot;
}

export interface RectangleComponentOptions extends PositionComponentOptions {
  color?: Color
}

export interface SpriteComponentOptions extends PositionComponentOptions {
  sprite: Sprite
}

export interface SpriteOptions {
  image: HTMLImageElement
}