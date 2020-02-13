
/**
 * @imports
 */
import _wrapped from '@onephrase/commons/str/wrapped.js';
import _unwrap from '@onephrase/commons/str/unwrap.js';
import _first from '@onephrase/commons/arr/first.js';
import _last from '@onephrase/commons/arr/last.js';
import _each from '@onephrase/commons/obj/each.js';
import ObjInterface from './ObjInterface.js';
import Lexer from '../Lexer.js';

/**
 * ---------------------------
 * Object utils
 * ---------------------------
 */				

const Obj = class extends ObjInterface {
	
	/**
	 * @inheritdoc
	 */
	constructor(entries) {
		super();
		this.entries = entries || {};
	}
	
	/**
	 * @inheritdoc
	 */
	inherit(Super) {
		if (Super instanceof ObjInterface) {
			_each(Super.entries, (name, val) => {
				if (!(name in this.entries)) {
					this.entries[name] = val;
				}
			});
		}
		return this;
	}
	 
	/**
	 * @inheritdoc
	 */
	eval(context = null, callback = null) {
		var items = {};
		_each(this.entries, (key, expr) => {
			items[key] = expr.eval(context, callback);
		});
		return items;
	}
	 
	/**
	 * @inheritdoc
	 */
	toString(context = null) {
		var str = [];
		_each(this.entries, (key, expr) => {
			str.push(key + Obj.operators.sub + expr.toString(context));
		});
		return '{' + str.join(Obj.operators.sup) + '}';
	}
	
	/**
	 * @inheritdoc
	 */
	static parse(expr, parseCallback, Static = Obj) {
		if (_wrapped(expr, '{', '}') && !Lexer.match(expr.trim(), [' ']).length) {
			var entries = {};
			var _entriesSplit = Lexer.split(_unwrap(expr, '{', '}'), [Obj.operators.sup])
				.map(n => n.trim()).filter(n => n);
			_each(_entriesSplit, (key, expr) => {
				var entry = Lexer.split(expr, [Obj.operators.sub], {limit:1}/*IMPORTANT*/);
				entries[_first(entry).trim()] = parseCallback(_last(entry).trim());
			});
			return new Static(entries);
		}
	}
};

/**
 * @prop object
 */
Obj.operators = {
	sup: ',',
	sub: ':',
};

/**
 * @exports
 */
export default Obj;
