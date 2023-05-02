import { defineOptions } from "solzu";
import { Component } from "../core";
import { Anchor, PositionComponentOptions } from "../types";
import { Vec2 } from "../math";
import { Mat4 } from "../math/mat4";

export class PositionComponent extends Component {

  public static next = 0;
  public readonly id: number = PositionComponent.next++;

  public readonly position: Vec2;
  public readonly scale: Vec2;
  public readonly size: Vec2;
  private _anchor: Anchor;
  private _rotation: number;
  private _layer: number;

  public readonly localMat: Mat4 = Mat4.identity();
  public readonly worldMat: Mat4 = Mat4.identity();

  public constructor(options?: PositionComponentOptions) {
    super();

    const { position, layer, anchor, size, scale, rotation } = defineOptions<PositionComponentOptions>(options, {
      position: Vec2.zero(),
      size: Vec2.zero(),
      scale: Vec2.zero(),
      rotation: 0,
      layer: 0,
      anchor: 'center',
    });

    this.position = applyVecProxy(this, position);
    this._layer = layer;
    this.size = size;
    this._anchor = anchor;
    this.scale = scale;
    this._rotation = rotation;
  }
  
  protected onMount(to: Component) {
    this.updateLocalMatrix(false);
    super.onMount(to);
  }

  public updateLocalMatrix(propagate: boolean = true) {
    this.localMat.tx = this.position.x;
    this.localMat.ty = this.position.y;
    this.localMat.tz = this._layer;
    // this.localMat.rotation = this._rotation;
    this.updateWorldMatrix(propagate);
  }

  public updateWorldMatrix(propagate: boolean = true) {
    const parent = this.getNearestPositionParent();

    this.worldMat.setFromMat4(
      parent === null
        ? this.localMat
        : this.localMat.multiplyBy(parent.worldMat)
    );

    if (propagate) {
      this.traverseChildren(child => child instanceof PositionComponent ? child.updateWorldMatrix(false) : null);
    }
  }

  public getNearestPositionParent(): PositionComponent | null {
    let component = this.parent;
    while (component !== null) {
      if (component instanceof PositionComponent) return component;
      component = component.parent;
    }
    return null;
  }

  get x(): number { return this.position.x }
  get y(): number { return this.position.y }
  set x(n: number) { this.position.x = n }
  set y(n: number) { this.position.y = n }

  get rotation(): number { return this._rotation }
  set rotation(n: number) {
    this._rotation = n;
    this.updateLocalMatrix(true);
  }

  get worldX(): number { return this.worldMat.tx }
  get worldY(): number { return this.worldMat.ty }
  get worldLayer(): number { return this.worldMat.layer }
}

function applyVecProxy(component: PositionComponent, vector: Vec2) {
  return new Proxy<Vec2>(vector, {
    set<P extends 'x' | 'y'>(vec: Vec2, prop: P, value: Vec2[P]) {
      vec[prop] = value; // update property
      component.updateLocalMatrix(true);
      return true;
    }
  });
}