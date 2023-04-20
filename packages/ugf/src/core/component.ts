export default class Component {
  public parent: Component | null = null;
  public readonly children: Component[] = [];

  public add(component: Component): Component {
    if (component.parent !== null) throw Error('component already has a parent');
    component.parent = this;
    this.children.push(component);
    return component;
  }

  public update(dt: number) {
    for (let index = 0; index < this.children.length; index++) {
      this.children[index].update(dt);
    }
  }

}