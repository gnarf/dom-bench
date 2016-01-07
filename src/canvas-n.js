'use strict';

import $ from 'jquery';

const assets = require.context('./assets');

export default class Canvas {
  constructor(state) {
    this.state = state;
    this.onChange = this.onChange.bind(this);
    this.state.onChange(this.onChange);

    this.$element = $('<div style="width: 1024px; height: 1024px; overflow: hidden;"></div>');
    this.$element.appendTo('body');

    this.$elements = [];
    this.ctxs = [];
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
    let nElements = Math.floor(this.state.elements);
    while (this.$elements.length > nElements) {
      this.$elements.pop().remove();
      this.ctxs.pop();
    }

    while (this.$elements.length < nElements) {
      this.$elements.push($(`<canvas width="32" height="32" data-frame="0" style="vertical-align: top;"></canvas>`).appendTo(this.$element));
      this.ctxs.push(this.$elements[this.$elements.length - 1][0].getContext('2d'));
      this.ctxs[this.ctxs.length - 1].drawImage(this.sheet, 0, 0, 32, 32, 0, 0, 32, 32);
    }

    let _frame = this._frame;
    _frame = this._frame = _frame < 7 ? _frame + 1 : 0;
    let i = 0;
    for (; i < nAnimating; i++) {
      this.ctxs[i].clearRect(0, 0, 32, 32);
      this.ctxs[i].drawImage(this.sheet, _frame * 32, 0, 32, 32, 0, 0, 32, 32);
    }
    // for (; i < nElements; i++) {
    //   this.ctxs[i].clearRect(0, 0, 32, 32);
    //   this.ctxs[i].drawImage(this.sheet, 0, 0, 32, 32, 0, 0, 32, 32);
    // }
  }
}
