import { Rectangle, Sprite } from "../UGF";

export  type rgb = [r: number, g: number, b: number];

export  type EntityPrimitiveKeys = 'sprite' | 'rectangle';
export  type EntityPrimitive = Rectangle | Sprite;

export  type frame = [ x1: number, y1: number, x2: number, y2: number ];
export  type frameDataConfig = { height: number, width: number, cols: number, rows: number };