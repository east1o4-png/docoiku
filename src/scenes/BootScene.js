export class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }

  preload() {
    this.load.image("homeBg", "./assets/images/home_bg.jpg");
    this.load.image("islandBg", "./assets/images/island_bg.jpg");
    this.load.spritesheet("playerWalk", "./assets/images/player_walk.png", {
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

    g.fillStyle(0xd86442, 1);
    g.fillCircle(28, 26, 13);
    g.fillCircle(16, 18, 7);
    g.fillCircle(40, 18, 7);
    g.lineStyle(4, 0xd86442, 1);
    [[10,30,2,38],[15,34,8,43],[41,34,48,43],[46,30,54,38]].forEach(l => {
      g.beginPath(); g.moveTo(l[0], l[1]); g.lineTo(l[2], l[3]); g.strokePath();
    });
    g.fillStyle(0x1c2528, 1);
    g.fillCircle(23,22,2); g.fillCircle(33,22,2);
    g.generateTexture("crab", 58, 50);
    g.clear();

    g.lineStyle(5, 0x44515a, 1);
    g.beginPath(); g.arc(16,20,11,Math.PI,Math.PI*2); g.strokePath();
    g.beginPath(); g.arc(36,20,11,Math.PI,Math.PI*2); g.strokePath();
    g.generateTexture("bird", 52, 30);
    g.destroy();
  }
}
