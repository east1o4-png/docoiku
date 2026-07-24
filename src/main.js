import { BootScene } from "./scenes/BootScene.js?v=310";
import { HomeScene } from "./scenes/HomeScene.js?v=310";
import { IslandScene } from "./scenes/IslandScene.js?v=310";

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
  scene: [BootScene, HomeScene, IslandScene]
};

new Phaser.Game(config);
