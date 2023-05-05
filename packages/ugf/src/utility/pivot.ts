import { Vec2 } from "../math";
import { PivotPoint } from "../types";

export class Pivot extends Vec2 {

  public constructor(x: number, y: number) {
    super(x, y);
  }

  public get point(): PivotPoint | 'other' {
    let vertical: 'top' | 'center' | 'bottom' | null = null;
    let horizontal: 'left' | 'center' | 'right' | null = null;

    switch (this.x) {
      case 0:
        horizontal = 'left'
        break;
      case 0.5:
        horizontal = 'center'
        break;
      case 1:
        horizontal = 'right'
        break;
    }

    switch (this.y) {
      case 0:
        vertical = 'top'
        break;
      case 0.5:
        vertical = 'center'
        break;
      case 1:
        vertical = 'bottom'
        break;
    }

    if (vertical === null || horizontal === null) return 'other';
    if (vertical === 'center' && horizontal === 'center') return 'center';

    return `${vertical} ${horizontal}` as PivotPoint;
  }

  public clone(): Pivot {
    return new Pivot(this.x, this.y);
  }

  public static center(): Pivot {
    return new Pivot(0.5, 0.5);
  }

  public static fromPoint(point: PivotPoint) {
    let x = 0;
    let y = 0;

    switch (point) {
      case 'bottom left':
      case 'bottom center':
      case 'bottom right':
        y = 1;
        break;
      case 'center left':
      case 'center':
      case 'center right':
        y = 0.5;
        break;
    }

    switch (point) {
      case 'top right':
      case 'center right':
      case 'bottom right':
        x = 1;
        break;
      case 'top center':
      case 'center':
      case 'bottom center':
        x = 0.5;
        break;
    }

    return new Pivot(x, y);
  }
}