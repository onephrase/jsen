
/**
 * @imports
 */
import _remove from '@onephrase/commons/arr/remove.js';
import _isArray from '@onephrase/commons/js/isArray.js';
import _instanceof from '@onephrase/commons/js/instanceof.js';
import AssignmentInterface from './Expr/AssignmentInterface.js';
import ReferenceInterface from './Expr/ReferenceInterface.js';
import DeletionInterface from './Expr/DeletionInterface.js';
import CallInterface from './Expr/CallInterface.js';

/**
 * ---------------------------
 * Jsen (base) class
 * ---------------------------
 */				

const Jsen = class {
	 
	/**
	 * @inheritdoc
	 */
	static parse(expr, Parsers, params = {}, Static = Jsen) {
		if (!params.meta) {
			params.meta = {vars: []};
		}
		if (expr.length) {
			var parsers = Object.values(Parsers || Static.grammars);
			for (var i = 0; i < parsers.length; i ++) {
				// From this point forward, all vars is within current scope
				var varsScope = params.meta && _isArray(params.meta.vars) ? params.meta.vars.length : 0;
				var parsed = parsers[i].parse(expr, (_expr, _Parsers) => Jsen.parse(_expr, _Parsers, params, Static));
				// Add/remove vars to scope
				if (parsed && params.meta) {
					if (!parsed.meta) {
						parsed.meta = {};
					}
					// Reap vars into scope expr
					parsed.meta.vars = params.meta.vars.slice(varsScope);
					// Add vars to scope
					if (_instanceof(parsed, ReferenceInterface) || _instanceof(parsed, CallInterface)) {
						_remove(parsed.meta.vars, parsed.context);
						_remove(params.meta.vars, parsed.context);
						params.meta.vars.push(parsed);
					}
				}
				if (parsed && params.explain) {
					console.log(expr, ' >>------------->> ', parsed.jsenType);
				}
				if ((parsed instanceof AssignmentInterface || parsed instanceof DeletionInterface) 
				&& (!params || !params.mutates)) {
					throw new Error('[Permission error:] ' + expr);
				}
				if (parsed) {
					return parsed;
				}
			}
			if (params.assert === false) {
				return;
			}
			throw new Error('[Syntax error:] ' + expr);
		}
	}
};

/**
 * @exports
 */
export default Jsen;
