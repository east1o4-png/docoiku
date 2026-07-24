export class HomeScene extends Phaser.Scene {
  constructor() {
    super("HomeScene");
  }

  create() {
    this.cameras.main.setBackgroundColor("#91d6ef");

    const { width, height } = this.scale;

    this.add.circle(
      width * 0.82,
      height * 0.18,
      Math.min(width, height) * 0.08,
      0xffe08a
    );

    for (let i = 0; i < 5; i++) {
      const cloud = this.add.ellipse(
        width * (0.1 + i * 0.22),
        height * (0.15 + (i % 2) * 0.06),
        130,
        48,
        0xffffff,
        0.8
      );

      this.tweens.add({
        targets: cloud,
        x: cloud.x + 24,
        duration: 2600 + i * 350,
        yoyo: true,
        repeat: -1,
        ease: "Sine.inOut"
      });
    }

    this.add.text(
      width / 2,
      height * 0.28,
      "あさひの しま",
      {
        fontFamily: "sans-serif",
        fontSize: Math.max(34, Math.min(64, width * 0.09)),
        fontStyle: "bold",
        color: "#264653",
        stroke: "#ffffff",
        strokeThickness: 7
      }
    ).setOrigin(0.5);

    this.add.text(
      width / 2,
      height * 0.38,
      "きょうは なにを みつける？",
      {
        fontFamily: "sans-serif",
        fontSize: Math.max(18, Math.min(30, width * 0.045)),
        color: "#34515e"
      }
    ).setOrigin(0.5);

    const button = this.add.rectangle(
      width / 2,
      height * 0.63,
      Math.min(330, width * 0.72),
      86,
      0xff9f68
    )
    .setStrokeStyle(5, 0xffffff)
    .setInteractive({ useHandCursor: true });

    const buttonText = this.add.text(
      button.x,
      button.y,
      "しまへ いく",
      {
        fontFamily: "sans-serif",
        fontSize: 30,
        fontStyle: "bold",
        color: "#ffffff"
      }
    ).setOrigin(0.5);

    const pulse = this.tweens.add({
      targets: [button, buttonText],
      scaleX: 1.04,
      scaleY: 1.04,
      duration: 700,
      yoyo: true,
      repeat: -1,
      ease: "Sine.inOut"
    });

    button.on("pointerdown", () => {
      pulse.stop();
      this.cameras.main.fadeOut(280, 255, 255, 255);

      this.time.delayedCall(250, () => {
        this.scene.start("IslandScene");
      });
    });

    this.scale.on("resize", () => {
      this.scene.restart();
    });
  }
}
