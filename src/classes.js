'use strict';

import $ from 'jquery';

const assets = require.context('./assets');

export default class DomSheet {
  constructor(state) {
    this.state = state;
    this.onChange = this.onChange.bind(this);
    this.state.onChange(this.onChange);

    this.$root = $('<div style="position: relative"></div>').insertAfter(this.state.stats.domElement);
    $(`<img src="${assets('./grid-16.png')}">`).appendTo(this.$root);
    this.$element = $('<div width="1024" height="1024" style="width: 1024px; height: 1024px; overflow: hidden; position: absolute; top: 0; left: 0"></div>');
    this.$element.appendTo(this.$root);

    this.$elements = [];
    this._frame = 0;
  }

  destroy() {
    this.state.removeChangeListener(this.onChange);
    this.$root.remove();
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
      this.$elements.push($(`<div class="classes-animating" data-frame="0" ></div>`).appendTo(this.$element));
    }

    let _frame = this._frame;
    let lastFrame = _frame;
    _frame = this._frame = _frame < 7 ? _frame + 1 : 0;
    for (let i in this.$elements) {
      if (i >= nAnimating) { break; }
      let $el = this.$elements[i];
      // let frame = Number($el.data('frame'));
      // frame = frame < 8 ? frame + 1 : 0;
      $el[0].classList.remove(`classes-animating-${lastFrame}`);
      $el[0].classList.add(`classes-animating-${_frame}`);
      // $el.removeClass(`classes-animating-${lastFrame}`);
      // $el.addClass(`classes-animating-${_frame}`);
      // $el.data('frame', frame);
    }
  }
}
