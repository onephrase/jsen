
/**
 * @imports
 */
import _flatten from '@onephrase/commons/arr/flatten.js';
import _first from '@onephrase/commons/arr/first.js';
import _last from '@onephrase/commons/arr/last.js';
import _difference from '@onephrase/commons/arr/difference.js';
import _isArray from '@onephrase/commons/js/isArray.js';
import _isObject from '@onephrase/commons/js/isObject.js';
import _isString from '@onephrase/commons/js/isString.js';
import _each from '@onephrase/commons/obj/each.js';
import ComparisonInterface from './ComparisonInterface.js';
import Lexer from '../Lexer.js';

/**
 * ---------------------------
 * Comparison class
 * ---------------------------
 */				

const Comparison = class extends ComparisonInterface {
	
	/**
	 * @inheritdoc
	 */
	constructor(operand1, operand2, operator) {
		super();
		this.operand1 = operand1;
		this.operand2 = operand2;
		this.operator = operator;
	}
	 
	/**
	 * @inheritdoc
	 */
	eval(context = null, callback = null) {
		return Comparison.compare(
			this.operand1.eval(context, callback), 
			this.operand2.eval(context, callback), 
			this.operator
		);
	}
	
	/**
	 * @inheritdoc
	 */
	toString(context = null) {
		return [
			this.operand1.toString(context), 
			this.operator, 
			this.operand2.toString(context)
		].join(' ');
	}
	
	/**
	 * @inheritdoc
	 */
	static parse(expr, parseCallback, Static = Comparison) {
		var operators = _flatten(Static.operators).map(oper => ' ' + oper + ' ');
		var parse = Lexer.lex(expr, operators);
		if (parse.tokens.length > 1) {
			if (parse.tokens.length > 2) {
				throw new Error('Malformed "Comparison" expression: ' + expr + '!');
			}
			return new Static(
				parseCallback(_first(parse.tokens).trim()),
				parseCallback(_last(parse.tokens).trim()),
				parse.matches[0].trim()
			);
		}
	}
	
	/**
	 * -------------------------------------------------------
	 */
	 
	/**
	 * Use the operator type to compare the two operands
	 *
	 * @param mixed		operand1		
	 * @param mixed		operand2		
	 * @param string 	operator		
	 *
	 * @return bool
	 */
	static compare(operand1, operand2, operator = '==') {
		if (_flatten(Comparison.operators).indexOf(operator) === -1) {
			throw new Error('The operator "' + operator + '" is not recognized.');
		}
		if (_isArray(operand1) && _isArray(operand2) && operator !== '===') {
			if (operand1.length !== operand2.length) {
				return false;
			}
			var allItemsMatch = true;
			operand1.sort();
			operand2.sort();
			for (var i = 0; i < operand1.length; i ++) {
				allItemsMatch = allItemsMatch && Comparison.compare(operand1[i], operand2[i], operator);
			}
			return allItemsMatch;
		} else if (_isObject(operand1) && _isObject(operand2) && operator !== '===') {
			var entry1Keys = Object.keys(operand1);
			var entry2Keys = Object.keys(operand2);
			if (entry1Keys.length !== entry2Keys.length || _difference(entry1Keys, entry2Keys).length) {
				return false;
			}
			var allEntriesMatch = true;
			_each(entry1Keys, (i, key) => {
				allEntriesMatch = allEntriesMatch && Comparison.compare(operand1[key], operand2[key], operator);
			});
			return allEntriesMatch;
		}
		switch(operator) {
			case '===':
				return operand1 === operand2;
			case '==':
			case '=':
				return operand1 == operand2;
			case '>':
				return operand1 > operand2;
			case '<':
				return operand1 < operand2;
			case '>=':
				return operand1 >= operand2;
			case '<=':
				return operand1 <= operand2;
			case '!=':
				return operand1 != operand2;
			case '!==':
				return operand1 !== operand2;
			case '^=':
				return _isString(operand1) && operand1.startsWith(operand2);
			case '$=':
				return _isString(operand1) && operand1.endsWith(operand2);
			case '*=':
				// Contains
				return _isArray(operand2) || _isString(operand2) ? operand1.indexOf(operand2) > -1 : false;
			case '~=':
				// Contains word
				return _isString(operand1) && _isString(operand2) && (' ' + operand1 + ' ').indexOf(' ' + operand2 + ' ') > -1;
			case '>=<': // Between
				 if (!(_isArray(operand2) && operand2.length === 2)) {
					 throw new Error('A \'Between\' comparison requires argument 2 to be an array of exactly 2 values.');
				 }
				 return operand1 >= operand2[0] && operand1 <= operand2[1];
	
			case '/**/': // Regex
				return operand2.match(new RegExp(operand1));
			default:
				return false;
		}
	}
	 
	/**
	 * Compares two operands for differences
	 *
	 * @param mixed		operand1		
	 * @param mixed		operand2		
	 * @param bool	 	strict		
	 *
	 * @return bool
	 */
	static diff(operand1, operand2, strict) {
		return !Comparison.compare(operand1, operand2, strict ? '===' : '==');
	}
};

/**
 * @prop object
 */
Comparison.operators = {
	exact: {
		is: '===',
		isNull: '===',
		equalsTo: '==',
		notEqualsTo: '!=',
	},
	relative: {
		lesserThan: '<',
		greaterThan: '>',
		lesserThanOrEqualsTo: '<=',
		greaterThanOrEqualsTo: '>=',
		between: '>=<',
	},
	partial: {
		startsWith: '^=',
		endsWith: '$=',
		contains: '*=',
		any: '~=',
		in: '~=',
		matches: '/**/',
	},
};

/**
 * @exports
 */
export default Comparison;
