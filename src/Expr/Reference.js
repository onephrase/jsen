
/**
 * @imports
 */
import {
	_wrapped,
	_unwrap
} from '@onephrase/commons/src/Str.js';
import {
	_isUndefined,
	_isFunction
} from '@onephrase/commons/src/Js.js';
import {
	_from as _arr_from
} from '@onephrase/commons/src/Arr.js';
import ReferenceInterface from './ReferenceInterface.js';
import ExprInterface from '../ExprInterface.js';
import Contexts from '../Contexts.js';
import Lexer from '../Lexer.js';

/**
 * ---------------------------
 * Reference class
 * ---------------------------
 */				

const Reference = class extends ReferenceInterface {

	/**
	 * @inheritdoc
	 */
	constructor(context, name, backticks = false) {
		super();
		this.context = context;
		this.name = name;
		this.backticks = backticks;
	}
	 
	/**
	 * @inheritdoc
	 */
	getEval(context = null, callback = null) {
		var sourceContext = context, name = this.name;
		if (this.context) {
			if (name instanceof ExprInterface) {
				name = name.eval(context, callback);
			}
			sourceContext = this.context.eval(context, callback);
		}
		return {context:sourceContext, name:name,};
	}
	 
	/**
	 * @inheritdoc
	 */
	eval(context = null, callback = null) {
		var parts = this.getEval(context, callback);
		if (!_isUndefined(parts.context) && !_isUndefined(parts.name)) {
			if (_isFunction(callback)) {
				return callback(this, parts.context, parts.name);
			}
			var _contexts = parts.context instanceof Contexts 
				? parts.context.slice() 
				: (parts.context ? [parts.context] : []);
			while(_contexts.length) {
				var cntxt = _contexts.pop(), val = cntxt[parts.name];
				if (!_isUndefined(val)) {
					return val;
				}
			}
		}
	}
	 
	/**
	 * @inheritdoc
	 */
	toString(context = null) {
		var name = this.name;
		if (this.context) {
			var subjectContext = this.context.toString(context);
			if (name instanceof ExprInterface) {
				name = '[' + name.toString(context) + ']';
			} else if (this.backticks) {
				name = '`' + name + '`';
			}
		} else {
			var subjectContext = context;
			if (this.backticks) {
				name = '`' + name + '`';
			}
		}
		return (subjectContext || '') + (subjectContext && !name.startsWith('[') ? Reference.separator : '') + name;
	}
	
	/**
	 * @inheritdoc
	 */
	static parse(expr, parseCallback, Static = Reference) {
		if (!Lexer.match(expr.trim(), [' ']).length) {
			var splits = Lexer.split(expr, []);
			// ------------------------
			// name, first
			// ------------------------
			var context, name = splits.pop(), backticks;
			var nameSplit = Lexer.split(name.trim(), [Static.separator], {preserveDelims:true});
			if (nameSplit.length > 1) {
				name = nameSplit.pop().substr(1);
				splits = splits.concat(nameSplit);
			}
			if (_wrapped(name, '`', '`')) {
				name = _unwrap(name, '`', '`');
				backticks = true;
			}
			// ------------------------
			// context, second
			// ------------------------
			if (splits.length) {
				context = parseCallback(splits.join(''));
				context.isContext = true;
			}
			if (_wrapped(name, '[', ']')) {
				if (!context) {
					throw new Error('Invalid reference: ' + expr + '!');
				}
				name = parseCallback(_unwrap(name, '[', ']'));
			}
			return new Static(context, name, backticks);
		}
	}
};

/**
 * @prop string
 */
Reference.separator = '.';

/**
 * @exports
 */
export default Reference;
