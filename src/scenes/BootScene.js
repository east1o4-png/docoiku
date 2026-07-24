export class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }

  create() {
    this.createGeneratedTextures();
    this.scene.start("HomeScene");
  }

  createGeneratedTextures() {
    const g = this.make.graphics({ x: 0, y: 0, add: false });

    // 主人公（現在は仮素材）
    g.fillStyle(0xf7c98b, 1);
    g.fillCircle(48, 35, 22);
    g.fillStyle(0x5d432c, 1);
    g.fillCircle(48, 22, 24);
    g.fillStyle(0xf7c98b, 1);
    g.fillCircle(48, 36, 19);
    g.fillStyle(0x3a6ea5, 1);
    g.fillRoundedRect(26, 56, 44, 54, 16);
    g.fillStyle(0x293241, 1);
    g.fillRoundedRect(30, 106, 14, 28, 7);
    g.fillRoundedRect(52, 106, 14, 28, 7);
    g.generateTexture("player", 96, 144);
    g.clear();

    // 木（仮素材）
    g.fillStyle(0x7b4f2c, 1);
    g.fillRoundedRect(44, 80, 24, 70, 8);
    g.fillStyle(0x58a55c, 1);
    g.fillCircle(56, 58, 48);
    g.fillStyle(0x72b66f, 1);
    g.fillCircle(30, 75, 28);
    g.fillCircle(80, 78, 30);
    g.generateTexture("tree", 112, 160);
    g.clear();

    // 家（仮素材）
    g.fillStyle(0xf2d0a7, 1);
    g.fillRoundedRect(16, 62, 120, 88, 12);
    g.fillStyle(0xc85d4f, 1);
    g.fillTriangle(8, 70, 76, 12, 144, 70);
    g.fillStyle(0x8f5d3e, 1);
    g.fillRoundedRect(62, 104, 28, 46, 6);
    g.fillStyle(0x8fd0e8, 1);
    g.fillRoundedRect(30, 88, 26, 24, 5);
    g.fillRoundedRect(96, 88, 26, 24, 5);
    g.generateTexture("house", 152, 160);

    g.destroy();
  }
}
