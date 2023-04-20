import { Vector2 } from "../math";
import { Anchor, Color, Resolution } from "../types";
import { Size } from "../utility";

export type AppOptions = {
  resolution: Resolution;
  backgroundColor: Color;
}

export interface PositionComponentOptions {
  position: Vector2;
  layer: number;
  size: Size;
  scale: Vector2;
  rotation: number;
  anchor: Anchor;
}

export type RectangleComponentOptions = 
  PositionComponentOptions & {
    color: Color
  }