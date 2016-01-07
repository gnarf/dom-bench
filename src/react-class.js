'use strict';

import $ from 'jquery';
import React, { Component } from 'react';
import { render } from 'react-dom';

const assets = require.context('./assets');

class Runner {
  constructor() {
    this.requests = [];
    this.nextRequests = [];
    this.pool = [];
    this.nextId = 0;
  }

  request(fn) {
    let _request = this.pool.pop() || [,];
    _request[0] = this.nextId++;
    _request[1] = fn;
    this.nextRequests.push(_request);
    return _request[0];
  }

  cancel(id) {
    for (let i = 0; i < this.requests.length; i++) {
      let [requestId] = this.requests[i];
      if (id === requestId) {
        let request = this.requests[i];
        request[1] = null;
        return;
      }
    }
    for (let i = 0; i < this.nextRequests.length; i++) {
      let [requestId] = this.nextRequests[i];
      if (id === requestId) {
        let request = this.nextRequests[i];
        request[1] = null;
        return;
      }
    }
  }

  step() {
    let tmp = this.requests;
    this.requests = this.nextRequests;
    this.nextRequests = tmp;

    for (let tuple of this.nextRequests) {
      tuple[1] = null;
      this.pool.push(tuple);
    }
    this.nextRequests.length = 0;

    for (let [, fn] of this.requests) {
      if (fn) {
        fn();
      }
    }
  }
}

class Spinner extends Component {
  constructor(...args) {
    super(...args);

    this.frame = 7;
    this.step = this.step.bind(this);
  }

  state = {
    frame: 0,
  }

  step() {
    this.stepId = this.props.runner.request(this.step);
    this.frame++;
    if (this.frame >= 8) {
      this.frame = 0;
    }
    this.setState({frame: this.frame});
  }

  cancelStep() {
    this.props.runner.cancel(this.stepId);
  }

  componentWillMount() {
    if (this.props.animating) {
      this.stepId = this.props.runner.request(this.step);
    }
  }

  componentWillUpdate(nextProps) {
    this.cancelStep();
    if (nextProps.animating) {
      this.stepId = this.props.runner.request(this.step);
    }
  }

  componentWillUnmount() {
    this.cancelStep();
  }

  render() {
    return <div className={`react-class-spinner-${this.state.frame} react-class-spinner`} ></div>;
  }
}

class Divs extends Component {
  render() {
    return <div>
      {this.props.frames.map((frame, index) => {
        return <Spinner key={index} runner={this.props.runner} animating={frame.animating} />;
      })}
    </div>;
  }
}

export default class ReactDiv {
  constructor(state) {
    this.state = state;
    this.onChange = this.onChange.bind(this);
    this.state.onChange(this.onChange);

    this.runner = new Runner();

    this.$element = $('<div width="1024" height="1024" style="width: 1024px; height: 1024px; overflow: hidden;"></div>');
    this.$element.appendTo('body');

    this.elements = [];
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
    while (this.elements.length > nElements) {
      this.elements.pop();
    }

    while (this.elements.length < nElements) {
      this.elements.push({animating: 0});
    }

    let _frame = this._frame;
    _frame = this._frame = _frame < 7 ? _frame + 1 : 0;
    for (let i in this.elements) {
      // if (i >= nAnimating) { break; }
      this.elements[i].animating = i < nAnimating;
      // let $el = this.$elements[i];
      // let frame = Number($el.data('frame'));
      // frame = frame < 8 ? frame + 1 : 0;
      // $el[0].style.backgroundPositionX = `-${_frame * 32}px`;
      // $el.css('background-position-x', `-${_frame * 32}px`);
      // $el.data('frame', frame);
    }

    // this.topElement.setProps({frames: this.elements});
    render(<Divs runner={this.runner} frames={this.elements} />, this.$element[0]);
  }

  frame() {
    this.runner.step();
  }
}
