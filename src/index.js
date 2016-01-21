'use strict';

import EventEmitter from 'events';

import $ from 'jquery';
import Dat from 'dat-gui';
import Stats from './vendor/stats.min';
import _ from 'lodash';

import Hopeless from './hopeless';

class State extends EventEmitter {
  constructor() {
    super();

    let stats = this.stats = new Stats();
    $('body').append(stats.domElement);

    this.keys = ['hopelessness', 'width', 'height', 'seed', 'randomSeed'];
    this.saveKeys = ['hopelessness', 'width', 'height'];

    this.hertz = 60;

    this.hopeless = new Hopeless();

    this.hopelessness = 4;
    this.hopelessnessArgs = [1, 10];
    this.hopelessnessStep = 1;

    this.width = 10;
    this.widthArgs = [5, 50];
    this.widthStep = 1;
    this.lastFrame = Date.now();

    this.height = 10;
    this.heightArgs = [5, 50];
    this.heightStep = 1;

    this.randomSeed();

    this.onChange(() => this.startGame());
  }

  onChange(fn) {
    this.addListener('change', fn);
  }

  onFinishChange(fn) {
    this.addListener('finishChange', fn);
  }

  removeChangeListener(fn) {
    this.removeListener('change', fn);
    this.removeListener('finishChange', fn);
  }

  randomSeed() {
    this.seed = 'hopeless' + Date.now();
    if (this.seedController) {
      this.seedController.updateDisplay();
      this.startGame();
    } 
  }

  startGame() {
    this.hopeless.start({ colors: this.hopelessness + 1, width: this.width, height: this.height, seed: this.seed })
  }

  initGui() {
    this.gui = new Dat.GUI();
    for (let key of this.keys) {
      let controller = this[key + 'Controller'] = this.gui.add(this, key, ...(this[key + 'Args'] || []));
      let step = this[key + 'Step'];
      if (step) {
        controller.step(step);
      }
      controller.onChange(() => {
        this.emit('change');
      });
      controller.onFinishChange(() => {
        this.emit('finishChange');
      });
    }

  }

  initLoop() {
    let step = () => {
      this.nextFrame = requestAnimationFrame(step);
      let now = Date.now();

      this.stats.begin();
      if (now - this.lastFrame < 1000 / this.hertz) {
        this.stats.end();
        return;
      }
      this.lastFrame = now;
      this.hopeless.render();
      this.stats.end();
    };

    step();
  }

  initRouter() {
    this.onChange(() => this.saveState());

    window.addEventListener('popstate', (event) => this.loadState());

    this.loadState();
  }

  initFinish() {
    this.emit('change');
  }

  saveState() {
    history.pushState(_.pick(this, this.saveKeys), '', '#' + JSON.stringify(this.saveKeys.map(key => this[key])));
  }

  loadState() {
    let stateStr = location.hash.substring(1);
    try {
      (JSON.parse(stateStr) || []).forEach((value, index) => {
        this[this.saveKeys[index]] = value;
        this[this.saveKeys[index] + 'Controller'].updateDisplay();
      });
    } catch(e) {

    }
    this.emit('change');
  }
}

let state = new State();
state.initGui();
state.initLoop();
state.initRouter();
state.initFinish();
