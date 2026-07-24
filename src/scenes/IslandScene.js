export class IslandScene extends Phaser.Scene {
  constructor() {
    super("IslandScene");
  }

  create() {
    const { width, height } = this.scale;

    // まず確実に表示するため、物理演算や複雑な演出を使わない安定版
    this.worldW = 1536;
    this.worldH = 1035;

    this.cameras.main.setBounds(0, 0, this.worldW, this.worldH);

    const bg = this.add.image(this.worldW / 2, this.worldH / 2, "islandBg");
    bg.setDepth(0);

    this.player = this.add.sprite(
      this.worldW * 0.52,
      this.worldH * 0.62,
      "playerWalk",
      0
    )
      .setScale(0.48)
      .setDepth(1000);

    this.target = new Phaser.Math.Vector2(this.player.x, this.player.y);
    this.moving = false;

    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);

    // 端末幅に応じた安全なズーム
    const zoom = Phaser.Math.Clamp(width / 760, 0.78, 1.08);
    this.cameras.main.setZoom(zoom);

    // UI
    const home = this.add.text(18, 22, "⌂ ホーム", {
      fontFamily: "sans-serif",
      fontSize: 21,
      fontStyle: "bold",
      color: "#4d4935",
      backgroundColor: "#fff6d9ee",
      padding: { x: 14, y: 10 }
    })
      .setScrollFactor(0)
      .setDepth(9999)
      .setInteractive({ useHandCursor: true });

    home.on("pointerdown", () => {
      this.scene.start("HomeScene");
    });

    this.add.text(width - 18, 22, "島を タップして あるこう", {
      fontFamily: "sans-serif",
      fontSize: 17,
      fontStyle: "bold",
      color: "#5f5137",
      backgroundColor: "#fff6d9ee",
      padding: { x: 12, y: 10 }
    })
      .setOrigin(1, 0)
      .setScrollFactor(0)
      .setDepth(9999);

    // 画面タップで主人公が移動
    this.input.on("pointerdown", (pointer, gameObjects) => {
      if (gameObjects && gameObjects.length > 0) return;

      const tx = Phaser.Math.Clamp(pointer.worldX, 80, this.worldW - 80);
      const ty = Phaser.Math.Clamp(pointer.worldY, 100, this.worldH - 70);

      this.target.set(tx, ty);
      this.moving = true;

      const dx = tx - this.player.x;
      this.player.setFlipX(dx < 0);

      if (!this.player.anims.isPlaying) {
        this.player.play("walk");
      }

      const ring = this.add.circle(tx, ty, 10, 0xffffff, 0)
        .setStrokeStyle(4, 0xffffff, 0.8)
        .setDepth(900);

      this.tweens.add({
        targets: ring,
        radius: 42,
        alpha: 0,
        duration: 420,
        onComplete: () => ring.destroy()
      });
    });
  }

  update(_, delta) {
    if (!this.player || !this.moving) return;

    const dx = this.target.x - this.player.x;
    const dy = this.target.y - this.player.y;
    const dist = Math.hypot(dx, dy);

    if (dist < 7) {
      this.player.setPosition(this.target.x, this.target.y);
      this.moving = false;
      this.player.anims.stop();
      this.player.setFrame(0);
      return;
    }

    const speed = 230;
    const step = Math.min(dist, speed * (delta / 1000));

    this.player.x += (dx / dist) * step;
    this.player.y += (dy / dist) * step;
    this.player.setDepth(1000 + this.player.y);
  }
}
