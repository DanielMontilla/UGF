import Game from "./Game";

/* LOADING (ASSETS) PHASE */
const loadImage = async (path: string) => {
   let img = new Image();
   img.src = path;
   await img.decode();
   return img;
}

const start = async () => {
   let img = await loadImage('assets/debug.png');
   let game = Game.init();
   let i = game.createRect(100, 100);
   game.createRect(300, 100);
   game.createSprite(100, 100, img);
}

start();

