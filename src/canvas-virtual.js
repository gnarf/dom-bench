'use strict';

import $ from 'jquery';

const assets = require.context('./assets');

export default class Canvas {
  constructor(state) {
    this.state = state;
    this.onChange = this.onChange.bind(this);
    this.state.onChange(this.onChange);

    this.$root = $('<div style="position: relative"></div>').insertAfter(this.state.stats.domElement);
    this.$staticElement = $('<canvas width="1024" height="1024" style="position: absolute; top: 0; left: 0"></canvas>');
    this.$element = $('<canvas width="1024" height="1024" style="position: absolute; top: 0; left: 0"></canvas>');
    this.$staticElement.appendTo(this.$root);
    this.$element.appendTo(this.$root);

    this.$elements = [];
    this._frame = 0;

    this.background = $(`<img src="${assets('./grid-16.png')}">`)[0];
    this.background.addEventListener('load', () => { this.onChange(); });
    this.sheet = $(`<img src="${assets('./sheet-row.png')}" />`)[0];
    this.sheet.addEventListener('load', () => { this.onChange(); });

    this.onChange();
  }

  destroy() {
    this.state.removeChangeListener(this.onChange);
    this.$root.remove();
  }

  onChange() {
    this.staticCtx = this.$staticElement[0].getContext('2d');
    let nAnimating = Math.floor(this.state.animating);
    if (nAnimating === 0) { return; }
    let nElements = Math.floor(this.state.elements);

    // this.staticCtx.clearRect(0, 0, 1024, 1024);
    this.staticCtx.drawImage(this.background, 0, 0, 1024, 1024);
    let i = nAnimating;
    for (; i < nElements; i++) {
      this.staticCtx.drawImage(this.sheet, 0, 0, 32, 32, (i % 32) * 32, Math.floor(i / 32) * 32, 32, 32);
    }
    this.$staticElement.insertBefore(this.$element);
  }

  frame() {
    this.ctx = this.$element[0].getContext('2d');
    let nAnimating = Math.floor(this.state.animating);
    if (nAnimating === 0) { return; }
    let nElements = Math.floor(this.state.elements);
    let _frame = this._frame;
    _frame = this._frame = _frame < 7 ? _frame + 1 : 0;

    this.ctx.clearRect(0, 0, 1024, 1024);
    // this.ctx.drawImage(this.$staticElement[0], 0, 0, 1024, 1024);
    let i = 0;
    for (; i < nAnimating; i++) {
      this.ctx.drawImage(this.sheet, _frame * 32, 0, 32, 32, (i % 32) * 32, Math.floor(i / 32) * 32, 32, 32);
    }
    console.log(nAnimating, i);
    // debugger;
  }
}
