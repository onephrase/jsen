
/**
 * @imports
 */
import {
	_last
} from '@onephrase/commons/src/Arr.js';
import {
	_isUndefined,
	_isFunction
} from '@onephrase/commons/src/Js.js';
import AssignmentInterface from './AssignmentInterface.js';
import ReferenceInterface from './ReferenceInterface.js';
import Contexts from '../Contexts.js';
import Lexer from '../Lexer.js';

/**
 * ---------------------------
 * Assignment class
 * ---------------------------
 */				

const Assignment = class extends AssignmentInterface {

	/**
	 * @inheritdoc
	 */
	constructor(reference, val, operator = '=') {
		super();
		this.reference = reference;
		this.val = val;
		this.operator = operator;
	}
	 
	/**
	 * @inheritdoc
	 */
	eval(context = null, callback = null) {
		var reference = this.reference.getEval(context, callback);
		var val = this.val.eval(context, callback);
		if (!_isUndefined(reference.context) && !_isUndefined(reference.name)) {
			if (_isFunction(callback)) {
				return callback(this, reference.context, reference.name, val);
			}
			// -----------------------------
			var cntxt = reference.context instanceof Contexts 
				? _last(reference.context) 
				: reference.context;
			// -----------------------------
			cntxt[reference.name] = val;
			return true;
		}
		return false;
	}
	 
	/**
	 * @inheritdoc
	 */
	toString(context = null) {
		return [this.reference.toString(context), this.operator, this.val.toString(context)].join(' ');
	}
	
	/**
	 * @inheritdoc
	 */
	static parse(expr, parseCallback, Static = Assignment) {
		var parse = Lexer.lex(expr, Static.operators);
		if (parse.tokens.length === 2) {
			var reference, val;
			if (!((reference = parseCallback(parse.tokens.shift().trim())) instanceof ReferenceInterface) 
			|| !(val = parseCallback(parse.tokens.shift().trim()))) {
				throw new Error('Invalid assignment directive: ' + expr);
			}
			return new Static(reference, val, parse.matches[0].trim());
		}
	}
};	

/**
 * @prop array
 */
Assignment.operators = [' = '];

/**
 * @exports
 */
export default Assignment;
