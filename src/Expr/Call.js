
/**
 * @imports
 */
import _isArray from '@onephrase/commons/js/isArray.js';
import _isFunction from '@onephrase/commons/js/isFunction.js';
import _isUndefined from '@onephrase/commons/js/isUndefined.js';
import _isNumeric from '@onephrase/commons/js/isNumeric.js';
import _isObject from '@onephrase/commons/js/isObject.js';
import _isString from '@onephrase/commons/js/isString.js';
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
			var _contexts = Contexts.create(reference.context).slice();
			var func = _contexts.get(reference.name, true/*bindThis*/);
			if (_isFunction(func)) {
				return func(...args);
			}
			// -----------------------------
			var handler, _cntxts = _contexts.slice();
			while(_cntxts.length && !handler) {
				var cntxt = _cntxts.shift();
				var utils = Call.utils || {};
				var handler = _isNumeric(cntxt) && utils.Num ? utils.Num
					: (_isString(cntxt) && utils.Str ? utils.Str
						: (_isArray(cntxt) && utils.Arr ? utils.Arr
							: (_isObject(cntxt) && utils.Obj ? utils.Obj : null)));
				if (handler && _isFunction(handler[reference.name])) {
					args.unshift(cntxt);
					return handler[reference.name](...args);
				}
				throw new Error('"' + this + '" is not a function. (Called on ' + _contexts.map(c => typeof c).join(', ') + ')');
			}
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
