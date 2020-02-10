
/**
 * @imports
 */
import {
	_copy,
	_each
} from '@onephrase/commons/src/Obj.js';
import {
	_flatten
} from '@onephrase/commons/src/Arr.js';
import {
	_wrapped,
	_unwrap
} from '@onephrase/commons/src/Str.js';
import FuncInterface from './FuncInterface.js';
import Contexts from '../Contexts.js';
import Lexer from '../Lexer.js';

/**
 * ---------------------------
 * Func class
 * ---------------------------
 */				

const Func = class extends FuncInterface {
	 
	/**
	 * @inheritdoc
	 */
	constructor(paramters, statements, wrappings = {}) {
		super();
		this.paramters = paramters || {};
		this.statements = statements;
		this.wrappings = wrappings;
	}
	
	/**
	 * @inheritdoc
	 */
	inherit(Super) {
		if (Super instanceof FuncInterface) {
			var parentParams = Object.keys(Super.paramters);
			var ownParams = Object.keys(this.paramters);
			for (var i = 0; i < Math.max(ownParams.length, parentParams.length); i ++) {
				var nameInParent = parentParams[i];
				var nameInSelf = ownParams[i];
				if (!nameInSelf && nameInParent) {
					throw new Error('Parameter #' + i + ' (' + nameInParent + ') in parent function must be implemented.');
				}
				if (nameInSelf && nameInParent) {
					var defaultValInParent = Super.paramters[nameInParent];
					var defaultValInSelf = this.paramters[nameInSelf];
					if (defaultValInSelf && !defaultValInParent) {
						throw new Error('Parameter #' + i + ' (' + nameInSelf + ') must not have a default value as established in parent function.');
					}
					if (defaultValInSelf && defaultValInParent && defaultValInSelf.jsenType !== defaultValInParent.jsenType) {
						throw new Error('Default value for parameter #' + i + ' (' + nameInSelf + ') must be of type ' + defaultValInParent.jsenType + ' as established in parent function.');
					}
				}
			}
			this.sup = Super;
		}
		return this;
	}
	 
	/**
	 * @inheritdoc
	 */
	eval(context = null, callback = null) {
		return (...args) => {
			var localContext = {};
			_each(Object.keys(this.paramters), (i, name) => {
				var defaultVal = this.paramters[name];
				if (args.length - 1 < i && !defaultVal) {
					throw new Error('The parameter "' + name + '" is required.');
				}
				localContext[name] = args.length > i 
					? args[i] 
					: (this.paramters[name] 
						? this.paramters[name].eval(context, callback) 
						: null);
			});
			var multipleContexts = new Contexts(localContext);
			// But this newer context should come last
			if (context instanceof Contexts) {
				multipleContexts = context.concat(multipleContexts);
			} else if (context) {
				multipleContexts.unshift(context);
			}
			return this.statements.eval(multipleContexts, callback);
		};
	}
	
	/**
	 * @inheritdoc
	 */
	toString(context = null) {
		var paramters = [];
		_each(this.paramters, (name, value) => {
			paramters.push(name + (value ? '=' + value.toString(context) : ''));
		});
		var headNoWrap = this.wrappings.head === false || (paramters.length === 1 && paramters[0].indexOf('=') === -1);
		var bodyNoWrap = this.wrappings.body === false
		return (headNoWrap ? paramters[0] : '(' + paramters.join(', ') + ')')
		+ ' => ' + (bodyNoWrap ? this.statements.toString(context) : '{' + this.statements.toString(context) + '}');
	}
	
	/**
	 * @inheritdoc
	 */
	static parse(expr, parseCallback, Static = Func) {
		var splits = Lexer.split(expr, _flatten(Static.operators));
		if (splits.length === 2) {
			var funcHead = splits.shift().trim();
			var funcBody = splits.shift().trim();
			var wrappings = {};
			if (_wrapped(funcHead, '(', ')')) {
				funcHead = _unwrap(funcHead, '(', ')');
			} else {
				wrappings.head = false;
			}
			if (_wrapped(funcBody, '{', '}')) {
				funcBody = _unwrap(funcBody, '{', '}');
			} else {
				wrappings.body = false;
			}
			var paramters = {};
			Lexer.split(funcHead, [',']).forEach(param => {
				var paramSplit = param.split('=');
				if (paramSplit[1]) {
					paramters[paramSplit[0].trim()] = parseCallback(paramSplit[1].trim());
				} else {
					paramters[param.trim()] = null;
				}
			});
			var statements = parseCallback(funcBody);
			return new Static(paramters, statements, wrappings);
		}
	}
};

/**
 * @prop object
 */
Func.operators = ['=>',];

/**
 * @exports
 */
export default Func;