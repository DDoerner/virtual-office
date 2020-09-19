import { Component, OnInit } from '@angular/core';
import Phaser from 'phaser';
import { GameState } from '../gamestate';
import { SimController } from '../sim-controller';
import { SimCreator } from '../sim-creator';

@Component({
  selector: 'app-simulation',
  templateUrl: './simulation.component.html',
  styleUrls: ['./simulation.component.scss'],
})
export class SimulationComponent implements OnInit {

  private phaserGame: Phaser.Game;
  private config: Phaser.Types.Core.GameConfig;

  constructor() {
    this.config = {
      type: Phaser.AUTO,
      width: screen.width,
      height: screen.height,
      physics: {
          default: 'arcade',
          arcade: {
              gravity: { y: 200 }
          }
      },
      scene: [ MainScene ]
    };
  }

  ngOnInit() {
    this.phaserGame = new Phaser.Game(this.config);
    new GameState(200, 200).setGame(this.phaserGame);
  }

}

class MainScene extends Phaser.Scene {

  private creator: SimCreator;

  constructor() {
    super({ key: 'main' });
  }

  create() {
    GameState.instance.setScene(this);
    this.creator = new SimCreator();
    this.creator.create(this);

    const controller = new SimController(this.creator);
    window['controller'] = controller;

    this.input.keyboard.on('keydown_W', controller.moveUp, this);
    this.input.keyboard.on('keydown_UP', controller.moveUp, this);
    this.input.keyboard.on('keydown_A', controller.moveLeft, this);
    this.input.keyboard.on('keydown_LEFT', controller.moveLeft, this);
    this.input.keyboard.on('keydown_S', controller.moveDown, this);
    this.input.keyboard.on('keydown_DOWN', controller.moveDown, this);
    this.input.keyboard.on('keydown_D', controller.moveRight, this);
    this.input.keyboard.on('keydown_RIGHT', controller.moveRight, this);
  }

  preload() {
    this.load.spritesheet('spritesheet', './assets/texturemap.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('character1', './assets/character1.png', { frameWidth: 311 / 12, frameHeight: 42 });
  }

  update() {

  }
}
