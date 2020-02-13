
/**
 * @imports
 */
import _wrapped from '@onephrase/commons/str/wrapped.js';
import _unwrap from '@onephrase/commons/str/unwrap.js';
import ArgumentsInterface from './ArgumentsInterface.js';
import Lexer from '../Lexer.js';

/**
 * ---------------------------
 * Arguments class
 * ---------------------------
 */				

const Arguments = class extends ArgumentsInterface {
	 
	/**
	 * @inheritdoc
	 */
	constructor(list = []) {
		super();
		this.list = list;
	}
	 
	/**
	 * @inheritdoc
	 */
	eval(context = null, callback = null) {
		return this.list.map(arg => arg.eval(context, callback));
	}
	
	/**
	 * @inheritdoc
	 */
	toString(context = null) {
		return '(' + this.list.map(arg => arg.toString(context)).join(', ') + ')';
	}
	
	/**
	 * @inheritdoc
	 */
	static parse(expr, parseCallback, Static = Arguments) {
		var args; expr = expr.trim();
		if (_wrapped(expr, '(', ')') && !Lexer.match(expr, [' ']).length) {
			return new Static(
				Lexer.split(_unwrap(expr, '(', ')'), [',']).map(arg => parseCallback(arg.trim()))
			);
		}
	}
};

/**
 * @exports
 */
export default Arguments;
