import Key from "./Key";

export default class InputHandler {

   public readonly canvas: HTMLCanvasElement;

   private keyResgistry: Dictionary < keyCode, Key > = {};
   
   constructor(canvas: HTMLCanvasElement) {
      this.canvas = canvas;
      this.canvas.tabIndex = 0;
      this.canvas.focus();

      this.canvas.addEventListener('keydown', 
         (e: KeyboardEvent) => { this.keyBoardEventCallback( <keyCode> e.key, 'keydown') }
      );

      this.canvas.addEventListener('keyup', 
         (e: KeyboardEvent) => { this.keyBoardEventCallback( <keyCode> e.key, 'keyup') }
      );
   }

   public addKey = (
      keyCode: keyCode,
      onDownCallback?: () => void,
      onUpCallback?: () => void
   ): Key => {
      let key = new Key(keyCode, onDownCallback, onUpCallback);
      this.keyResgistry[key.code] = key;
      return key;
   }

   private keyBoardEventCallback = (keyCode: keyCode, event: keyEvent) => {
      let key = this.keyResgistry[keyCode];

      if (!key) return;

      switch (event) {
         case 'keydown':
            key.onDown();
            break;

         case 'keyup':
            key.onUp();
            break;
      }
   }
}