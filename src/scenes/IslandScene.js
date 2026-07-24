export class IslandScene extends Phaser.Scene {
  constructor() {
    super("IslandScene");
  }

  create() {
    const { width, height } = this.scale;

    this.worldW = 1536;
    this.worldH = 1035;
    this.discovered = new Set();

    this.physics.world.setBounds(0,0,this.worldW,this.worldH);
    this.cameras.main.setBounds(0,0,this.worldW,this.worldH);

    this.add.image(this.worldW/2, this.worldH/2, "islandBg").setDepth(0);

    this.makeHotspots();
    this.makeAmbientLife();
    this.makePlayer();
    this.makeUI(width);

    this.input.on("pointerdown", (pointer, objects) => {
      if (objects && objects.length) return;
      this.target.set(
        Phaser.Math.Clamp(pointer.worldX, 90, this.worldW-90),
        Phaser.Math.Clamp(pointer.worldY, 120, this.worldH-80)
      );
      this.tapRipple(pointer.worldX, pointer.worldY);
    });

    this.scale.on("resize", () => this.scene.restart());
  }

  makePlayer() {
    this.player = this.physics.add.sprite(this.worldW*0.52, this.worldH*0.64, "playerWalk", 0)
      .setScale(0.48)
      .setDepth(5000);

    this.player.body.setSize(100, 70);
    this.player.body.setOffset(45, 220);
    this.player.setCollideWorldBounds(true);

    this.target = new Phaser.Math.Vector2(this.player.x, this.player.y);

    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
    this.cameras.main.setZoom(Math.max(0.78, Math.min(1.18, this.scale.width / 760)));
  }

  makeHotspots() {
    const spots = [
      {x:1270,y:350,w:300,h:270,key:"house",msg:"おうちを みつけた！"},
      {x:320,y:290,w:230,h:250,key:"tree",msg:"おおきな き！"},
      {x:1010,y:190,w:230,h:210,key:"tree2",msg:"きの はっぱが ゆれてる！"},
      {x:300,y:680,w:300,h:170,key:"beach",msg:"うみが キラキラ！"},
      {x:980,y:650,w:330,h:180,key:"rocks",msg:"おおきな いわ！"}
    ];

    spots.forEach(s => {
      const hit = this.add.rectangle(s.x,s.y,s.w,s.h,0xffffff,0.001)
        .setInteractive({useHandCursor:true})
        .setDepth(20);

      hit.on("pointerdown", () => {
        this.discover(s.key);
        this.toast(s.msg);
        this.pulseAt(s.x,s.y);
      });
    });
  }

  makeAmbientLife() {
    for(let i=0;i<4;i++) {
      const b = this.add.image(
        Phaser.Math.Between(420,1150),
        Phaser.Math.Between(300,700),
        "butterfly"
      ).setScale(0.75).setDepth(4500).setInteractive({useHandCursor:true});

      this.tweens.add({
        targets:b,
        x:b.x+Phaser.Math.Between(-130,130),
        y:b.y+Phaser.Math.Between(-85,85),
        angle:{from:-8,to:8},
        duration:Phaser.Math.Between(1800,3100),
        yoyo:true, repeat:-1,
        ease:"Sine.inOut"
      });

      b.on("pointerdown", () => {
        this.discover("butterfly");
        this.toast("ちょうちょ！");
        this.tweens.add({
          targets:b, y:b.y-120, alpha:0, duration:500,
          onComplete:()=>b.destroy()
        });
      });
    }

    this.crab = this.add.image(1180,830,"crab")
      .setScale(0.9).setDepth(4600).setInteractive({useHandCursor:true});
    this.tweens.add({
      targets:this.crab,
      x:this.crab.x+100,
      duration:1900,
      yoyo:true, repeat:-1,
      ease:"Sine.inOut"
    });
    this.crab.on("pointerdown", () => {
      this.discover("crab");
      this.toast("カニが にげた！");
      this.tweens.add({
        targets:this.crab, x:this.crab.x+180, alpha:0, duration:500,
        onComplete:()=>this.crab.destroy()
      });
    });

    this.time.addEvent({
      delay:5200,
      loop:true,
      callback:()=>this.spawnBird()
    });
    this.spawnBird();
  }

  makeUI(width) {
    const home = this.add.text(20,22,"⌂ ホーム",{
      fontFamily:"sans-serif",
      fontSize:21,
      fontStyle:"bold",
      color:"#4d4935",
      backgroundColor:"#fff6d9ee",
      padding:{x:14,y:10}
    }).setScrollFactor(0).setDepth(99999).setInteractive({useHandCursor:true});

    home.on("pointerdown", () => this.scene.start("HomeScene"));

    this.discoveryText = this.add.text(width-20,22,"★ きょうの発見 0/5",{
      fontFamily:"sans-serif",
      fontSize:18,
      fontStyle:"bold",
      color:"#5f5137",
      backgroundColor:"#fff6d9ee",
      padding:{x:12,y:10}
    }).setOrigin(1,0).setScrollFactor(0).setDepth(99999);

    this.toastText = this.add.text(width/2,90,"",{
      fontFamily:"sans-serif",
      fontSize:22,
      fontStyle:"bold",
      color:"#466056",
      backgroundColor:"#fffaf0ef",
      padding:{x:18,y:12}
    }).setOrigin(0.5,0).setScrollFactor(0).setDepth(100000).setAlpha(0);
  }

  update() {
    if(!this.player) return;

    const d = Phaser.Math.Distance.Between(
      this.player.x,this.player.y,this.target.x,this.target.y
    );

    if(d > 12) {
      const a = Phaser.Math.Angle.Between(
        this.player.x,this.player.y,this.target.x,this.target.y
      );
      const speed = 235;
      this.player.setVelocity(Math.cos(a)*speed,Math.sin(a)*speed);
      this.player.setFlipX(Math.cos(a)<-0.15);
      if(!this.player.anims.isPlaying) this.player.play("walk");
    } else {
      this.player.setVelocity(0);
      this.player.anims.stop();
      this.player.setFrame(0);
    }

    this.player.setDepth(5000 + this.player.y);
  }

  discover(key) {
    this.discovered.add(key);
    const count = Math.min(5, this.discovered.size);
    this.discoveryText.setText(`★ きょうの発見 ${count}/5`);
    if(count === 5) this.time.delayedCall(250, () => this.celebrate());
  }

  toast(msg) {
    this.toastText.setText(msg).setAlpha(1).setScale(0.92);
    this.tweens.killTweensOf(this.toastText);
    this.tweens.add({
      targets:this.toastText,
      scale:1,
      duration:130,
      onComplete:()=>{
        this.tweens.add({
          targets:this.toastText,
          alpha:0,
          delay:900,
          duration:320
        });
      }
    });
  }

  pulseAt(x,y) {
    const ring = this.add.circle(x,y,18,0xffffff,0)
      .setStrokeStyle(6,0xfff4bf,0.95)
      .setDepth(7000);
    this.tweens.add({
      targets:ring,
      radius:62,
      alpha:0,
      duration:520,
      ease:"Quad.out",
      onComplete:()=>ring.destroy()
    });
  }

  tapRipple(x,y) {
    const ring = this.add.circle(x,y,10,0xffffff,0)
      .setStrokeStyle(4,0xffffff,0.75)
      .setDepth(7000);
    this.tweens.add({
      targets:ring,
      radius:42,
      alpha:0,
      duration:420,
      ease:"Quad.out",
      onComplete:()=>ring.destroy()
    });
  }

  celebrate() {
    this.toast("★ 5こ みつけた！ ★");
    for(let i=0;i<26;i++) {
      const p = this.add.circle(
        this.player.x + Phaser.Math.Between(-60,60),
        this.player.y + Phaser.Math.Between(-50,40),
        Phaser.Math.Between(3,7),
        [0xffd85a,0xff9a70,0xffffff,0x7fd7ff][i%4]
      ).setDepth(9999);
      this.tweens.add({
        targets:p,
        x:p.x+Phaser.Math.Between(-120,120),
        y:p.y-Phaser.Math.Between(100,230),
        alpha:0,
        duration:Phaser.Math.Between(700,1200),
        ease:"Quad.out",
        onComplete:()=>p.destroy()
      });
    }
  }

  spawnBird() {
    const x = this.cameras.main.scrollX - 80;
    const y = this.cameras.main.scrollY + Phaser.Math.Between(110,250);
    const b = this.add.image(x,y,"bird").setDepth(8500).setAlpha(0.75);
    this.tweens.add({
      targets:b,
      x:x+this.scale.width+280,
      y:y+Phaser.Math.Between(-35,35),
      duration:4300,
      ease:"Linear",
      onComplete:()=>b.destroy()
    });
  }
}
