import { TickCallback } from "../types";
import { Surface } from "../core";

export class Component {

  private static next = 0;
  public readonly id: number = Component.next++;

  public parent: Component | null = null;
  public readonly children: Component[] = [];

  public onUpdateCallbacks: TickCallback[] = [];

  public add(component: Component): Component {

    if (component.parent !== null) throw Error('component already has a parent');

    component.parent = this;
    this.children.push(component);

    component.onAdded();

    if (component.isAttachedToSurface) {
      component.onMount();
      component.traverseChildren(c => c.onMount());
    };

    return component;
  }

  public remove(component: Component): void {

    if (component.parent !== this) throw Error('trying to remove child component that doesn\'t belong to children');

    component.parent = null;
    this.children.splice(this.children.indexOf(component), 1);

    component.onRemove();

    if (this.isAttachedToSurface) {
      component.onUnmounted();
      component.traverseChildren(c => c.onUnmounted());
    }
  }

  protected update(dt: number) {
    for (let i = this.onUpdateCallbacks.length - 1; i >= 0; i--) this.onUpdateCallbacks[i](dt);
    for (let i = this.children.length - 1; i >= 0; i--) this.children[i].update(dt);
  }

  public get isAttachedToSurface(): boolean {
    let component = this.parent;
    while (component !== null) {
      if (component instanceof Surface) return true;
      component = component.parent;
    }
    return false;
  }

  /** When component is `.add` to parent */
  protected onAdded() {}
  /** When comopnent is `.remove` from parent */
  protected onRemove() {}
  
  /** when it or its parent is mounted to surface */
  protected onMount() {}
  /** when it or any of its parent is unmounted from surface */
  protected onUnmounted() {}

  public addOnUpdateCallback(callback: TickCallback) {
    this.onUpdateCallbacks.push(callback);
  }

  public getAllChildren(): Component[] {
    const allChildren: Component[] = [];
    for (const child of this.children) {
      allChildren.push(child);
      allChildren.push(...child.getAllChildren());
    }
    return allChildren;
  }

  public traverseChildren(actionCallback: (child: Component) => void) {
    for (const child of this.children) {
      actionCallback(child);
      child.traverseChildren(actionCallback);
    }
  }
}