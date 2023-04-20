import { defineOptions } from "solzu";
import { Component } from "../core";
import { Vector2 } from "../math";
import { Anchor, PositionComponentOptions } from "../types";
import { Size } from "../utility";

export default class PositionComponent extends Component {

  public position: Vector2;
  public layer: number;
  public size: Size;
  public anchor: Anchor;
  public scale: Vector2;
  public rotation: number;

  public constructor(opts: Partial<PositionComponentOptions>) {
    super();

    const { position, layer, size, anchor, scale, rotation } = defineOptions<PositionComponentOptions>(opts, {
      position: Vector2.Zero(),
      layer: 0,
      size: Size.Zero(),
      anchor: 'center',
      scale: Vector2.All(1),
      rotation: 0,
    });

    this.position = position;
    this.layer = layer;
    this.size = size;
    this.anchor = anchor;
    this.scale = scale;
    this.rotation = rotation;
  }

}