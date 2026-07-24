export class IslandScene extends Phaser.Scene {
  constructor() {
    super("IslandScene");
  }

  create() {
    const { width, height } = this.scale;

    this.worldW = Math.max(1500, width * 2.2);
    this.worldH = Math.max(1200, height * 1.8);

    // 海
    this.cameras.main.setBackgroundColor("#67c6e3");

    this.add.rectangle(
      this.worldW / 2,
      this.worldH / 2,
      this.worldW,
      this.worldH,
      0x67c6e3
    );

    // 動く水面
    for (let i = 0; i < 26; i++) {
      const line = this.add.ellipse(
        Phaser.Math.Between(0, this.worldW),
        Phaser.Math.Between(0, this.worldH),
        Phaser.Math.Between(50, 140),
        Phaser.Math.Between(5, 11),
        0xb9ecf7,
        0.28
      );

      this.tweens.add({
        targets: line,
        x: line.x + Phaser.Math.Between(30, 80),
        alpha: { from: 0.12, to: 0.38 },
        duration: Phaser.Math.Between(1700, 3200),
        yoyo: true,
        repeat: -1,
        ease: "Sine.inOut"
      });
    }

    // 砂浜
    this.add.ellipse(
      this.worldW / 2,
      this.worldH / 2,
      this.worldW * 0.72,
      this.worldH * 0.67,
      0xf2dfad
    );

    // 草地
    this.add.ellipse(
      this.worldW / 2,
      this.worldH / 2,
      this.worldW * 0.65,
      this.worldH * 0.60,
      0x79be6b
    );

    // 道
    this.add.rectangle(
      this.worldW / 2,
      this.worldH / 2,
      this.worldW * 0.5,
      110,
      0xd9bd91
    ).setAngle(-10);

    this.add.rectangle(
      this.worldW / 2,
      this.worldH / 2,
      110,
      this.worldH * 0.45,
      0xd9bd91
    ).setAngle(8);

    // 家
    this.add.image(
      this.worldW * 0.63,
      this.worldH * 0.43,
      "house"
    )
    .setScale(1.15)
    .setDepth(4);

    // 木
    const treePositions = [
      [0.35, 0.35],
      [0.43, 0.29],
      [0.72, 0.35],
      [0.28, 0.55],
      [0.75, 0.58],
      [0.38, 0.70],
      [0.63, 0.72]
    ];

    treePositions.forEach(([x, y], idx) => {
      const tree = this.add.image(
        this.worldW * x,
        this.worldH * y,
        "tree"
      )
      .setScale(0.8 + (idx % 3) * 0.08)
      .setDepth(5);

      this.tweens.add({
        targets: tree,
        angle: { from: -1.5, to: 1.5 },
        duration: 1300 + idx * 90,
        yoyo: true,
        repeat: -1,
        ease: "Sine.inOut"
      });
    });

    // 主人公
    this.player = this.physics.add.image(
      this.worldW * 0.50,
      this.worldH * 0.60,
      "player"
    )
    .setScale(0.70)
    .setDepth(10);

    this.player.body.setCircle(40, 8, 70);
    this.player.setCollideWorldBounds(true);

    this.physics.world.setBounds(
      0,
      0,
      this.worldW,
      this.worldH
    );

    this.cameras.main.setBounds(
      0,
      0,
      this.worldW,
      this.worldH
    );

    this.cameras.main.startFollow(
      this.player,
      true,
      0.09,
      0.09
    );

    this.cameras.main.setZoom(
      Math.max(
        0.8,
        Math.min(1.15, width / 760)
      )
    );

    // タップした位置へ移動
    this.target = new Phaser.Math.Vector2(
      this.player.x,
      this.player.y
    );

    this.input.on("pointerdown", (pointer) => {
      this.target.set(
        pointer.worldX,
        pointer.worldY
      );

      this.spawnTapRipple(
        pointer.worldX,
        pointer.worldY
      );
    });

    // ホームボタン
    const home = this.add.text(
      22,
      22,
      "⌂ ホーム",
      {
        fontFamily: "sans-serif",
        fontSize: 22,
        fontStyle: "bold",
        color: "#264653",
        backgroundColor: "#ffffffdd",
        padding: {
          x: 14,
          y: 10
        }
      }
    )
    .setScrollFactor(0)
    .setDepth(100)
    .setInteractive({ useHandCursor: true });

    home.on("pointerdown", () => {
      this.player.setVelocity(0);
      this.scene.start("HomeScene");
    });

    // ミッション表示
    this.add.text(
      width - 22,
      22,
      "★ きょうの発見 0/3",
      {
        fontFamily: "sans-serif",
        fontSize: 18,
        color: "#264653",
        backgroundColor: "#ffffff99",
        padding: {
          x: 12,
          y: 9
        }
      }
    )
    .setOrigin(1, 0)
    .setScrollFactor(0)
    .setDepth(100);

    this.scale.on("resize", () => {
      this.scene.restart();
    });
  }

  update() {
    if (!this.player) return;

    const distance = Phaser.Math.Distance.Between(
      this.player.x,
      this.player.y,
      this.target.x,
      this.target.y
    );

    if (distance > 10) {
      const angle = Phaser.Math.Angle.Between(
        this.player.x,
        this.player.y,
        this.target.x,
        this.target.y
      );

      const speed = 250;

      this.player.setVelocity(
        Math.cos(angle) * speed,
        Math.sin(angle) * speed
      );

      const scaleY =
        0.70 +
        Math.sin(this.time.now * 0.018) * 0.018;

      this.player.setScale(
        0.70,
        scaleY
      );
    } else {
      this.player.setVelocity(0);
      this.player.setScale(0.70);
    }

    this.player.setDepth(
      10 + this.player.y / 100
    );
  }

  spawnTapRipple(x, y) {
    const ring = this.add.circle(
      x,
      y,
      12,
      0xffffff,
      0
    )
    .setStrokeStyle(
      4,
      0xffffff,
      0.7
    )
    .setDepth(20);

    this.tweens.add({
      targets: ring,
      radius: 42,
      alpha: 0,
      duration: 420,
      ease: "Quad.out",

      onComplete: () => {
        ring.destroy();
      }
    });
  }
}
