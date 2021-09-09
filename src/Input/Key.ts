import { emptyFunc } from "../util";

export default class Key {

   public readonly code: keyCode;
   public pressed: boolean;

   public onDownCallback: () => void;
   public onUpCallback: () => void;
   public onDownOnceCallback: () => void;

   constructor(
      code: keyCode,
      onDownCallback: () => void = emptyFunc,
      onUpCallback: () => void = emptyFunc
      ) {
      this.code               = code;
      this.onDownCallback     = onDownCallback;
      this.onUpCallback       = onUpCallback;
      this.onDownOnceCallback = emptyFunc;
      this.pressed            = false;
   }

   public onDown() {
      if (!this.pressed) this.onDownOnce();
      this.onDownCallback();
   }

   public onUp() {
      this.pressed = false;
      this.onUpCallback();
   }

   private onDownOnce() {
      this.pressed = true;
      this.onDownOnceCallback();
   }
}