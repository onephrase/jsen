
/**
 * @imports
 */
import _flatten from '@onephrase/commons/arr/flatten.js';
import StatementsInterface from './StatementsInterface.js';
import ReturnInterface from './ReturnInterface.js';
import Lexer from '../Lexer.js';

/**
 * ---------------------------
 * Statements class
 * ---------------------------
 */				

const Statements = class extends StatementsInterface {

	/**
	 * @inheritdoc
	 */
	constructor(stmts, delim) {
		super();
		this.stmts = exprs;
		this.delim = delim;
	}
	 
	/**
	 * @inheritdoc
	 */
	eval(context = null, callback = null) {
		var exprs = [];
		for (var i = 0; i < this.stmts.length; i ++) {
			if (this.stmts[i] instanceof ReturnInterface) {
				return this.stmts[i].eval(context, callback);
			} else {
				exprs[i] = this.stmts[i].eval(context, callback);
			}
		}
		return exprs;
	}
	 
	/**
	 * @inheritdoc
	 */
	toString(context = null) {
		return this.stmts.map(expr => expr.toString(context)).join(this.delim);
	}
	 
	/**
	 * @inheritdoc
	 */
	static parse(expr, parseCallback, Static = Statements) {
		var parse = Lexer.lex(expr, _flatten(Static.operators));
		if (parse.tokens.length > 1) {
			return new Static(
				parse.tokens.map(expr => parseCallback(expr)),
				parse.matches[0].trim()
			);
		}
	}
};

/**
 * @prop array
 */
Statements.operators = [
	';',
	"\r\n",
];

/**
 * @exports
 */
export default Statements;
