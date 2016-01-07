'use strict';

import EventEmitter from 'events';

import $ from 'jquery';
import Dat from 'dat-gui';
import Stats from './vendor/stats.min';
import _ from 'lodash';

import Canvas from './canvas';
import CanvasN from './canvas-n';
import Classes from './classes';
import CssAnimation from './css-animation';
import Dom from './dom';
import DomSheet from './dom-sheet';
import Img from './img';
import ImgSheet from './img-sheet';
import ReactClass from './react-class';
import ReactCss from './react-css';
import ReactDiv from './react-div';
import SvgSheet from './svg-sheet';

const renderers = {
  'canvas': Canvas,
  'canvas n': CanvasN,
  'classes': Classes,
  'css animation': CssAnimation,
  'dom': Dom,
  'dom sheet': DomSheet,
  'img': Img,
  'img sheet': ImgSheet,
  'react class': ReactClass,
  'react css': ReactCss,
  'react div': ReactDiv,
  'svg sheet': SvgSheet,
};

class State extends EventEmitter {
  constructor() {
    super();

    let stats = this.stats = new Stats();
    $('body').append(stats.domElement);

    this.keys = ['mode', 'elements', 'animating', 'hertz'];

    this.mode = 'dom';
    this.modeArgs = [_.keys(renderers)];

    this.hertz = 60;
    this.hertzArgs = [1, 60, 1];
    this.lastFrame = Date.now();

    this.elements = 0;
    this.elementsArgs = [0, 1000, 1];

    this.animating = 0;
    this.animatingArgs = [0, 1000, 1];
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

  initGui() {
    this.gui = new Dat.GUI();
    for (let key of this.keys) {
      let controller = this[key + 'Controller'] = this.gui.add(this, key, ...this[key + 'Args']);
      controller.onChange(() => {
        this.emit('change');
      });
      controller.onFinishChange(() => {
        this.emit('finishChange');
      });
    }

    this.onChange(() => {
      if (this.mode !== this.activeModeName) {
        if (this.activeMode && this.activeMode.destroy) {
          this.activeMode.destroy();
        }

        this.activeModeName = this.mode;
        if (renderers[this.mode]) {
          this.activeMode = new (renderers[this.mode])(this);
        }
      }
    });
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

      if (this.activeMode && this.activeMode.frame) {
        this.activeMode.frame();
      }
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
    history.pushState(_.pick(this, this.keys), '', '#' + JSON.stringify(this.keys.map(key => this[key])));
  }

  loadState() {
    let stateStr = location.hash.substring(1);
    JSON.parse(stateStr).forEach((value, index) => {
      this[this.keys[index]] = value;
      this[this.keys[index] + 'Controller'].updateDisplay();
    });
  }
}

let state = new State();
state.initGui();
state.initLoop();
state.initRouter();
state.initFinish();
