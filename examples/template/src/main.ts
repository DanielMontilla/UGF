import { Surface, RectangleComponent, Vec2, Color } from 'ugf';

class Game extends Surface {}

const game = new Game();
game.mount(document.getElementById('app')!);

const rect = new RectangleComponent({
  color: new Color(0.7, 0.2, 0.5),
  position: new Vec2(10, 10),
  size: Vec2.all(64),
});

game.add(rect);