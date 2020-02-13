
/**
 * @imports
 */
import _get from '@onephrase/commons/obj/get.js';
import _isUndefined from '@onephrase/commons/js/isUndefined.js';
import _isFunction from '@onephrase/commons/js/isFunction.js';

/**
 * @exports
 */
class Contexts extends Array {
	
	/**
	 * Returns the first found "undefined" value of a reference from 
	 * from contexts.
	 *
	 * @param string|number varName
	 * @param bool			bindThis
	 *
	 * @return mixed
	 */
	get(varName, bindThis = true) {
		for(var i = 0; i < this.length; i ++) {
			var val = _get(this[i], varName);
			if (_isFunction(val) && bindThis) {
				return val.bind(this[i]);
			}
			if (!_isUndefined(val)) {
				return val;
			}
		}
	}
	
	/**
	 * Factory method for making a Contexts instance.
	 *
	 * @param array|object 	cntxt
	 *
	 * @return Contexts
	 */
	static create(cntxt) {
		return cntxt instanceof Contexts ? cntxt 
			: (cntxt ? new Contexts(cntxt) : new Contexts());
	}
};

/**
 * @exports
 */
export default Contexts;