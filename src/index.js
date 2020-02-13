
/**
 * @imports
 */
import Jsen from './Jsen.js';
import ExprInterface from './ExprInterface.js';
import Lexer from './Lexer.js';
import Contexts from './Contexts.js';
import Abstraction from './Expr/Abstraction.js';
import AbstractionInterface from './Expr/AbstractionInterface.js';
import Arr from './Expr/Arr.js';
import ArrInterface from './Expr/ArrInterface.js';
import Arguments from './Expr/Arguments.js';
import ArgumentsInterface from './Expr/ArgumentsInterface.js';
import Assertion from './Expr/Assertion.js';
import AssertionInterface from './Expr/AssertionInterface.js';
import Assignment from './Expr/Assignment.js';
import AssignmentInterface from './Expr/AssignmentInterface.js';
import Bool from './Expr/Bool.js';
import BoolInterface from './Expr/BoolInterface.js';
import Call from './Expr/Call.js';
import CallInterface from './Expr/CallInterface.js';
import Comments from './Expr/Comments.js';
import CommentsInterface from './Expr/CommentsInterface.js';
import Comparison from './Expr/Comparison.js';
import ComparisonInterface from './Expr/ComparisonInterface.js';
import Condition from './Expr/Condition.js';
import ConditionInterface from './Expr/ConditionInterface.js';
import Deletion from './Expr/Deletion.js';
import DeletionInterface from './Expr/DeletionInterface.js';
import Func from './Expr/Func.js';
import FuncInterface from './Expr/FuncInterface.js';
import Math from './Expr/Math.js';
import MathInterface from './Expr/MathInterface.js';
import Num from './Expr/Num.js';
import NumInterface from './Expr/NumInterface.js';
import Obj from './Expr/Obj.js';
import ObjInterface from './Expr/ObjInterface.js';
import Reference from './Expr/Reference.js';
import ReferenceInterface from './Expr/ReferenceInterface.js';
import Return from './Expr/Return.js';
import ReturnInterface from './Expr/ReturnInterface.js';
import Statements from './Expr/Statements.js';
import StatementsInterface from './Expr/StatementsInterface.js';
import Str from './Expr/Str.js';
import StrInterface from './Expr/StrInterface.js';

/**
 * @var object
 */
Jsen.grammars = {
	Comments: Comments,			// // single-line | /* double-line */
	Return: Return,				// return field1
	Statements: Statements,		// field1 = 3; field2 = val2
	Deletion: Deletion,			// delete field1
	Assignment: Assignment,		// field1[key1].key2 = k
	Func: Func,					// (field1, field2) => {}
	Abstraction: Abstraction,	// (field1)
	Condition: Condition,		// field1 > field2 ? val1 : val2
	Assertion: Assertion,		// !field1 && field2
	Comparison: Comparison,		// field1 > field2
	Math: Math,					// field1 + field2
	Arr: Arr,					// [field1, field2]
	Obj: Obj,					// {field1:val1, field2:val2}
	Num: Num,					// [0-9]
	Str: Str,					// ""
	Bool: Bool,					// true
	Call: Call,					// field1()
	Reference: Reference,				// field1
};

/**
 * @exports
 */
export {
	ExprInterface,
	Lexer,
	Contexts
};
export {
	Abstraction,
	Arr,
	Arguments,
	Assertion,
	Assignment,
	Bool,
	Call,
	Comments,
	Comparison,
	Condition,
	Deletion,
	Func,
	Math,
	Num,
	Obj,
	Reference,
	Return,
	Str,
	Statements
};
export {
	AbstractionInterface,
	ArrInterface,
	ArgumentsInterface,
	AssertionInterface,
	AssignmentInterface,
	BoolInterface,
	CallInterface,
	CommentsInterface,
	ComparisonInterface,
	ConditionInterface,
	DeletionInterface,
	FuncInterface,
	MathInterface,
	NumInterface,
	ObjInterface,
	ReferenceInterface,
	ReturnInterface,
	StrInterface,
	StatementsInterface
};
export default Jsen;
