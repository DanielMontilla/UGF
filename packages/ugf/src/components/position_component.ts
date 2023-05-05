import { defineOptions } from "solzu";
import { Component } from "../core";
import { PivotPoint, PositionComponentOptions } from "../types";
import { Vec2, vec2 } from "../math";
import { Mat4 } from "../math/mat4";
import { Pivot } from "../utility/pivot";
import { ComputedRef, Ref, computed, reactive, ref, watch } from "../utility/reactivity";

export class PositionComponent extends Component {

  public static next = 0;
  public readonly id: number = PositionComponent.next++;

  public readonly position: Vec2;
  public readonly scale: Vec2;
  public readonly size: Vec2;
  public readonly pivot: Pivot;
  private _rotation: Ref<number>;
  private _layer: Ref<number>;

  private readonly _offset: ComputedRef<Vec2>;

  public readonly localTransformMatrix: Mat4 = Mat4.identity();
  public readonly worldTransformMatrix: Mat4 = Mat4.identity();

  private readonly translationMatrix: Mat4 = Mat4.identity();
  private readonly rotationMatrix: Mat4 = Mat4.identity();
  private readonly scaleMatrix: Mat4 = Mat4.identity();

  private unsubcriptions: Function[] = [];

  public constructor(options?: PositionComponentOptions) {
    super();

    const { position, layer, pivot, size, scale, rotation } = defineOptions<PositionComponentOptions>(options, {
      position: Vec2.zero(),
      size: Vec2.zero(),
      scale: Vec2.all(1),
      rotation: 0,
      layer: 0,
      pivot: Pivot.center(),
    });

    this.position = reactive(position.clone());
    this._layer = ref(layer);
    this.size = reactive(size.clone());
    this.pivot = reactive(pivot.clone());
    this.scale = scale;
    this._rotation = ref(rotation);

    this._offset = computed(() => Vec2.multiply(this.pivot, this.size));
  }
  
  protected onMount() {
    this.unsubcriptions.push(...[
      watch(
        [this.position],
        () => this.updateLocalMatrix(true), { deep: true }
      ),
    ]);

    this.updateLocalMatrix(false); // we don't propagete matrix updates since `onMount` is called by every subsequent child
    super.onMount();
  }

  protected onUnmounted() {
    this.unsubcriptions.forEach(s => s());
    super.onUnmounted();
  }

  private updateLocalMatrix(propagate: boolean = true) {
    // translation:
    this.translationMatrix.translateTo(this.position, this.layer);

    // rotation:
    

    this.localTransformMatrix.setFromMat4(
      Mat4.identity()
        .multiply(this.translationMatrix)
        .multiply(this.rotationMatrix)
        .multiply(this.scaleMatrix)
    );

    this.updateWorldMatrix(propagate);
  }

  private updateWorldMatrix(propagate: boolean = true) {
    const parent = this.getNearestPositionParent();

    this.worldTransformMatrix.setFromMat4(
      parent === null
        ? this.localTransformMatrix
        : this.localTransformMatrix.multiply(parent.worldTransformMatrix)
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

  get layer(): number { return this._layer.value };

  get worldX(): number { return this.worldTransformMatrix.tx }
  get worldY(): number { return this.worldTransformMatrix.ty }
  get worldLayer(): number { return this.worldTransformMatrix.layer }

  get offset(): Vec2 { return this._offset.value };

  public setPivot(pivot: Vec2 | PivotPoint) {
    if (typeof pivot === 'string') {
      this.pivot.setFrom(Pivot.fromPoint(pivot));
    } else {
      this.pivot.setFrom(pivot);
    }
    return this;
  }
}