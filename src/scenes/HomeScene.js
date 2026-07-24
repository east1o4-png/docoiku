export class HomeScene extends Phaser.Scene {
  constructor() {
    super("HomeScene");
  }

  create() {
    const { width, height } = this.scale;

    const bg = this.add.image(width / 2, height / 2, "homeBg");
    const bgScale = Math.max(width / bg.width, height / bg.height);
    bg.setScale(bgScale);

    this.add.rectangle(width / 2, height / 2, width, height, 0x143a42, 0.10);

    this.add.text(width / 2, height * 0.29, "あさひの しま", {
      fontFamily: "sans-serif",
      fontSize: Math.max(40, Math.min(68, width * 0.095)),
      fontStyle: "bold",
      color: "#4d3a27",
      stroke: "#fff9e9",
      strokeThickness: 9
    }).setOrigin(0.5);

    this.add.text(width / 2, height * 0.39, "きょうは なにを みつける？", {
      fontFamily: "sans-serif",
      fontSize: Math.max(20, Math.min(31, width * 0.047)),
      color: "#4f675f",
      backgroundColor: "#fffaf0dd",
      padding: { x: 14, y: 8 }
    }).setOrigin(0.5);

    const btn = this.add.rectangle(
      width / 2,
      height * 0.66,
      Math.min(350, width * 0.76),
      92,
      0xf2a354
    )
      .setStrokeStyle(5, 0xfff8df)
      .setInteractive({ useHandCursor: true });

    const label = this.add.text(btn.x, btn.y, "しまへ いく", {
      fontFamily: "sans-serif",
      fontSize: 32,
      fontStyle: "bold",
      color: "#ffffff"
    }).setOrigin(0.5);

    btn.on("pointerdown", () => {
      // 安定性優先: フェードを使わず直接遷移する
      this.scene.start("IslandScene");
    });

    this.tweens.add({
      targets: [btn, label],
      scaleX: 1.025,
      scaleY: 1.025,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: "Sine.inOut"
    });
  }
}
