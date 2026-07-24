export class IslandScene extends Phaser.Scene {
  constructor() {
    super("IslandScene");
  }

  create() {
    const { width } = this.scale;

    this.worldW = 1536;
    this.worldH = 1035;
    this.target = new Phaser.Math.Vector2(785, 620);
    this.moving = false;
    this.discovered = new Set();
    this.finalEventStarted = false;
    this.shellFound = false;
    this.bridgeOpen = false;

    this.cameras.main.setBounds(0, 0, this.worldW, this.worldH);
    this.add.image(this.worldW / 2, this.worldH / 2, "islandBg").setDepth(0);

    this.player = this.add.sprite(785, 620, "playerWalk", 0)
      .setScale(0.39)
      .setDepth(1000);

    this.shadow = this.add.ellipse(
      this.player.x,
      this.player.y + 58,
      60,
      18,
      0x33463a,
      0.22
    ).setDepth(900);

    this.cameras.main.startFollow(this.player, true, 0.085, 0.085);
    this.cameras.main.setZoom(Phaser.Math.Clamp(width / 760, 0.80, 1.08));

    this.makeUI();
    this.makeDiscoveries();
    this.makeAmbientLife();

    this.input.on("pointerdown", (pointer, gameObjects) => {
      if (gameObjects && gameObjects.length > 0) return;

      let tx = Phaser.Math.Clamp(pointer.worldX, 70, this.worldW - 70);
      let ty = Phaser.Math.Clamp(pointer.worldY, 100, this.worldH - 70);

      const safe = this.closestWalkable(tx, ty);
      const corrected =
        Phaser.Math.Distance.Between(pointer.worldX, pointer.worldY, safe.x, safe.y) > 45;

      tx = safe.x;
      ty = safe.y;

      if (corrected) this.toast("そこは あるけないよ");

      this.movePlayerTo(tx, ty);
      this.tapRipple(tx, ty);
    });
  }

  makeUI() {
    const { width } = this.scale;

    const homeBg = this.add.rectangle(18, 18, 126, 46, 0xfff7df, 0.94)
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setDepth(10000)
      .setStrokeStyle(2, 0xd9c9a7, 0.9)
      .setInteractive({ useHandCursor: true });

    const home = this.add.text(81, 41, "⌂  ホーム", {
      fontFamily: "sans-serif",
      fontSize: 18,
      fontStyle: "bold",
      color: "#5b513d"
    })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(10001)
      .setInteractive({ useHandCursor: true });

    const goHome = () => this.scene.start("HomeScene");
    homeBg.on("pointerdown", goHome);
    home.on("pointerdown", goHome);

    this.add.rectangle(width - 18, 18, 190, 46, 0xfff7df, 0.94)
      .setOrigin(1, 0)
      .setScrollFactor(0)
      .setDepth(10000)
      .setStrokeStyle(2, 0xd9c9a7, 0.9);

    this.discoveryText = this.add.text(width - 30, 41, "★ きょうの発見 0/5", {
      fontFamily: "sans-serif",
      fontSize: 16,
      fontStyle: "bold",
      color: "#5b513d"
    })
      .setOrigin(1, 0.5)
      .setScrollFactor(0)
      .setDepth(10001);

    this.toastText = this.add.text(width / 2, 80, "", {
      fontFamily: "sans-serif",
      fontSize: 19,
      fontStyle: "bold",
      color: "#536a5e",
      backgroundColor: "#fffaf0ee",
      padding: { x: 15, y: 9 }
    })
      .setOrigin(0.5, 0)
      .setScrollFactor(0)
      .setDepth(10002)
      .setAlpha(0);

    this.questText = this.add.text(width / 2, 130, "まずは 5こ みつけよう！", {
      fontFamily: "sans-serif",
      fontSize: 16,
      fontStyle: "bold",
      color: "#695d44",
      backgroundColor: "#fff5d9df",
      padding: { x: 13, y: 8 }
    })
      .setOrigin(0.5, 0)
      .setScrollFactor(0)
      .setDepth(10002);
  }

  makeDiscoveries() {
    const spots = [
      { x: 405, y: 390, r: 90, key: "tree", msg: "おおきな き！" },
      { x: 1230, y: 390, r: 110, key: "house", msg: "おうちを みつけた！" },
      { x: 840, y: 610, r: 60, key: "flower", msg: "しろい おはな！" },
      { x: 1060, y: 830, r: 95, key: "rocks", msg: "おおきな いわ！" },
      { x: 610, y: 760, r: 85, key: "beach", msg: "うみが キラキラ！" }
    ];

    spots.forEach(s => {
      const hit = this.add.circle(s.x, s.y, s.r, 0xffffff, 0.001)
        .setInteractive({ useHandCursor: true })
        .setDepth(40);

      hit.on("pointerdown", () => {
        if (!this.discovered.has(s.key)) {
          this.discovered.add(s.key);
          this.discoveryText.setText(`★ きょうの発見 ${this.discovered.size}/5`);
          this.sparkle(s.x, s.y);

          if (this.discovered.size === 5) {
            this.time.delayedCall(500, () => this.startFinalEvent());
          }
        }
        this.toast(s.msg);
      });
    });
  }

  makeAmbientLife() {
    [[910, 520], [1160, 610]].forEach(([x, y], idx) => {
      const b = this.add.image(x, y, "butterfly").setScale(0.52).setDepth(700);
      this.tweens.add({
        targets: b,
        x: x + (idx === 0 ? 50 : -55),
        y: y - 22,
        angle: { from: -7, to: 7 },
        duration: 1850 + idx * 300,
        yoyo: true,
        repeat: -1,
        ease: "Sine.inOut"
      });
    });
  }

  startFinalEvent() {
    if (this.finalEventStarted) return;
    this.finalEventStarted = true;

    this.questText.setText("うみのほうから なにか きた！");
    this.toast("ザザーン…！");

    // 波のきらめき
    for (let i = 0; i < 4; i++) {
      const wave = this.add.ellipse(500 + i * 35, 860 + i * 18, 130, 24, 0xffffff, 0.25)
        .setDepth(200);

      this.tweens.add({
        targets: wave,
        alpha: 0,
        scaleX: 1.35,
        duration: 900 + i * 120,
        repeat: 1,
        yoyo: true
      });
    }

    // 貝が海から砂浜へ流れてくる
    this.shell = this.add.container(430, 930).setDepth(8500);

    const shellBody = this.add.ellipse(0, 0, 46, 34, 0xffd7b0, 1)
      .setStrokeStyle(3, 0xd69269, 1);

    const shellLine1 = this.add.line(0, 0, -12, 8, 0, -8, 0xc98763, 1)
      .setLineWidth(3);
    const shellLine2 = this.add.line(0, 0, 0, 10, 8, -5, 0xc98763, 1)
      .setLineWidth(3);

    this.shell.add([shellBody, shellLine1, shellLine2]);
    this.shell.setSize(64, 54).setInteractive({ useHandCursor: true });

    this.tweens.add({
      targets: this.shell,
      x: 610,
      y: 770,
      angle: 18,
      duration: 1800,
      ease: "Sine.out",
      onComplete: () => {
        this.tweens.add({
          targets: this.shell,
          y: 764,
          duration: 650,
          yoyo: true,
          repeat: -1,
          ease: "Sine.inOut"
        });
      }
    });

    this.shell.on("pointerdown", () => this.findShell());
  }

  findShell() {
    if (this.shellFound) return;
    this.shellFound = true;

    this.sparkle(this.shell.x, this.shell.y);
    this.toast("きれいな かいがら！");
    this.questText.setText("かいがらの ひかりが みちを てらした！");

    this.tweens.add({
      targets: this.shell,
      scale: 1.25,
      duration: 180,
      yoyo: true
    });

    this.time.delayedCall(700, () => this.openHiddenPath());
  }

  openHiddenPath() {
    if (this.bridgeOpen) return;
    this.bridgeOpen = true;

    // 画面内に「秘密の道」が現れる
    this.hiddenPath = this.add.rectangle(775, 520, 140, 20, 0xf8df9b, 0)
      .setDepth(600)
      .setAngle(-12);

    this.tweens.add({
      targets: this.hiddenPath,
      alpha: 0.85,
      scaleX: 2.0,
      duration: 900,
      ease: "Sine.out"
    });

    const marker = this.add.text(790, 500, "✨ ひみつの みち ✨", {
      fontFamily: "sans-serif",
      fontSize: 24,
      fontStyle: "bold",
      color: "#715f32",
      backgroundColor: "#fff5c8ee",
      padding: { x: 14, y: 8 }
    })
      .setOrigin(0.5)
      .setDepth(9500)
      .setInteractive({ useHandCursor: true });

    marker.on("pointerdown", () => this.finishAdventure(marker));

    this.tweens.add({
      targets: marker,
      y: 488,
      duration: 700,
      yoyo: true,
      repeat: -1,
      ease: "Sine.inOut"
    });
  }

  finishAdventure(marker) {
    marker.disableInteractive();

    this.questText.setText("きょうの ぼうけん だいせいこう！");
    this.toast("やったー！");

    for (let i = 0; i < 22; i++) {
      const x = Phaser.Math.Between(this.player.x - 150, this.player.x + 150);
      const y = Phaser.Math.Between(this.player.y - 130, this.player.y + 60);
      const star = this.add.text(x, y, i % 2 === 0 ? "★" : "✨", {
        fontFamily: "sans-serif",
        fontSize: Phaser.Math.Between(18, 34),
        color: "#ffe88a"
      }).setDepth(9800);

      this.tweens.add({
        targets: star,
        y: y - Phaser.Math.Between(50, 120),
        alpha: 0,
        angle: Phaser.Math.Between(-120, 120),
        duration: Phaser.Math.Between(800, 1400),
        onComplete: () => star.destroy()
      });
    }
  }

  movePlayerTo(x, y) {
    this.target.set(x, y);
    this.moving = true;
    this.player.setFlipX(x < this.player.x);
    if (!this.player.anims.isPlaying) this.player.play("walk");
  }

  isWalkable(x, y) {
    const waterPoly = new Phaser.Geom.Polygon([
      0, 540,
      120, 570,
      255, 610,
      410, 655,
      565, 720,
      590, 770,
      555, 815,
      520, 855,
      530, 910,
      660, 975,
      760, 1035,
      0, 1035
    ]);

    if (Phaser.Geom.Polygon.Contains(waterPoly, x, y)) return false;

    const blocks = [
      { x: 215, y: 70,  w: 360, h: 470 },
      { x: 1080, y: 170, w: 380, h: 420 },
      { x: 70,  y: 500, w: 390, h: 210 },
      { x: 925, y: 745, w: 360, h: 205 },
      { x: 1300, y: 570, w: 220, h: 190 }
    ];

    for (const b of blocks) {
      if (x > b.x && x < b.x + b.w && y > b.y && y < b.y + b.h) {
        return false;
      }
    }

    return true;
  }

  closestWalkable(x, y) {
    if (this.isWalkable(x, y)) return { x, y };

    for (let r = 36; r <= 300; r += 24) {
      for (let a = 0; a < Math.PI * 2; a += Math.PI / 12) {
        const nx = Phaser.Math.Clamp(x + Math.cos(a) * r, 70, this.worldW - 70);
        const ny = Phaser.Math.Clamp(y + Math.sin(a) * r, 100, this.worldH - 70);

        if (this.isWalkable(nx, ny)) {
          return { x: nx, y: ny };
        }
      }
    }

    return { x: this.player.x, y: this.player.y };
  }

  update(_, delta) {
    if (!this.moving) return;

    const dx = this.target.x - this.player.x;
    const dy = this.target.y - this.player.y;
    const dist = Math.hypot(dx, dy);

    if (dist < 6) {
      this.player.setPosition(this.target.x, this.target.y);
      this.moving = false;
      this.player.anims.stop();
      this.player.setFrame(0);
    } else {
      const speed = 205;
      const step = Math.min(dist, speed * (delta / 1000));

      this.player.x += (dx / dist) * step;
      this.player.y += (dy / dist) * step;
      this.player.setDepth(1000 + this.player.y);
    }

    this.shadow.setPosition(this.player.x, this.player.y + 58);
    this.shadow.setDepth(900 + this.player.y);
  }

  tapRipple(x, y) {
    const ring = this.add.circle(x, y, 10, 0xffffff, 0)
      .setStrokeStyle(4, 0xffffff, 0.75)
      .setDepth(9000);

    this.tweens.add({
      targets: ring,
      radius: 38,
      alpha: 0,
      duration: 420,
      onComplete: () => ring.destroy()
    });
  }

  sparkle(x, y) {
    for (let i = 0; i < 9; i++) {
      const p = this.add.image(x, y, "spark").setScale(0.23).setDepth(9100);
      const a = (Math.PI * 2 * i) / 9;

      this.tweens.add({
        targets: p,
        x: x + Math.cos(a) * Phaser.Math.Between(42, 85),
        y: y + Math.sin(a) * Phaser.Math.Between(42, 85),
        alpha: 0,
        scale: 0.04,
        duration: 500,
        onComplete: () => p.destroy()
      });
    }
  }

  toast(msg) {
    this.toastText.setText(msg).setAlpha(1).setScale(0.95);
    this.tweens.killTweensOf(this.toastText);

    this.tweens.add({
      targets: this.toastText,
      scale: 1,
      duration: 120,
      onComplete: () => {
        this.tweens.add({
          targets: this.toastText,
          alpha: 0,
          delay: 850,
          duration: 260
        });
      }
    });
  }
}
