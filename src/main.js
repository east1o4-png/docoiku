import { BootScene } from "./scenes/BootScene.js";
import { HomeScene } from "./scenes/HomeScene.js";
import { IslandScene } from "./scenes/IslandScene.js";

const config = {
  type: Phaser.AUTO,
  parent: "game",
  backgroundColor: "#7fcde8",
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: window.innerWidth,
    height: window.innerHeight
  },
  render: {
    antialias: true,
    pixelArt: false,
    roundPixels: false
  },
  physics: {
    default: "arcade",
    arcade: { debug: false }
  },
  scene: [BootScene, HomeScene, IslandScene]
};

new Phaser.Game(config);
