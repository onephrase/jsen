
/**
 * @imports
 */
import {
	_wrapped,
	_unwrap
} from '@onephrase/commons/src/Str.js';
import StrInterface from './StrInterface.js';
import Lexer from '../Lexer.js';
import Bool from './Bool.js';

/**
 * ---------------------------
 * String utils
 * ---------------------------
 */

const Str = class extends StrInterface {
	
	/**
	 * @inheritdoc
	 */
	constructor(expr, quote) {
		super();
		this.expr = expr;
		this.quote = quote;
	}
	 
	/**
	 * @inheritdoc
	 */
	eval() {
		return this.expr;
	}
	
	/**
	 * @inheritdoc
	 */
	toString() {
		return this.quote + this.expr + this.quote;
	}
	 
	/**
	 * @inheritdoc
	 */
	static parse(expr, parseCallback, Static = Str) {
		expr = expr.trim();
		if ((_wrapped(expr, '"', '"') || _wrapped(expr, "'", "'")) 
		&& !Lexer.match(expr, [' ']).length) {
			var quote = _wrapped(expr, '"', '"') ? '"' : "'";
			return new Static(
				_unwrap(expr, quote, quote),
				quote
			);
		}
	}
};

/**
 * @exports
 */
export default Str;
