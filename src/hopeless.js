import $ from 'jquery';
import React, { Component } from 'react';
import { render } from 'react-dom';
import rng from 'migl-rng';

class Square extends Component {
	get stylePosition() {
		var w = 100 / this.props.game.width;
		var h = 100 / this.props.game.height;
		return {
			left: (w * this.props.x) + '%',
			bottom: (h * this.props.y) + '%',
			width: w + 0.1 + '%',
			height: h + 0.1 + '%',
		};
	}
	click(event) {
		this.props.game.removeSquare(this.props.x, this.props.y);
	}
	get key() { return this.props.id; }
	render() {
		return <div onMouseOver={event => this.click(event)} className={'color' + this.props.color + ' square'} style={this.stylePosition}/>;
	}
}

class Board extends Component {

	get squares() {
		return (this.props.game.board || []).reduce( (memo, row) => (row || []).reduce( (memo, square) => {
			if (square && square.id) {
				memo.push(square);
			}
			return memo;
		}, memo), [])
	}

	render() {
		return <div className='board'>{this.squares.map(square => <Square key={square.id} color={square.color} x={square.x} y={square.y} game={this.props.game} />)}</div>;
	}
}

export default class Hopeless {
	constructor() {
		this.$root = $('<div class="hopeless">').prependTo('body');

		this.onChange();
	}

	start({ colors = 6, width = 40, height = 30, seed = Math.random() }) {
		this.colors = colors;
		this.width = width;
		this.height = height;
		this.seed = seed;
		this.rng = rng.create(seed);
		this.board = [];
		for( let x = 0; x < width; x++) {
			let row = [];
			this.board.push(row);
			for( let y = 0; y < height; y++) {
				row.push({
					x, y,
					color: Math.floor(this.rng.randomBounded(1, this.colors + 1)),
					id: `${x}.${y}`,
				});
			}
		}

		this.onChange();
	}

	removeSquare(x, y) {
		var square = this.board[x][y];
		if (square) {
			let y2 = y;
			for( ; y2<this.height; y2++) {
				this.board[x][y2] = this.board[x][y2 + 1];
				if (!this.board[x][y2]) {
					break;
				}
				this.board[x][y2].y = y2;
			}
			if (y2 === 0) {
				for(let x2 = x; x2<this.width; x2++) {
					this.board[x2] = this.board[x2+1];
					if (this.board[x2]) {
						this.board[x2].forEach(square => {
							if (square) square.x = x2;
						});
					} else {
						break;
					}
				}
			}
		}
		this.onChange();
	}

	onChange() {
		render(<Board game={this} />, this.$root[0]);
	}
}