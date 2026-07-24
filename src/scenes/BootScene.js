export class BootScene extends Phaser.Scene {
  constructor(){ super("BootScene"); }
  create(){ this.makeTextures(); this.scene.start("HomeScene"); }
  makeTextures(){
    const g=this.make.graphics({x:0,y:0,add:false});
    g.fillStyle(0x4f3527,1);g.fillCircle(48,26,25);g.fillStyle(0xf4c786,1);g.fillCircle(48,39,20);g.fillStyle(0x1f2a30,1);g.fillCircle(41,38,2.3);g.fillCircle(55,38,2.3);g.fillStyle(0x2d7bb6,1);g.fillRoundedRect(27,58,42,47,14);g.fillStyle(0x28414f,1);g.fillRoundedRect(30,100,14,28,7);g.fillRoundedRect(52,100,14,28,7);g.generateTexture("player",96,136);g.clear();
    g.fillStyle(0x795133,1);g.fillRoundedRect(48,82,22,76,9);[[58,50,42,0x3f8e4d],[34,70,30,0x55a85a],[83,72,31,0x6fbb67],[56,81,35,0x55a85a]].forEach(p=>{g.fillStyle(p[3],1);g.fillCircle(p[0],p[1],p[2]);});g.generateTexture("tree",118,165);g.clear();
    g.fillStyle(0x4a9a4d,1);g.fillRect(23,28,4,30);g.fillStyle(0xffffff,1);for(let i=0;i<6;i++){const a=i*Math.PI/3;g.fillCircle(25+Math.cos(a)*11,24+Math.sin(a)*11,7);}g.fillStyle(0xffd85a,1);g.fillCircle(25,24,6);g.generateTexture("flower",50,62);g.clear();
    g.fillStyle(0x8a9599,1);g.fillRoundedRect(8,18,56,36,14);g.fillStyle(0xaab3b5,1);g.fillEllipse(30,24,30,12);g.generateTexture("rock",72,60);g.clear();
    g.fillStyle(0xffd7ad,1);g.fillEllipse(25,28,36,28);g.generateTexture("shell",50,45);g.clear();
    g.fillStyle(0xd86442,1);g.fillCircle(28,26,13);g.fillCircle(16,18,7);g.fillCircle(40,18,7);g.generateTexture("crab",58,50);g.clear();
    g.fillStyle(0xf6c348,.95);g.fillEllipse(15,18,18,25);g.fillEllipse(35,18,18,25);g.fillStyle(0x4d3a28,1);g.fillRoundedRect(23,10,4,25,2);g.generateTexture("butterfly",50,40);g.clear();
    g.lineStyle(5,0x44515a,1);g.beginPath();g.arc(16,20,11,Math.PI,Math.PI*2);g.strokePath();g.beginPath();g.arc(36,20,11,Math.PI,Math.PI*2);g.strokePath();g.generateTexture("bird",52,30);g.clear();
    g.fillStyle(0xf3d7ae,1);g.fillRoundedRect(16,62,128,94,14);g.fillStyle(0xc86748,1);g.fillTriangle(8,70,80,10,152,70);g.fillStyle(0x8b5d3d,1);g.fillRoundedRect(67,109,28,47,7);g.fillStyle(0x8cc8df,1);g.fillRoundedRect(31,90,28,25,6);g.fillRoundedRect(102,90,28,25,6);g.generateTexture("house",160,165);g.destroy();
  }
}
