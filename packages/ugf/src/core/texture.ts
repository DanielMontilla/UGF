export class Texture {

  public constructor(
    public readonly image: TexImageSource
  ) {}

  public static async fromAsset(path: string): Promise<Texture> {
    const image = new Image();
    image.src = path;
    await image.decode();
    return new Texture(image);
  }
}