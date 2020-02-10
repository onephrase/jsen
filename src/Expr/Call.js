
/**
 * @imports
 */
import {
	_isArray,
	_isFunction,
	_isNumeric,
	_isObject,
	_isString,
	_isUndefined
} from '@onephrase/commons/src/Js.js';
import ReferenceInterface from './ReferenceInterface.js';
import CallInterface from './CallInterface.js';
import Arguments from './Arguments.js';
import Contexts from '../Contexts.js';
import Lexer from '../Lexer.js';

/**
 * ---------------------------
 * Call class
 * ---------------------------
 */				

const Call = class extends CallInterface {

	/**
	 * @inheritdoc
	 */
	constructor(reference, args) {
		super();
		this.reference = reference;
		this.args = args;
	}
	 
	/**
	 * @inheritdoc
	 */
	eval(context = null, callback = null) {
		var reference = this.reference.getEval(context, callback);
		var args = this.args.eval(context, callback);
		if (!_isUndefined(reference.name)) {
			if (_isFunction(callback)) {
				return callback(this, reference.context, reference.name, args);
			}
			// -----------------------------
			var _contexts = reference.context instanceof Contexts 
				? reference.context.slice() 
				: [reference.context];
			var __contexts = _contexts.slice();
			while(_contexts.length) {
				var cntxt = _contexts.pop();
				if (cntxt && _isFunction(cntxt[reference.name])) {
					return cntxt[reference.name](...args);
				}
				// -----------------------------
				var utils = Call.utils || {};
				var handler = _isNumeric(cntxt) && utils.Num ? utils.Num
					: (_isString(cntxt) && utils.Str ? utils.Str
						: (_isArray(cntxt) && utils.Arr ? utils.Arr
							: (_isObject(cntxt) && utils.Obj ? utils.Obj : null)));
				if (handler && _isFunction(handler[reference.name])) {
					args.unshift(cntxt);
					return handler[reference.name](...args);
				}
			}
			throw new Error('"' + this + '" is not a function. (Called on ' + __contexts.map(c => typeof c).join(', ') + ')');
		}
	}
	 
	/**
	 * @inheritdoc
	 */
	toString(context = null) {
		return this.reference.toString(context) + this.args.toString(context);
	}
	
	/**
	 * @inheritdoc
	 */
	static parse(expr, parseCallback, Static = Call) {
		if (!expr.startsWith('(') && expr.endsWith(')') && !Lexer.match(expr, [' ']).length) {
			var tokens = Lexer.split(expr, []);
			var reference, args = tokens.pop();
			if (!((reference = parseCallback(tokens.join(''))) instanceof ReferenceInterface) 
			|| !(args = parseCallback(args, [Arguments]))) {
				throw new Error('Invalid call directive: ' + expr);
			}
			return new Static(reference, args);
		}
	}
};	

/**
 * @exports
 */
export default Call;
