import { Surface, RectangleComponent, Vec2, Color, Component } from 'ugf';
import { bindKey } from '@rwh/keystrokes';

const game = new Surface();
game.mount(document.getElementById('app')!);

const rect = new RectangleComponent({
  color: new Color(0.1, 0.2, 0.5),
  position: new Vec2(100, 100),
  size: Vec2.all(128),
});

const rect2 = new RectangleComponent({
  color: new Color(0.1, 0.7, 0.1),
  position: new Vec2(100, 100),
  size: Vec2.all(64),
});

rect.add(rect2);

game.add(rect);

console.log(rect.worldMat.toString());

bindKey('d', { onPressed: () => rect.x += 10 })
bindKey('a', { onPressed: () => rect.x -= 10 })
bindKey('s', { onPressed: () => rect.y += 10 })
bindKey('w', { onPressed: () => rect.y -= 10 })

bindKey('arrowright', { onPressed: () => rect2.x += 10 });
bindKey('arrowdown', { onPressed: () => rect2.y += 10 });
bindKey('arrowleft', { onPressed: () => rect2.x -= 10 });
bindKey('arrowup', { onPressed: () => rect2.y -= 10 });