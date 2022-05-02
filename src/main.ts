import { rand, Rectangle, Surface } from '.';

let main = async () => {
   let s = new Surface(1200, 800, [0.2, 0.2, 0.2]);

   class myRect extends Rectangle {
      constructor(
         x = rand(0, s.width),
         y = rand(0, s.height),
         public speed = { x: rand(-150, 150), y: rand(-150, 150) }
      ) {
         super(x, y);
      }

      changeX(amount: number) {
         this.x += amount;
         if (
            this.x + this.width / this.xAnchor > s.width ||
            this.x - this.width / this.xAnchor < 0
         ) {
            this.speed.x *= -1;
         }
      }

      changeY(amount: number) {
         this.y += amount;
         if (
            this.y + this.height / this.yAnchor > s.height ||
            this.y - this.height / this.yAnchor < 0
         ) {
            this.speed.y *= -1;
         }
      }

      change(x: number, y: number) {
         this.changeX(x);
         this.changeY(y);
      }
   }

   let myRects: myRect[] = [];

   for (let i = 0; i < 500; i++) {
      myRects.push(new myRect());
   }

   s.update = (dt: number) => {
      myRects.forEach(r => {
         let dx = r.speed.x * dt;
         let dy = r.speed.y * dt;

         r.change(dx, dy);
      });
   };
};

// let arr: any[] = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ]

// console.log(`before`)
// console.log(arr)
// arr.splice(4, 2, ...['four', 'five'] );
// console.log(`after`)
// console.log(arr)

main();
