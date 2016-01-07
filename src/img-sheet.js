'use strict';

import $ from 'jquery';

const assets = require.context('./assets');

export default class DomSheet {
  constructor(state) {
    this.state = state;
    this.onChange = this.onChange.bind(this);
    this.state.onChange(this.onChange);

    this.$element = $('<div style="width: 1024px; height: 1024px; overflow: hidden;"></div>');
    this.$element.appendTo('body');

    this.$elements = [];
    this._frame = 0;
  }

  destroy() {
    this.state.removeChangeListener(this.onChange);
    this.$element.remove();
  }

  onChange() {
  }

  frame() {
    let nElements = Math.floor(this.state.elements);
    let nAnimating = Math.floor(this.state.animating);
    while (this.$elements.length > nElements) {
      this.$elements.pop().remove();
    }

    while (this.$elements.length < nElements) {
      this.$elements.push($(`<img src="${assets('./sheet-row.png')}" style="width: 32px; height: 32px; vertical-align: top; object-fit: none; object-position: 0 0;" data-frame="0"/>`).appendTo(this.$element));
    }

    let _frame = this._frame;
    _frame = this._frame = _frame < 7 ? _frame + 1 : 0;
    for (let i in this.$elements) {
      if (i >= nAnimating) { break; }
      let $el = this.$elements[i];
      // let frame = Number($el.data('frame'));
      // frame = frame < 8 ? frame + 1 : 0;
      $el[0].style.objectPosition = `${-_frame * 32}px 0`;
      // $el.css('object-position', `-${_frame * 32}px 0`);
      // $el.data('frame', frame);
    }
  }
}
