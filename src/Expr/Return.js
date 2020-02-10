
/**
 * @imports
 */
import Lexer from '../Lexer.js';
import ReturnInterface from './ReturnInterface.js';

/**
 * ---------------------------
 * Ret (return) class
 * ---------------------------
 */				

const Return = class extends ReturnInterface {
	
	/**
	 * @inheritdoc
	 */
	constructor(expr) {
		super();
		this.expr = expr;
	}
	 
	/**
	 * @inheritdoc
	 */
	eval(context = null, callback = null) {
		return this.expr ? this.expr.eval(context, callback) : undefined;
	}
	
	/**
	 * @inheritdoc
	 */
	toString(context = null) {
		return this.expr ? 'return ' + this.expr.toString(context) : 'return';
	}
	
	/**
	 * -------------------------------------------------------
	 */
	 
	/**
	 * @inheritdoc
	 */
	static parse(expr, parseCallback, Static = Return) {
		var exprLc = expr.toLowerCase();
		if (exprLc.startsWith('return ') || exprLc === 'return') {
			return new Static(
				parseCallback(expr.substr(6).trim())
			);
		}
	}
};

/**
 * @exports
 */
export default Return;
