export class HomeScene extends Phaser.Scene {
  constructor() {
    super("HomeScene");
  }

  create() {
    const { width, height } = this.scale;

    const bg = this.add.image(width / 2, height / 2, "homeBg");
    const bgScale = Math.max(width / bg.width, height / bg.height);
    bg.setScale(bgScale);

    this.add.rectangle(width/2, height/2, width, height, 0x1f382f, 0.07);

    this.add.text(width/2, height*0.285, "あさひの しま", {
      fontFamily: "sans-serif",
      fontSize: Math.max(40, Math.min(68, width*0.095)),
      fontStyle: "bold",
      color: "#493725",
      stroke: "#fff9eb",
      strokeThickness: 9
    }).setOrigin(0.5);

    this.add.text(width/2, height*0.39, "きょうは なにを みつける？", {
      fontFamily: "sans-serif",
      fontSize: Math.max(20, Math.min(30, width*0.046)),
      fontStyle: "bold",
      color: "#557067",
      backgroundColor: "#fffaf0e8",
      padding: { x: 16, y: 10 }
    }).setOrigin(0.5);

    const shadow = this.add.rectangle(
      width/2 + 3, height*0.66 + 8,
      Math.min(350,width*0.76), 92, 0x6d4c2e, 0.24
    );

    const btn = this.add.rectangle(
      width/2, height*0.66,
      Math.min(350,width*0.76), 92, 0xf2a354
    )
      .setStrokeStyle(5, 0xfff8df)
      .setInteractive({ useHandCursor:true });

    const label = this.add.text(btn.x, btn.y, "しまへ いく", {
      fontFamily: "sans-serif",
      fontSize: 32,
      fontStyle: "bold",
      color: "#ffffff"
    }).setOrigin(0.5);

    this.tweens.add({
      targets: [btn, label],
      scaleX: 1.025, scaleY: 1.025,
      duration: 780, yoyo: true, repeat: -1,
      ease: "Sine.inOut"
    });

    
    this.add.text(width/2, height*0.49, "5こ みつけると… なにか おきるよ", {
      fontFamily: "sans-serif",
      fontSize: Math.max(16, Math.min(23, width*0.038)),
      fontStyle: "bold",
      color: "#6b5a42",
      backgroundColor: "#fffaf0c8",
      padding: { x: 12, y: 8 }
    }).setOrigin(0.5);

    btn.on("pointerdown", () => this.scene.start("IslandScene"));
  }
}
