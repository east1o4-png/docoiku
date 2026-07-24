export class IslandScene extends Phaser.Scene {
  constructor() {
    super("IslandScene");
  }

  create() {
    const { width } = this.scale;

    this.worldW = 1536;
    this.worldH = 1035;
    this.target = new Phaser.Math.Vector2(780, 610);
    this.moving = false;
    this.discovered = new Set();

    this.cameras.main.setBounds(0, 0, this.worldW, this.worldH);
    this.add.image(this.worldW/2, this.worldH/2, "islandBg").setDepth(0);

    // 主人公の足元に影
    this.shadow = this.add.ellipse(780, 681, 60, 18, 0x33463a, 0.22).setDepth(850);

    this.player = this.add.sprite(780, 610, "playerWalk", 0)
      .setScale(0.39)
      .setDepth(1000);

    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
    this.cameras.main.setZoom(Phaser.Math.Clamp(width / 760, 0.78, 1.08));

    this.makeUI();
    this.makeDiscoveries();

    this.input.on("pointerdown", (pointer, gameObjects) => {
      if (gameObjects && gameObjects.length > 0) return;

      let tx = Phaser.Math.Clamp(pointer.worldX, 55, this.worldW - 55);
      let ty = Phaser.Math.Clamp(pointer.worldY, 90, this.worldH - 55);

      const safe = this.closestWalkable(tx, ty);
      tx = safe.x;
      ty = safe.y;

      if (Phaser.Math.Distance.Between(pointer.worldX, pointer.worldY, tx, ty) > 55) {
        this.toast("そこは あるけないよ");
      }

      this.target.set(tx, ty);
      this.moving = true;
      this.player.setFlipX(tx < this.player.x);
      if (!this.player.anims.isPlaying) this.player.play("walk");

      this.tapRipple(tx, ty);
    });
  }

  makeUI() {
    const { width } = this.scale;

    const homeBg = this.add.rectangle(18, 18, 128, 48, 0xfff7df, 0.95)
      .setOrigin(0,0).setScrollFactor(0).setDepth(10000)
      .setStrokeStyle(2, 0xd9c9a7, 0.9)
      .setInteractive({useHandCursor:true});

    const home = this.add.text(82, 42, "⌂  ホーム", {
      fontFamily:"sans-serif", fontSize:19, fontStyle:"bold", color:"#5b513d"
    }).setOrigin(0.5).setScrollFactor(0).setDepth(10001);

    homeBg.on("pointerdown", () => this.scene.start("HomeScene"));
    home.setInteractive({useHandCursor:true}).on("pointerdown", () => this.scene.start("HomeScene"));

    const badgeW = 196;
    this.add.rectangle(width - 18, 18, badgeW, 48, 0xfff7df, 0.95)
      .setOrigin(1,0).setScrollFactor(0).setDepth(10000)
      .setStrokeStyle(2, 0xd9c9a7, 0.9);

    this.discoveryText = this.add.text(width - 30, 42, "★ きょうの発見 0/5", {
      fontFamily:"sans-serif", fontSize:17, fontStyle:"bold", color:"#5b513d"
    }).setOrigin(1,0.5).setScrollFactor(0).setDepth(10001);

    this.toastText = this.add.text(width/2, 82, "", {
      fontFamily:"sans-serif",
      fontSize:20,
      fontStyle:"bold",
      color:"#536a5e",
      backgroundColor:"#fffaf0ee",
      padding:{x:16,y:10}
    }).setOrigin(0.5,0).setScrollFactor(0).setDepth(10002).setAlpha(0);
  }

  makeDiscoveries() {
    const spots = [
      {x:405,y:390,r:95,key:"tree",msg:"おおきな き！"},
      {x:1240,y:375,r:120,key:"house",msg:"おうちを みつけた！"},
      {x:825,y:610,r:65,key:"flower",msg:"しろい おはな！"},
      {x:1050,y:835,r:105,key:"rocks",msg:"おおきな いわ！"},
      {x:520,y:800,r:95,key:"beach",msg:"うみが キラキラ！"}
    ];

    spots.forEach(s => {
      const hit = this.add.circle(s.x, s.y, s.r, 0xffffff, 0.001)
        .setInteractive({useHandCursor:true}).setDepth(40);

      hit.on("pointerdown", () => {
        if (!this.discovered.has(s.key)) {
          this.discovered.add(s.key);
          this.discoveryText.setText(`★ きょうの発見 ${this.discovered.size}/5`);
          this.sparkle(s.x, s.y);
        }
        this.toast(s.msg);
      });
    });

    // 蝶を2匹だけ自然に配置
    [[900,520],[1150,600]].forEach(([x,y], idx) => {
      const b = this.add.image(x,y,"butterfly").setScale(0.55).setDepth(700);
      this.tweens.add({
        targets:b,
        x:x + (idx===0 ? 55 : -60),
        y:y - 25,
        angle:{from:-7,to:7},
        duration:1800 + idx*350,
        yoyo:true, repeat:-1, ease:"Sine.inOut"
      });
    });
  }

  isWalkable(x, y) {
    // 水域（左下の海）を禁止
    const waterPoly = new Phaser.Geom.Polygon([
      0,540, 120,570, 255,610, 410,655, 565,720,
      590,770, 555,815, 520,855, 530,910, 660,975, 760,1035, 0,1035
    ]);
    if (Phaser.Geom.Polygon.Contains(waterPoly, x, y)) return false;

    // 木・家・岩の上には入らない
    const blocks = [
      {x:215,y:70,w:360,h:470},
      {x:1080,y:170,w:380,h:420},
      {x:70,y:500,w:390,h:210},
      {x:925,y:745,w:360,h:205},
      {x:1300,y:570,w:220,h:190}
    ];

    for (const b of blocks) {
      if (x>b.x && x<b.x+b.w && y>b.y && y<b.y+b.h) return false;
    }
    return true;
  }

  closestWalkable(x, y) {
    if (this.isWalkable(x,y)) return {x,y};

    for (let r=36; r<=300; r+=24) {
      for (let a=0; a<Math.PI*2; a+=Math.PI/8) {
        const nx = Phaser.Math.Clamp(x + Math.cos(a)*r, 55, this.worldW-55);
        const ny = Phaser.Math.Clamp(y + Math.sin(a)*r, 90, this.worldH-55);
        if (this.isWalkable(nx,ny)) return {x:nx,y:ny};
      }
    }
    return {x:this.player.x,y:this.player.y};
  }

  update(_, delta) {
    if (!this.moving) return;

    const dx = this.target.x - this.player.x;
    const dy = this.target.y - this.player.y;
    const dist = Math.hypot(dx,dy);

    if (dist < 7) {
      this.player.setPosition(this.target.x,this.target.y);
      this.moving = false;
      this.player.anims.stop();
      this.player.setFrame(0);
    } else {
      const speed = 205;
      const step = Math.min(dist, speed*(delta/1000));
      this.player.x += (dx/dist)*step;
      this.player.y += (dy/dist)*step;
      this.player.setDepth(1000 + this.player.y);
    }

    this.shadow.setPosition(this.player.x, this.player.y + 58);
    this.shadow.setDepth(850 + this.player.y);
  }

  tapRipple(x,y) {
    const ring = this.add.circle(x,y,10,0xffffff,0)
      .setStrokeStyle(4,0xffffff,0.78).setDepth(9000);
    this.tweens.add({
      targets:ring, radius:40, alpha:0, duration:420,
      onComplete:()=>ring.destroy()
    });
  }

  sparkle(x,y) {
    for (let i=0;i<9;i++) {
      const p = this.add.image(x,y,"spark").setScale(0.25).setDepth(9100);
      const a = (Math.PI*2*i)/9;
      this.tweens.add({
        targets:p,
        x:x+Math.cos(a)*Phaser.Math.Between(45,90),
        y:y+Math.sin(a)*Phaser.Math.Between(45,90),
        alpha:0,
        scale:0.05,
        duration:500,
        onComplete:()=>p.destroy()
      });
    }
  }

  toast(msg) {
    this.toastText.setText(msg).setAlpha(1).setScale(0.94);
    this.tweens.killTweensOf(this.toastText);
    this.tweens.add({
      targets:this.toastText, scale:1, duration:120,
      onComplete:()=>{
        this.tweens.add({
          targets:this.toastText, alpha:0, delay:850, duration:260
        });
      }
    });
  }
}
