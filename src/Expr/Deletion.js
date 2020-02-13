
/**
 * @imports
 */
import _last from '@onephrase/commons/arr/last.js';
import _isFunction from '@onephrase/commons/js/isFunction.js';
import _isUndefined from '@onephrase/commons/js/isUndefined.js';
import ReferenceInterface from './ReferenceInterface.js';
import DeletionInterface from './DeletionInterface.js';
import Contexts from '../Contexts.js';
import Lexer from '../Lexer.js';

/**
 * ---------------------------
 * Deletion class
 * ---------------------------
 */				

const Deletion = class extends DeletionInterface {

	/**
	 * @inheritdoc
	 */
	constructor(reference, operator = 'delete') {
		super();
		this.reference = reference;
		this.operator = operator;
	}
	 
	/**
	 * @inheritdoc
	 */
	eval(context = null, callback = null) {
		var reference = this.reference.getEval(context, callback);
		if (!_isUndefined(reference.context) && !_isUndefined(reference.name)) {
			if (_isFunction(callback)) {
				return callback(this, reference.context, reference.name);
			}
			// -----------------------------
			var cntxt = reference.context instanceof Contexts 
				? _last(reference.context) 
				: reference.context;
			// -----------------------------
			delete cntxt[reference.name];
			return true;
		}
		return false;
	}
	 
	/**
	 * @inheritdoc
	 */
	toString(context = null) {
		return this.operator + ' ' + this.reference.toString(context);
	}
	
	/**
	 * @inheritdoc
	 */
	static parse(expr, parseCallback, Static = Deletion) {
		var parse = Lexer.lex(expr, Object.values(Static.operators));
		if (parse.matches.length === 1 && expr.startsWith(parse.matches[0] + ' ')) {
			var reference;
			if (!((reference = parseCallback(parse.tokens.pop().trim())) instanceof ReferenceInterface)) {
				throw new Error('Invalid delete directive: ' + expr);
			}
			return new Static(reference, parse.matches[0].trim());
		}
	}
};	

/**
 * @prop array
 */
Deletion.operators = {
	red: 'reduce', 
	del: 'delete',
};

/**
 * @exports
 */
export default Deletion;
