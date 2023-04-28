import { defineOptions } from "solzu";
import { Component } from "../core";
import { Anchor, PositionComponentOptions } from "../types";
import { Vec2 } from "../math";

export class PositionComponent extends Component {

  public readonly position: Vec2;
  public readonly size: Vec2;
  public readonly scale: Vec2;
  private _rotation: number;
  private _layer: number;
  private _anchor: Anchor;

  private readonly _offset: Vec2 = Vec2.zero();
  public readonly _worldPosition: Vec2 = Vec2.zero();

  public constructor(options?: PositionComponentOptions) {
    super();

    const { position, layer, size, anchor, scale, rotation } = defineOptions<PositionComponentOptions>(options, {
      position: Vec2.zero(),
      size: Vec2.zero(),
      scale: Vec2.zero(),
      rotation: 0,
      layer: 0,
      anchor: 'center',
    });

    this.position = applyPositionProxy(this, position);
    this.size = size;
    this.scale = scale;

    this._layer = layer;
    this._anchor = anchor;
    this._rotation = rotation;
  }

  protected onMount(to: Component): void {
    super.onMount(to);
    this.syncTransform();
  }

  public hasPositionParent(): this is PositionComponent & { parent: PositionComponent } {
    return this.parent instanceof PositionComponent;
  }

  public getNearestPositionParent(): PositionComponent | null {
    let component = this.parent;

    while (component !== null) {
      if (component instanceof PositionComponent) return component;
      component = component.parent;
    }

    return null;
  }

  public getNearestParentPosition(): Vec2 {
    const parent = this.getNearestPositionParent();
    return parent !== null 
      ? parent._worldPosition
      : this.position.copy();
  }

  /**
   * Correctly sets computes all required transform properties
   */
  public syncTransform(propagate: boolean = true): void {
    const parent = this.getNearestParentPosition();
    this._worldPosition.x = this.x + parent.x;
    this._worldPosition.y = this.y + parent.y;
    this.computeLocalOrigin();
    if (propagate) {
      this.traverseChildren(child => {
        if (child instanceof PositionComponent) child.syncTransform(false);
      });
    }
  }

  public computeLocalOrigin() {
    let xOffset = 0;
    let yOffset = 0;

    switch (this._anchor) {
      case 'bottom left':
      case 'bottom center':
      case 'bottom right':
        yOffset = -this.size.y;
        break;
        case 'center left':
      case 'center':
      case 'center right':
        yOffset = -(this.size.y / 2);
        break;
    }
    switch (this._anchor) {
      case 'top right':
      case 'center right':
      case 'bottom right':
        xOffset = -this.size.x;
        break;
      case 'top center':
      case 'center':
      case 'bottom center':
        xOffset = -(this.size.x / 2);
        break;
    }

    this._offset.x = xOffset;
    this._offset.y = yOffset;
  }

  get x(): number { return this.position.x }
  get y(): number { return this.position.y }
  set x(n: number) { this.position.x = n }
  set y(n: number) { this.position.y = n }

  get worldX(): number { return this._worldPosition.x }
  get worldY(): number { return this._worldPosition.y }

  get scaleX(): number { return this.scale.x }
  get scaleY(): number { return this.scale.y }
  set scaleX(n: number) { this.scale.x = n }
  set scaleY(n: number) { this.scale.y = n }

  public setScale(n: number): typeof this;
  public setScale(x: number, y?: number): typeof this {
    this.scaleX = x;
    this.scaleY = y !== undefined
      ? y
      : x;
    return this;
  }

  get rotation(): number { return this._rotation }
  set rotation(n: number) { this._rotation = n }

  get layer(): number { return this._layer }
  set layer(n: number) { this._layer = n }

  get anchor(): Anchor { return this._anchor }
  set anchor(a: Anchor) {
    if (a === this._anchor) return;
    this._anchor = a;
    this.computeLocalOrigin();
  }

  public setAnchor(a: Anchor): typeof this {
    this.anchor = a;
    return this;
  }

  get offset(): Vec2 { return this._offset }
  get offsetX(): number { return this.offset.x }
  get offsetY(): number { return this.offset.y }

}

function applyPositionProxy(component: PositionComponent, position: Vec2) {
  return new Proxy<Vec2>(position, {
    set<P extends keyof Vec2>(vec: Vec2, prop: P, value: Vec2[P]) {
      vec[prop] = value; // update property
      if (prop === 'x' || prop  === 'y') component.syncTransform();
      return true;
    }
  });
}