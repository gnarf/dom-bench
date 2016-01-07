'use strict';

import $ from 'jquery';

const assets = require.context('./assets');

export default class DomSheet {
  constructor(state) {
    this.state = state;
    this.onChange = this.onChange.bind(this);
    this.state.onChange(this.onChange);

    this.$element = $('<div width="1024" height="1024" style="width: 1024px; height: 1024px; overflow: hidden;"></div>');
    this.$element.appendTo('body');

    this.$elements = [];
    this._frame = 0;

    this.onChange();
  }

  destroy() {
    this.state.removeChangeListener(this.onChange);
    this.$element.remove();
  }

  onChange() {
    let nElements = Math.floor(this.state.elements);
    let nAnimating = Math.floor(this.state.animating);
    while (this.$elements.length > nElements) {
      this.$elements.pop().remove();
    }

    while (this.$elements.length < nElements) {
      this.$elements.push($(`<div class="css-animating" data-frame="0" ></div>`).appendTo(this.$element));
    }

    let _frame = this._frame;
    let lastFrame = _frame;
    _frame = this._frame = _frame < 8 ? _frame + 1 : 0;
    for (let i in this.$elements) {
      let $el = this.$elements[i];
      if (i >= nAnimating) {
        $el[0].style.animationPlayState = 'paused';
      }
      else {
        $el[0].style.animationPlayState = 'running';
      }
      // let frame = Number($el.data('frame'));
      // frame = frame < 8 ? frame + 1 : 0;
      // $el.removeClass(`classes-animating-${lastFrame}`);
      // $el.addClass(`classes-animating-${_frame}`);
      // $el.data('frame', frame);
    }
  }

  frame() {
  }
}
