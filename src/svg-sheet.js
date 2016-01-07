'use strict';

import $ from 'jquery';

const assets = require.context('./assets');

export default class DomSheet {
  constructor(state) {
    this.state = state;
    this.onChange = this.onChange.bind(this);
    this.state.onChange(this.onChange);

    this.$element = $(`<div width="1024" height="1024" style="width: 1024px; height: 1024px; overflow: hidden;"><svg viewBox="0 0 0 0" width="0" height="0"><defs><pattern id="svg-frame-0" patternUnits="userSpaceOnUse" width="32" height="32"><image xlink:href="${assets('./sheet-row.png')}" x="-" y="0" width="256" height="32" ></image></pattern><pattern id="svg-frame-1" patternUnits="userSpaceOnUse" width="32" height="32"><image xlink:href="${assets('./sheet-row.png')}" x="-32" y="0" width="256" height="32" ></image></pattern><pattern id="svg-frame-2" patternUnits="userSpaceOnUse" width="32" height="32"><image xlink:href="${assets('./sheet-row.png')}" x="-64" y="0" width="256" height="32" ></image></pattern><pattern id="svg-frame-3" patternUnits="userSpaceOnUse" width="32" height="32"><image xlink:href="${assets('./sheet-row.png')}" x="-96" y="0" width="256" height="32" ></image></pattern><pattern id="svg-frame-4" patternUnits="userSpaceOnUse" width="32" height="32"><image xlink:href="${assets('./sheet-row.png')}" x="-128" y="0" width="256" height="32" ></image></pattern><pattern id="svg-frame-5" patternUnits="userSpaceOnUse" width="32" height="32"><image xlink:href="${assets('./sheet-row.png')}" x="-160" y="0" width="256" height="32" ></image></pattern><pattern id="svg-frame-6" patternUnits="userSpaceOnUse" width="32" height="32"><image xlink:href="${assets('./sheet-row.png')}" x="-192" y="0" width="256" height="32" ></image></pattern><pattern id="svg-frame-7" patternUnits="userSpaceOnUse" width="32" height="32"><image xlink:href="${assets('./sheet-row.png')}" x="-224" y="0" width="256" height="32" ></image></pattern></defs></svg></div>`);
    this.$element.appendTo('body');

    this.$elements = [];
    this.$imgElements = [];
    this.$rectElements = [];
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
      this.$imgElements.pop();
    }

    while (this.$elements.length < nElements) {
      this.$elements.push($(`<svg viewBox="0 0 32 32" width="32" height="32" style="display: inline-block; width: 32px; height: 32px; vertical-align: top;" data-frame="0" ><defs></defs><g><rect x="0" y="0" width="32" height="32" fill="url(#svg-frame-0)"></rect></g></svg>`).appendTo(this.$element));
      this.$imgElements.push(this.$elements[this.$elements.length - 1].find('image'));
      this.$rectElements.push(this.$elements[this.$elements.length - 1].find('rect'));
    }

    let _frame = this._frame;
    _frame = this._frame = _frame < 7 ? _frame + 1 : 0;
    for (let i in this.$elements) {
      if (i >= nAnimating) { break; }
      let $el = this.$elements[i];
      // let frame = Number($el.data('frame'));
      // frame = frame < 8 ? frame + 1 : 0;
      this.$rectElements[i].attr('fill', `url(#svg-frame-${_frame})`);
      // this.$img
      // $el[0].style.backgroundPositionX = `-${_frame * 32}px`;
      // $el.css('background-position-x', `-${_frame * 32}px`);
      // $el.data('frame', frame);
    }
  }
}
