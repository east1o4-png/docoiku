export class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }

  preload() {
    this.load.image("homeBg", "./assets/images/home_bg.jpg?v=240");
    this.load.image("islandBg", "./assets/images/island_bg.jpg?v=240");
    this.load.spritesheet("playerWalk", "./assets/images/player_walk.png?v=240", {
      frameWidth: 190,
      frameHeight: 310
    });
  }

  create() {
    this.makeTinyTextures();

    this.anims.create({
      key: "walk",
      frames: [
        { key: "playerWalk", frame: 0 },
        { key: "playerWalk", frame: 1 },
        { key: "playerWalk", frame: 2 },
        { key: "playerWalk", frame: 1 }
      ],
      frameRate: 7,
      repeat: -1
    });

    this.scene.start("HomeScene");
  }

  makeTinyTextures() {
    const g = this.make.graphics({ x: 0, y: 0, add: false });

    g.fillStyle(0xffd75a, 1);
    g.fillEllipse(15, 18, 18, 25);
    g.fillEllipse(35, 18, 18, 25);
    g.fillStyle(0x4d3a28, 1);
    g.fillRoundedRect(23, 10, 4, 25, 2);
    g.generateTexture("butterfly", 50, 40);
    g.clear();

    g.fillStyle(0xffffff, 1);
    g.fillCircle(12, 12, 8);
    g.generateTexture("spark", 24, 24);
    g.destroy();
  }
}
