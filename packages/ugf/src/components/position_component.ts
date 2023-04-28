import { defineOptions } from "solzu";
import { Component } from "../core";
import { Anchor, PositionComponentOptions } from "../types";
import { Vec2 } from "../math";

export class PositionComponent extends Component {

  public readonly position: Vec2;
  public readonly size: Vec2;
  public readonly scale: Vec2;
  public readonly rotation: number;
  public readonly layer: number;
  public readonly anchor: Anchor;

  public _worldPosition: Vec2 = Vec2.zero();

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

    this.layer = layer;
    this.anchor = anchor;
    this.rotation = rotation;
  }

  public add(component: Component): Component {
    super.add(component);
    if (component instanceof PositionComponent) {
      component._worldPosition.x = component.x + this.x;
      component._worldPosition.y = component.y + this.y;
    }
    return component;
  }

  protected onMount(parent: Component): void {
    super.onMount(parent);
  }

  public hasPositionParent(): this is PositionComponent & { parent: PositionComponent } {
    return this.parent instanceof PositionComponent;
  }

  public isRoot(): this is PositionComponent & { parent: Component } {
    return !this.hasPositionParent()
  };

  get x(): number { return this.position.x }
  get y(): number { return this.position.y }
  set x(n: number) { this.position.x = n }
  set y(n: number) { this.position.y = n }

  get worldX(): number { return this.isRoot() ? this.x : this._worldPosition.x }
  get worldY(): number { return this.isRoot() ? this.y : this._worldPosition.y }

  get scaleX(): number { return this.scale.x }
  get scaleY(): number { return this.scale.y }
  set scaleX(n: number) { this.scale.x = n }
  set scaleY(n: number) { this.scale.y = n }

  public setScale(n: number): void;
  public setScale(x: number, y?: number) {
    this.scaleX = x;
    this.scaleY = y !== undefined
      ? y
      : x;
  }
}

function applyPositionProxy(component: PositionComponent, position: Vec2) {
  return new Proxy<Vec2>(position, {
    set<P extends keyof Vec2>(vec: Vec2, prop: P, value: Vec2[P]) {
      vec[prop] = value; // update property
      if (prop === 'x' || prop  === 'y') { // if prop is a vec component
        const vec_component: 'x' | 'y' = prop;
        if (component.hasPositionParent()) { // if parent is position component
          component._worldPosition[vec_component] = component.parent[vec_component] + component.position[vec_component];
        }
        for (const child of component.children) {
          if (child instanceof PositionComponent) {
            child._worldPosition[vec_component] = child.position[vec_component] + component.position[vec_component];
          }
        }
      }
      return true;
    }
  });
}