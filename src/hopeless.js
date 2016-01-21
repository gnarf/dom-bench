import $ from 'jquery';
import React, { Component } from 'react';
import { render } from 'react-dom';
import rng from 'migl-rng';

class Square extends Component {
	get stylePosition() {
		var w = 100 / this.props.game.width;
		var h = 100 / this.props.game.height;
		return {
			transform: 'translate3d( ' + (this.props.x * 100) + '%, ' + (-this.props.y * 100) + '%, 0)',

			// -or-

			// left: (this.props.x * w) + '%',
			// bottom: (this.props.y * h) + '%',

			width: w + '%',
			height: h + '%',
		};
	}
	get className() {
		let classes = ['square', 'color' + this.props.color];
		let matches = this.props.matches || {};

		Object.keys(matches).forEach(key => {
			if (matches[key]) {
				classes.push('matches-' + key);
			}
		})
		return classes.join(' ');
	}
	click(event) {
		this.props.game.match(this.props.x, this.props.y);
	}
	get key() { return this.props.id; }
	render() {
		return <div onClick={event => this.click(event)} className={this.className} style={this.stylePosition}/>;
	}
}

class Board extends Component {

	get squares() {
		return this.props.game.squares || [];
	}

	get score() {
		return this.props.game.score || 0;
	}

	render() {
		return <div className='board'>{this.squares.map(square => <Square key={square.id} color={square.color} x={square.x} y={square.y} game={this.props.game} matches={square.matches} />)}<div className='score'>Score: {this.score} {this.props.game.gameOver ? 'GAME OVER' : ''}</div></div>;
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
		this.squares = [];
		this.score = 0;
		this.gameOver = false;
		for( let x = 0; x < width; x++) {
			let row = [];
			this.board.push(row);
			for( let y = 0; y < height; y++) {
				let square = {
					x, y,
					color: Math.floor(this.rng.randomBounded(1, this.colors + 1)),
					id: `${x}.${y}`,
				};
				row.push(square);
				this.squares.push(square);
			}
		}

		this.onChange();
	}

	match(x, y) {
		let square = this.squareAt(x, y);
		if (!square.matches.any) {
			return;
		}
		let found = {};
		let find = square => {
			if (found[square.id]) return;
			found[square.id] = square;
			if (square.matches.left) {
				find(this.squareAt(square.x - 1, square.y));
			}
			if (square.matches.right) {
				find(this.squareAt(square.x + 1, square.y));
			}
			if (square.matches.up) {
				find(this.squareAt(square.x, square.y + 1));
			}
			if (square.matches.down) {
				find(this.squareAt(square.x, square.y - 1));
			}
		};
		find(square);
		var score = Object.keys(found).length;
		score *= score;
		this.score += score;
		Object.keys(found).forEach(key => this.removeSquare(found[key]));
	}

	squareAt(x, y) {
		return ((this.board || [])[x] || [])[y] || { x, y, color: 0, id: 'empty' };
	}

	colorAt(x, y) {
		return this.squareAt(x, y).color;
	}

	calculateMatches() {
		let anyMatch = false;
		if (this.squares) {
			this.squares.forEach(square => {
				square.matches = {
					left: this.colorAt(square.x-1, square.y) === square.color,
					right: this.colorAt(square.x+1, square.y) === square.color,
					up: this.colorAt(square.x, square.y + 1) === square.color,
					down: this.colorAt(square.x, square.y - 1) === square.color,
				};
				square.matches.any = square.matches.left || square.matches.right || square.matches.up || square.matches.down;
				anyMatch = anyMatch || square.matches.any;
			});
		}
		this.gameOver = !anyMatch;
	}

	removeSquare(square) {
		let {x, y} = square;
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
		this.squares.splice(this.squares.indexOf(square), 1);
		this.onChange();
	}

	render() {
		if (this.changed) {
			this.calculateMatches();
			render(<Board game={this} />, this.$root[0]);
		}
		this.changed = false;
	}

	onChange() {
		this.changed = true;
	}
}