import { defineOptions } from "solzu";
import { Component } from "../core";
import { PivotPoint, PositionComponentOptions } from "../types";
import { Vec2 } from "../math";
import { Mat4 } from "../math/mat4";
import { Pivot } from "../utility/pivot";
import { ComputedRef, Ref, computed, reactive, ref, watch } from "../utility/reactivity";

export class PositionComponent extends Component {

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
      scale: Vec2.all(1),
      size: Vec2.zero(),
      pivot: Pivot.center(),
      rotation: 0,
      layer: 0,
    });

    this.position = reactive(position);
    this._layer = ref(layer);
    this.size = reactive(size);
    this.pivot = reactive(pivot);
    this.scale = reactive(scale);
    this._rotation = ref(rotation);

    this._offset = computed(() => Vec2.multiply(this.pivot, this.size));
  }
  
  protected onMount() {
    this.unsubcriptions.push(...[
      watch([this.position, this._layer], () => this.updateTranslationMatrix(), { deep: true }),
      watch([this._rotation], () => this.updateRotationMatrix(), { deep: true }),
      watch(this.scale, () => this.updateScaleMatrix(), { deep: true })
    ]);

    this.updateTranslationMatrix(false);
    this.updateRotationMatrix(false);
    this.updateScaleMatrix(false);
    this.updateLocalMatrix(false); // we don't propagate matrix updates since `onMount` is called by every subsequent child
    super.onMount();
  }

  protected onUnmounted() {
    this.unsubcriptions.forEach(s => s());
    super.onUnmounted();
  }

  private updateTranslationMatrix(shouldUpdateLocal: boolean = true, propagate: boolean = true) {
    this.translationMatrix.translateTo(this.position, this.layer);
    if (shouldUpdateLocal) this.updateLocalMatrix(propagate);
  }

  private updateRotationMatrix(shouldUpdateLocal: boolean = true, propagate: boolean = true) {
    this.rotationMatrix.rotateAlongZTo(this.rotation);
    if (shouldUpdateLocal) this.updateLocalMatrix(propagate);
  }
  
  private updateScaleMatrix(shouldUpdateLocal: boolean = true, propagate: boolean = true) {
    this.scaleMatrix.scaleTo(this.scale);
    if (shouldUpdateLocal) this.updateLocalMatrix(propagate);
  }

  private updateLocalMatrix(propagate: boolean = true) {
    this.localTransformMatrix.set = Mat4.identity()
      .multiply(this.translationMatrix)
      .translateBy(this.position.negate())
      .multiply(this.rotationMatrix)
      .multiply(this.scaleMatrix)
      .translateBy(this.position)

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
    // TODO: `use traverseParents` funciton
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

  get layer(): number { return this._layer.value }

  get worldX(): number { return this.worldTransformMatrix.tx }
  get worldY(): number { return this.worldTransformMatrix.ty }
  get worldLayer(): number { return this.worldTransformMatrix.layer }

  get offset(): Vec2 { return this._offset.value }

  public setPivot(pivot: Vec2 | PivotPoint) {
    if (typeof pivot === 'string') {
      this.pivot.setFrom(Pivot.fromPoint(pivot));
    } else {
      this.pivot.setFrom(pivot);
    }
    return this;
  }

  public get rotation(): number { return this._rotation.value }
  public set rotation(n: number) { this._rotation.value = n }

  public get scaleX(): number { return this.scale.x }
  public get scaleY(): number { return this.scale.y }
  public set scaleX(n: number) { this.scaleX = n }
  public set scaleY(n: number) { this.scaleY = n }

  public set scaleAll(n: number) { this.scale.set(n , n) }

  public scaleBy(n: number) { this.scale.set(this.scaleX + n, this.scaleY + n) }

}