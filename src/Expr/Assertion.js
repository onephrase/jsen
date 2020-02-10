
/**
 * @imports
 */
import {
	_first,
	_flatten,
	_unique
} from '@onephrase/commons/src/Arr.js';
import AssertionInterface from './AssertionInterface.js';
import Lexer from '../Lexer.js';

/**
 * ---------------------------
 * Assertion class
 * ---------------------------
 */				

const Assertion = class extends AssertionInterface {

	/**
	 * @inheritdoc
	 */
	constructor(exprs, logic) {
		super();
		this.exprs = exprs;
		this.logic = logic;
	}
	 
	/**
	 * @inheritdoc
	 */
	 eval(context = null, callback = null) {
		if (this.logic === '!') {
			return !_first(this.exprs).eval(context, callback);
		}
		var operators = _flatten(Assertion.operators);
		var logic = (this.logic || '').trim().toUpperCase();
		var isOr = logic === (Assertion.operators.or || '').trim().toUpperCase();
		var isNor = logic === (Assertion.operators.nor || '').trim().toUpperCase();
		var isAnd = logic === (Assertion.operators.and || '').trim().toUpperCase();
		var isNand = logic === (Assertion.operators.nand || '').trim().toUpperCase();
		var lastResult = true, trues = 0;
		for(var i = 0; i < this.exprs.length; i ++) {
			if (isAnd && !lastResult) {
				return false;
			}
			if (isNand && !lastResult) {
				return true;
			}
			lastResult = this.exprs[i].eval(context, callback);
			if (isOr && lastResult) {
				return lastResult;
			}
			trues += lastResult ? 1 : 0;
		}
		if (isOr) {
			// Which is falsey,
			// by virtue of getting here
			return lastResult;
		}
		if (isAnd || isNand) {
			// For AND and NAND, all entries must be true,
			// by virtue of getting here.
			// For AND, this means true; for NAND, false
			return isAnd;
		}
		// For NOR, all entries need to be false
		return isNor && trues === 0;
	}
	
	/**
	 * @inheritdoc
	 */
	 toString(context = null) {
		if (this.logic === '!') {
			return '!' + _first(this.exprs).toString(context);
		}
		return this.exprs.map(expr => expr.toString(context)).join(' ' + this.logic + ' ');
	}
	
	/**
	 * @inheritdoc
	 */
	static parse(expr, parseCallback, Static = Assertion) {
		if (expr.startsWith('!')) {
			return new Static(
				[parseCallback(expr.substr(1))],
				'!'
			);
		}
		var parse = Lexer.lex(expr, _flatten(Static.operators));
		if (parse.tokens.length > 1) {
			var logic = _unique(parse.matches);
			if (logic.length > 1) {
				throw new Error('"AND" and "OR" logic cannot be asserted in the same expression: ' + expr + '!');
			}
			return new Static(
				parse.tokens.map(expr => parseCallback(expr.trim())),
				_first(logic)
			);
		}
	}
};

/**
 * @prop object
 */
Assertion.operators = {
	and: '&&',
	or: '||',
};

/**
 * @exports
 */
export default Assertion;
