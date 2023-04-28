import { Vec2 } from "../math";
import { Color } from "../utility";
import { Anchor } from "../types";
import { Sprite } from "../core";

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
  anchor?: Anchor;
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