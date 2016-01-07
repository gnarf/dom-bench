'use strict';

import $ from 'jquery';

const assets = require.context('./assets');

export default class Canvas {
  constructor(state) {
    this.state = state;
    this.onChange = this.onChange.bind(this);
    this.state.onChange(this.onChange);

    this.$element = $('<canvas width="1024" height="1024"></canvas>');
    this.$element.appendTo('body');
    this.ctx = this.$element[0].getContext('2d');

    this.$elements = [];
    this._frame = 0;

    this.sheet = $(`<img src="${assets('./sheet-row.png')}" />`)[0];
  }

  destroy() {
    this.state.removeChangeListener(this.onChange);
    this.$element.remove();
  }

  onChange() {
  }

  frame() {
    let nAnimating = Math.floor(this.state.animating);
    if (nAnimating === 0) { return; }
    let nElements = Math.floor(this.state.elements);
    let _frame = this._frame;
    _frame = this._frame = _frame < 7 ? _frame + 1 : 0;

    this.ctx.clearRect(0, 0, 1024, 1024);
    let i = 0;
    for (; i < nAnimating; i++) {
      this.ctx.drawImage(this.sheet, _frame * 32, 0, 32, 32, (i % 32) * 32, Math.floor(i / 32) * 32, 32, 32);
    }
    for (; i < nElements; i++) {
      this.ctx.drawImage(this.sheet, 0, 0, 32, 32, (i % 32) * 32, Math.floor(i / 32) * 32, 32, 32);
    }
  }
}
