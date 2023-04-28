import { SpriteOptions } from "../types";

export class Sprite {

  public readonly image: HTMLImageElement;

  constructor(options: SpriteOptions) {
    const { image } = options;

    this.image = image;
  }

  public static async fromAsset(path: string): Promise<Sprite> {
    const image = new Image();
    image.src = path;
    await image.decode();
    return new Sprite({ image });
  }
}