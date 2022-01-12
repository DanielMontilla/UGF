import { keyCode } from "../Types/input";
import { emptyFunc } from "../Util/general";

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
      this.code = code;
      this.onDownCallback = onDownCallback;
      this.onUpCallback = onUpCallback;
      this.onDownOnceCallback = emptyFunc;
      this.pressed = false;
   }

   public onDown() {
      if (!this.pressed) this.onDownOnce();
      this.onDownCallback();
   }

   public reset() {
      this.onDownCallback = emptyFunc;
      this.onUpCallback = emptyFunc;
      this.onDownOnceCallback = emptyFunc;
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