import { Vector2 } from "../math";
import { Size, Rgb } from "../utility";

export interface Position extends Vector2 {};
export interface Resolution extends Size {};

export type Color = Rgb;

export type Anchor = 
  'top left'    | 'top center'    | 'top right'     |
  'center left' | 'center'        | 'center right'  |
  'bottom left' | 'bottom center' | 'bottom right'