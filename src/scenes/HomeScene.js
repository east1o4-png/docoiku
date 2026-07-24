export class HomeScene extends Phaser.Scene {
  constructor() {
    super("HomeScene");
  }

  create() {
    const { width, height } = this.scale;

    const bg = this.add.image(width/2, height/2, "homeBg");
    const scale = Math.max(width/bg.width, height/bg.height);
    bg.setScale(scale);

    this.add.rectangle(width/2, height/2, width, height, 0x143a42, 0.12);

    const title = this.add.text(width/2, height*0.28, "あさひの しま", {
      fontFamily: "sans-serif",
      fontSize: Math.max(40, Math.min(68, width*0.095)),
      fontStyle: "bold",
      color: "#4d3a27",
      stroke: "#fff9e9",
      strokeThickness: 9
    }).setOrigin(0.5);

    this.add.text(width/2, height*0.385, "きょうは なにを みつける？", {
      fontFamily: "sans-serif",
      fontSize: Math.max(20, Math.min(31, width*0.047)),
      color: "#4f675f",
      backgroundColor: "#fffaf0cc",
      padding: { x: 14, y: 8 }
    }).setOrigin(0.5);

    const shadow = this.add.rectangle(width/2+4, height*0.66+7, Math.min(350,width*0.76), 94, 0x835332, 0.30)
      .setRounded?.(18);

    const btn = this.add.rectangle(width/2, height*0.66, Math.min(350,width*0.76), 92, 0xf2a354)
      .setStrokeStyle(5, 0xfff8df)
      .setInteractive({ useHandCursor:true });

    const txt = this.add.text(btn.x, btn.y, "しまへ いく", {
      fontFamily:"sans-serif",
      fontSize:32,
      fontStyle:"bold",
      color:"#ffffff"
    }).setOrigin(0.5);

    this.tweens.add({
      targets:[btn,txt],
      scaleX:1.035, scaleY:1.035,
      duration:760, yoyo:true, repeat:-1,
      ease:"Sine.inOut"
    });

    btn.on("pointerdown", () => {
      this.cameras.main.fadeOut(260,255,255,255);
      this.time.delayedCall(220, () => this.scene.start("IslandScene"));
    });

    this.scale.on("resize", () => this.scene.restart());
  }
}
