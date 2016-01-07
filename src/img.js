'use strict';

import $ from 'jquery';

const assets = require.context('./assets');

export default class Dom {
  constructor(state) {
    this.state = state;
    this.onChange = this.onChange.bind(this);
    this.state.onChange(this.onChange);

    this.$element = $('<div width="1024" height="1024" style="width: 1024px; height: 1024px; overflow: hidden;"></div>');
    this.$element.appendTo('body');

    this.$elements = [];
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
      this.$elements.push($(`<img src="${assets('./img0.png')}" style="vertical-align: top;" data-frame="0"/>`).appendTo(this.$element));
    }

    for (let i in this.$elements) {
      if (i >= nAnimating) { break; }
      let $el = this.$elements[i];
      let frame = Number($el.data('frame'));
      frame = frame < 4 ? frame + 1 : 0;
      $el.attr('src', assets(`./img${frame}.png`));
      $el.data('frame', frame);
    }
  }
}
