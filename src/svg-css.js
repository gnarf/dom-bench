'use strict';

import $ from 'jquery';

const assets = require.context('./assets');

export default class SvgClasses {
  constructor(state) {
    this.state = state;
    this.onChange = this.onChange.bind(this);
    this.state.onChange(this.onChange);

    this.$element = $(`<div width="1024" height="1024" style="width: 1024px; height: 1024px; overflow: hidden;"><svg viewBox="0 0 0 0" width="0" height="0"><defs><pattern id="svg-class-0" patternUnits="userSpaceOnUse" width="32" height="32"><image xlink:href="${assets('./sheet-row.png')}" x="0" y="0" width="256" height="32" ></image></pattern><pattern id="svg-class-1" patternUnits="userSpaceOnUse" width="32" height="32"><image xlink:href="${assets('./sheet-row.png')}" x="-32" y="0" width="256" height="32" ></image></pattern><pattern id="svg-class-2" patternUnits="userSpaceOnUse" width="32" height="32"><image xlink:href="${assets('./sheet-row.png')}" x="-64" y="0" width="256" height="32" ></image></pattern><pattern id="svg-class-3" patternUnits="userSpaceOnUse" width="32" height="32"><image xlink:href="${assets('./sheet-row.png')}" x="-96" y="0" width="256" height="32" ></image></pattern><pattern id="svg-class-4" patternUnits="userSpaceOnUse" width="32" height="32"><image xlink:href="${assets('./sheet-row.png')}" x="-128" y="0" width="256" height="32" ></image></pattern><pattern id="svg-class-5" patternUnits="userSpaceOnUse" width="32" height="32"><image xlink:href="${assets('./sheet-row.png')}" x="-160" y="0" width="256" height="32" ></image></pattern><pattern id="svg-class-6" patternUnits="userSpaceOnUse" width="32" height="32"><image xlink:href="${assets('./sheet-row.png')}" x="-192" y="0" width="256" height="32" ></image></pattern><pattern id="svg-class-7" patternUnits="userSpaceOnUse" width="32" height="32"><image xlink:href="${assets('./sheet-row.png')}" x="-224" y="0" width="256" height="32" ></image></pattern></defs></svg></div>`);
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
    let nElements = Math.floor(this.state.elements);
    let nAnimating = Math.floor(this.state.animating);
    while (this.$elements.length > nElements) {
      this.$elements.pop().remove();
      this.$imgElements.pop();
      this.$rectElements.pop();
    }

    while (this.$elements.length < nElements) {
      this.$elements.push($(`<svg viewBox="0 0 32 32" width="32" height="32" style="display: inline-block; width: 32px; height: 32px; vertical-align: top;" data-frame="0" ><defs></defs><g><rect x="0" y="0" width="32" height="32" class="svg-animating"></rect></g></svg>`).appendTo(this.$element));
      this.$imgElements.push(this.$elements[this.$elements.length - 1].find('image'));
      this.$rectElements.push(this.$elements[this.$elements.length - 1].find('rect'));
    }

    for (let i in this.$elements) {
      // if (i >= nAnimating) { break; }
      // let $el = this.$elements[i];
      this.$rectElements[i][0].classList.remove('svg-animating');
      this.$rectElements[i][0].classList.add('svg-not-animating');
      if (i < nAnimating) {
        this.$rectElements[i][0].classList.add('svg-animating');
        this.$rectElements[i][0].classList.remove('svg-not-animating');
        this.$rectElements[i][0].style.animationDuration = 8 / this.state.hertz;
      }
      // let frame = Number($el.data('frame'));
      // frame = frame < 8 ? frame + 1 : 0;
      // this.$rectElements[i][0].classList.remove(`svg-class-${lastFrame}`);
      // this.$rectElements[i][0].classList.add(`svg-class-${_frame}`);
      // this.$rectElements[i].attr('fill', `url(#svg-class-${_frame})`);
      // this.$img
      // $el[0].style.backgroundPositionX = `-${_frame * 32}px`;
      // $el.css('background-position-x', `-${_frame * 32}px`);
      // $el.data('frame', frame);
    }
  }

  frame() {
    // let nElements = Math.floor(this.state.elements);
    // let nAnimating = Math.floor(this.state.animating);
    // while (this.$elements.length > nElements) {
    //   this.$elements.pop().remove();
    //   this.$imgElements.pop();
    //   this.$rectElements.pop();
    // }
    //
    // while (this.$elements.length < nElements) {
    //   this.$elements.push($(`<svg viewBox="0 0 32 32" width="32" height="32" style="display: inline-block; width: 32px; height: 32px; vertical-align: top;" data-frame="0" ><defs></defs><g><rect x="0" y="0" width="32" height="32" class="svg-animating"></rect></g></svg>`).appendTo(this.$element));
    //   this.$imgElements.push(this.$elements[this.$elements.length - 1].find('image'));
    //   this.$rectElements.push(this.$elements[this.$elements.length - 1].find('rect'));
    // }

    // let _frame = this._frame;
    // let lastFrame = _frame;
    // _frame = this._frame = _frame < 7 ? _frame + 1 : 0;
    // console.log(`svg-class-${lastFrame}`, `svg-class-${_frame}`, this.$elements.length, nAnimating);
    // console.log(this.$rectElements[0]);
    // for (let i in this.$elements) {
    //   if (i >= nAnimating) { break; }
    //   let $el = this.$elements[i];
    //   // let frame = Number($el.data('frame'));
    //   // frame = frame < 8 ? frame + 1 : 0;
    //   // this.$rectElements[i][0].classList.remove(`svg-class-${lastFrame}`);
    //   // this.$rectElements[i][0].classList.add(`svg-class-${_frame}`);
    //   // this.$rectElements[i].attr('fill', `url(#svg-class-${_frame})`);
    //   // this.$img
    //   // $el[0].style.backgroundPositionX = `-${_frame * 32}px`;
    //   // $el.css('background-position-x', `-${_frame * 32}px`);
    //   // $el.data('frame', frame);
    // }
  }
}
