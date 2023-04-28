import { TickCallback } from "../types";

export class Component {
  public parent: Component | null = null;
  public readonly children: Component[] = [];

  public onUpdateCallbacks: TickCallback[] = [];

  public add(component: Component): Component {
    if (component.parent !== null) throw Error('component already has a parent');
    component.parent = this;
    this.children.push(component);
    component.onMount(this);
    return component;
  }

  public remove(component: Component): void {
    if (component.parent !== this) throw Error('trying to remove child component that doesn\'t belong to children');
    component.parent = null;
    this.children.splice(this.children.indexOf(component), 1);
    component.onRemove(this);
  }

  protected update(dt: number) {
    for (let i = this.onUpdateCallbacks.length - 1; i >= 0; i--) this.onUpdateCallbacks[i](dt);
    for (let i = this.children.length - 1; i >= 0; i--) this.children[i].update(dt);
  }

  protected onMount(_to: Component) {}
  protected onRemove(_from: Component) {};

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

}