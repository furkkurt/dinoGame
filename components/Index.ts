import Main from '../components/Main';
import Preloader from '../components/Preloader';
import { useEffect } from 'react';
import 'phaser';

export default function Index() {
  useEffect(() => {
    loadGame();
  }, []);

  const loadGame = async () => {
    if (typeof window !== 'object') {
      return;
    }

    var config = {
      type: Phaser.AUTO,
      scale: {
        mode: Phaser.Scale.FIT,
        parent: 'phaser-example',
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 800,
        height: 450
      },
      physics: {
        default: 'arcade',
        arcade : {
          debug: false,
          //gravity: {y: 5000}
        }
      },
      parent: 'game',
      pixelArt: true,
      backgroundColor: "#FFF"
    };

    var game = new Phaser.Game(config);

    game.scene.add('main', Main);
    game.scene.add('boot', Preloader);
    game.scene.start('boot');
  };

  return null;
}
