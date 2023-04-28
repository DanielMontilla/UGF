import { Surface, RectangleComponent, Vec2, Color, Component } from 'ugf';
import { bindKey } from '@rwh/keystrokes';

const game = new Surface();
game.mount(document.getElementById('app')!);

const rect = new RectangleComponent({
  color: new Color(0.7, 0.2, 0.5),
  position: new Vec2(100, 100),
  size: Vec2.all(64),
});

game.add(rect.setAnchor('bottom left'));

const rect2 = new RectangleComponent({
  color: new Color(0.1, 0.9, 0.0),
  position: new Vec2(100, 100),
  size: Vec2.all(32), 
});

rect.add(rect2);
const rect3 = new RectangleComponent({
  color: new Color(0.1, 0.9, 0.0),
  position: new Vec2(100, 100),
  size: Vec2.all(32),
});

const comp1 = new Component();
comp1.add(rect3);

rect2.add(comp1);

bindKey('d', { onPressed: () => rect.x += 10 });
bindKey('s', { onPressed: () => rect.y += 10 });
bindKey('w', { onPressed: () => rect.y -= 10 });
bindKey('a', { onPressed: () => rect.x -= 10 });

bindKey('arrowright', { onPressed: () => rect2.x += 10 });
bindKey('arrowdown', { onPressed: () => rect2.y += 10 });
bindKey('arrowleft', { onPressed: () => rect2.x -= 10 });
bindKey('arrowup', { onPressed: () => rect2.y -= 10 });

bindKey(' ', { onPressed: () => rect.rotation += Math.PI/4 });
bindKey('enter', { onPressed: () => {
  rect.anchor === 'center' ? rect.setAnchor('bottom left') : rect.setAnchor('center');
  console.log(rect.anchor);
} });

// const movementr1 = {
//   right: false,
//   left: false,
//   up: false,
//   down: false,
// };

// const movementr2 = {
//   right: false,
//   left: false,
//   up: false,
//   down: false,
// };

// bindKey('d', { onPressed: () => movementr1.right = true, onReleased: () => movementr1.right = false });
// bindKey('a', { onPressed: () => movementr1.left = true, onReleased: () => movementr1.left = false });
// bindKey('w', { onPressed: () => movementr1.up = true, onReleased: () => movementr1.up = false });
// bindKey('s', { onPressed: () => movementr1.down = true, onReleased: () => movementr1.down = false });

// bindKey('arrowright', { onPressed: () => movementr2.right = true, onReleased: () => movementr2.right = false });
// bindKey('arrowleft', { onPressed: () => movementr2.left = true, onReleased: () => movementr2.left = false });
// bindKey('arrowup', { onPressed: () => movementr2.up = true, onReleased: () => movementr2.up = false });
// bindKey('arrowdown', { onPressed: () => movementr2.down = true, onReleased: () => movementr2.down = false });

// const speed = 250;

// game.addOnUpdateCallback(dt => {
//   if (movementr1.right) rect.x += speed * dt;
//   if (movementr1.left)  rect.x -= speed * dt;
//   if (movementr1.up)    rect.y -= speed * dt;
//   if (movementr1.down)  rect.y += speed * dt;

//   if (movementr2.right) rect2.x += speed * dt;
//   if (movementr2.left)  rect2.x -= speed * dt;
//   if (movementr2.up)    rect2.y -= speed * dt;
//   if (movementr2.down)  rect2.y += speed * dt;
// })