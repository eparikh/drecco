(function(scope){
'use strict';

function F(arity, fun, wrapper) {
  wrapper.a = arity;
  wrapper.f = fun;
  return wrapper;
}

function F2(fun) {
  return F(2, fun, function(a) { return function(b) { return fun(a,b); }; })
}
function F3(fun) {
  return F(3, fun, function(a) {
    return function(b) { return function(c) { return fun(a, b, c); }; };
  });
}
function F4(fun) {
  return F(4, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return fun(a, b, c, d); }; }; };
  });
}
function F5(fun) {
  return F(5, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return fun(a, b, c, d, e); }; }; }; };
  });
}
function F6(fun) {
  return F(6, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return fun(a, b, c, d, e, f); }; }; }; }; };
  });
}
function F7(fun) {
  return F(7, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return fun(a, b, c, d, e, f, g); }; }; }; }; }; };
  });
}
function F8(fun) {
  return F(8, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) {
    return fun(a, b, c, d, e, f, g, h); }; }; }; }; }; }; };
  });
}
function F9(fun) {
  return F(9, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) { return function(i) {
    return fun(a, b, c, d, e, f, g, h, i); }; }; }; }; }; }; }; };
  });
}

function A2(fun, a, b) {
  return fun.a === 2 ? fun.f(a, b) : fun(a)(b);
}
function A3(fun, a, b, c) {
  return fun.a === 3 ? fun.f(a, b, c) : fun(a)(b)(c);
}
function A4(fun, a, b, c, d) {
  return fun.a === 4 ? fun.f(a, b, c, d) : fun(a)(b)(c)(d);
}
function A5(fun, a, b, c, d, e) {
  return fun.a === 5 ? fun.f(a, b, c, d, e) : fun(a)(b)(c)(d)(e);
}
function A6(fun, a, b, c, d, e, f) {
  return fun.a === 6 ? fun.f(a, b, c, d, e, f) : fun(a)(b)(c)(d)(e)(f);
}
function A7(fun, a, b, c, d, e, f, g) {
  return fun.a === 7 ? fun.f(a, b, c, d, e, f, g) : fun(a)(b)(c)(d)(e)(f)(g);
}
function A8(fun, a, b, c, d, e, f, g, h) {
  return fun.a === 8 ? fun.f(a, b, c, d, e, f, g, h) : fun(a)(b)(c)(d)(e)(f)(g)(h);
}
function A9(fun, a, b, c, d, e, f, g, h, i) {
  return fun.a === 9 ? fun.f(a, b, c, d, e, f, g, h, i) : fun(a)(b)(c)(d)(e)(f)(g)(h)(i);
}




// EQUALITY

function _Utils_eq(x, y)
{
	for (
		var pair, stack = [], isEqual = _Utils_eqHelp(x, y, 0, stack);
		isEqual && (pair = stack.pop());
		isEqual = _Utils_eqHelp(pair.a, pair.b, 0, stack)
		)
	{}

	return isEqual;
}

function _Utils_eqHelp(x, y, depth, stack)
{
	if (x === y)
	{
		return true;
	}

	if (typeof x !== 'object' || x === null || y === null)
	{
		typeof x === 'function' && _Debug_crash(5);
		return false;
	}

	if (depth > 100)
	{
		stack.push(_Utils_Tuple2(x,y));
		return true;
	}

	/**_UNUSED/
	if (x.$ === 'Set_elm_builtin')
	{
		x = $elm$core$Set$toList(x);
		y = $elm$core$Set$toList(y);
	}
	if (x.$ === 'RBNode_elm_builtin' || x.$ === 'RBEmpty_elm_builtin')
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	/**/
	if (x.$ < 0)
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	for (var key in x)
	{
		if (!_Utils_eqHelp(x[key], y[key], depth + 1, stack))
		{
			return false;
		}
	}
	return true;
}

var _Utils_equal = F2(_Utils_eq);
var _Utils_notEqual = F2(function(a, b) { return !_Utils_eq(a,b); });



// COMPARISONS

// Code in Generate/JavaScript.hs, Basics.js, and List.js depends on
// the particular integer values assigned to LT, EQ, and GT.

function _Utils_cmp(x, y, ord)
{
	if (typeof x !== 'object')
	{
		return x === y ? /*EQ*/ 0 : x < y ? /*LT*/ -1 : /*GT*/ 1;
	}

	/**_UNUSED/
	if (x instanceof String)
	{
		var a = x.valueOf();
		var b = y.valueOf();
		return a === b ? 0 : a < b ? -1 : 1;
	}
	//*/

	/**/
	if (typeof x.$ === 'undefined')
	//*/
	/**_UNUSED/
	if (x.$[0] === '#')
	//*/
	{
		return (ord = _Utils_cmp(x.a, y.a))
			? ord
			: (ord = _Utils_cmp(x.b, y.b))
				? ord
				: _Utils_cmp(x.c, y.c);
	}

	// traverse conses until end of a list or a mismatch
	for (; x.b && y.b && !(ord = _Utils_cmp(x.a, y.a)); x = x.b, y = y.b) {} // WHILE_CONSES
	return ord || (x.b ? /*GT*/ 1 : y.b ? /*LT*/ -1 : /*EQ*/ 0);
}

var _Utils_lt = F2(function(a, b) { return _Utils_cmp(a, b) < 0; });
var _Utils_le = F2(function(a, b) { return _Utils_cmp(a, b) < 1; });
var _Utils_gt = F2(function(a, b) { return _Utils_cmp(a, b) > 0; });
var _Utils_ge = F2(function(a, b) { return _Utils_cmp(a, b) >= 0; });

var _Utils_compare = F2(function(x, y)
{
	var n = _Utils_cmp(x, y);
	return n < 0 ? $elm$core$Basics$LT : n ? $elm$core$Basics$GT : $elm$core$Basics$EQ;
});


// COMMON VALUES

var _Utils_Tuple0 = 0;
var _Utils_Tuple0_UNUSED = { $: '#0' };

function _Utils_Tuple2(a, b) { return { a: a, b: b }; }
function _Utils_Tuple2_UNUSED(a, b) { return { $: '#2', a: a, b: b }; }

function _Utils_Tuple3(a, b, c) { return { a: a, b: b, c: c }; }
function _Utils_Tuple3_UNUSED(a, b, c) { return { $: '#3', a: a, b: b, c: c }; }

function _Utils_chr(c) { return c; }
function _Utils_chr_UNUSED(c) { return new String(c); }


// RECORDS

function _Utils_update(oldRecord, updatedFields)
{
	var newRecord = {};

	for (var key in oldRecord)
	{
		newRecord[key] = oldRecord[key];
	}

	for (var key in updatedFields)
	{
		newRecord[key] = updatedFields[key];
	}

	return newRecord;
}


// APPEND

var _Utils_append = F2(_Utils_ap);

function _Utils_ap(xs, ys)
{
	// append Strings
	if (typeof xs === 'string')
	{
		return xs + ys;
	}

	// append Lists
	if (!xs.b)
	{
		return ys;
	}
	var root = _List_Cons(xs.a, ys);
	xs = xs.b
	for (var curr = root; xs.b; xs = xs.b) // WHILE_CONS
	{
		curr = curr.b = _List_Cons(xs.a, ys);
	}
	return root;
}



var _List_Nil = { $: 0 };
var _List_Nil_UNUSED = { $: '[]' };

function _List_Cons(hd, tl) { return { $: 1, a: hd, b: tl }; }
function _List_Cons_UNUSED(hd, tl) { return { $: '::', a: hd, b: tl }; }


var _List_cons = F2(_List_Cons);

function _List_fromArray(arr)
{
	var out = _List_Nil;
	for (var i = arr.length; i--; )
	{
		out = _List_Cons(arr[i], out);
	}
	return out;
}

function _List_toArray(xs)
{
	for (var out = []; xs.b; xs = xs.b) // WHILE_CONS
	{
		out.push(xs.a);
	}
	return out;
}

var _List_map2 = F3(function(f, xs, ys)
{
	for (var arr = []; xs.b && ys.b; xs = xs.b, ys = ys.b) // WHILE_CONSES
	{
		arr.push(A2(f, xs.a, ys.a));
	}
	return _List_fromArray(arr);
});

var _List_map3 = F4(function(f, xs, ys, zs)
{
	for (var arr = []; xs.b && ys.b && zs.b; xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A3(f, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map4 = F5(function(f, ws, xs, ys, zs)
{
	for (var arr = []; ws.b && xs.b && ys.b && zs.b; ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A4(f, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map5 = F6(function(f, vs, ws, xs, ys, zs)
{
	for (var arr = []; vs.b && ws.b && xs.b && ys.b && zs.b; vs = vs.b, ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A5(f, vs.a, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_sortBy = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		return _Utils_cmp(f(a), f(b));
	}));
});

var _List_sortWith = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		var ord = A2(f, a, b);
		return ord === $elm$core$Basics$EQ ? 0 : ord === $elm$core$Basics$LT ? -1 : 1;
	}));
});



var _JsArray_empty = [];

function _JsArray_singleton(value)
{
    return [value];
}

function _JsArray_length(array)
{
    return array.length;
}

var _JsArray_initialize = F3(function(size, offset, func)
{
    var result = new Array(size);

    for (var i = 0; i < size; i++)
    {
        result[i] = func(offset + i);
    }

    return result;
});

var _JsArray_initializeFromList = F2(function (max, ls)
{
    var result = new Array(max);

    for (var i = 0; i < max && ls.b; i++)
    {
        result[i] = ls.a;
        ls = ls.b;
    }

    result.length = i;
    return _Utils_Tuple2(result, ls);
});

var _JsArray_unsafeGet = F2(function(index, array)
{
    return array[index];
});

var _JsArray_unsafeSet = F3(function(index, value, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[index] = value;
    return result;
});

var _JsArray_push = F2(function(value, array)
{
    var length = array.length;
    var result = new Array(length + 1);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[length] = value;
    return result;
});

var _JsArray_foldl = F3(function(func, acc, array)
{
    var length = array.length;

    for (var i = 0; i < length; i++)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_foldr = F3(function(func, acc, array)
{
    for (var i = array.length - 1; i >= 0; i--)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_map = F2(function(func, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = func(array[i]);
    }

    return result;
});

var _JsArray_indexedMap = F3(function(func, offset, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = A2(func, offset + i, array[i]);
    }

    return result;
});

var _JsArray_slice = F3(function(from, to, array)
{
    return array.slice(from, to);
});

var _JsArray_appendN = F3(function(n, dest, source)
{
    var destLen = dest.length;
    var itemsToCopy = n - destLen;

    if (itemsToCopy > source.length)
    {
        itemsToCopy = source.length;
    }

    var size = destLen + itemsToCopy;
    var result = new Array(size);

    for (var i = 0; i < destLen; i++)
    {
        result[i] = dest[i];
    }

    for (var i = 0; i < itemsToCopy; i++)
    {
        result[i + destLen] = source[i];
    }

    return result;
});



// LOG

var _Debug_log = F2(function(tag, value)
{
	return value;
});

var _Debug_log_UNUSED = F2(function(tag, value)
{
	console.log(tag + ': ' + _Debug_toString(value));
	return value;
});


// TODOS

function _Debug_todo(moduleName, region)
{
	return function(message) {
		_Debug_crash(8, moduleName, region, message);
	};
}

function _Debug_todoCase(moduleName, region, value)
{
	return function(message) {
		_Debug_crash(9, moduleName, region, value, message);
	};
}


// TO STRING

function _Debug_toString(value)
{
	return '<internals>';
}

function _Debug_toString_UNUSED(value)
{
	return _Debug_toAnsiString(false, value);
}

function _Debug_toAnsiString(ansi, value)
{
	if (typeof value === 'function')
	{
		return _Debug_internalColor(ansi, '<function>');
	}

	if (typeof value === 'boolean')
	{
		return _Debug_ctorColor(ansi, value ? 'True' : 'False');
	}

	if (typeof value === 'number')
	{
		return _Debug_numberColor(ansi, value + '');
	}

	if (value instanceof String)
	{
		return _Debug_charColor(ansi, "'" + _Debug_addSlashes(value, true) + "'");
	}

	if (typeof value === 'string')
	{
		return _Debug_stringColor(ansi, '"' + _Debug_addSlashes(value, false) + '"');
	}

	if (typeof value === 'object' && '$' in value)
	{
		var tag = value.$;

		if (typeof tag === 'number')
		{
			return _Debug_internalColor(ansi, '<internals>');
		}

		if (tag[0] === '#')
		{
			var output = [];
			for (var k in value)
			{
				if (k === '$') continue;
				output.push(_Debug_toAnsiString(ansi, value[k]));
			}
			return '(' + output.join(',') + ')';
		}

		if (tag === 'Set_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Set')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Set$toList(value));
		}

		if (tag === 'RBNode_elm_builtin' || tag === 'RBEmpty_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Dict')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Dict$toList(value));
		}

		if (tag === 'Array_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Array')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Array$toList(value));
		}

		if (tag === '::' || tag === '[]')
		{
			var output = '[';

			value.b && (output += _Debug_toAnsiString(ansi, value.a), value = value.b)

			for (; value.b; value = value.b) // WHILE_CONS
			{
				output += ',' + _Debug_toAnsiString(ansi, value.a);
			}
			return output + ']';
		}

		var output = '';
		for (var i in value)
		{
			if (i === '$') continue;
			var str = _Debug_toAnsiString(ansi, value[i]);
			var c0 = str[0];
			var parenless = c0 === '{' || c0 === '(' || c0 === '[' || c0 === '<' || c0 === '"' || str.indexOf(' ') < 0;
			output += ' ' + (parenless ? str : '(' + str + ')');
		}
		return _Debug_ctorColor(ansi, tag) + output;
	}

	if (typeof DataView === 'function' && value instanceof DataView)
	{
		return _Debug_stringColor(ansi, '<' + value.byteLength + ' bytes>');
	}

	if (typeof File !== 'undefined' && value instanceof File)
	{
		return _Debug_internalColor(ansi, '<' + value.name + '>');
	}

	if (typeof value === 'object')
	{
		var output = [];
		for (var key in value)
		{
			var field = key[0] === '_' ? key.slice(1) : key;
			output.push(_Debug_fadeColor(ansi, field) + ' = ' + _Debug_toAnsiString(ansi, value[key]));
		}
		if (output.length === 0)
		{
			return '{}';
		}
		return '{ ' + output.join(', ') + ' }';
	}

	return _Debug_internalColor(ansi, '<internals>');
}

function _Debug_addSlashes(str, isChar)
{
	var s = str
		.replace(/\\/g, '\\\\')
		.replace(/\n/g, '\\n')
		.replace(/\t/g, '\\t')
		.replace(/\r/g, '\\r')
		.replace(/\v/g, '\\v')
		.replace(/\0/g, '\\0');

	if (isChar)
	{
		return s.replace(/\'/g, '\\\'');
	}
	else
	{
		return s.replace(/\"/g, '\\"');
	}
}

function _Debug_ctorColor(ansi, string)
{
	return ansi ? '\x1b[96m' + string + '\x1b[0m' : string;
}

function _Debug_numberColor(ansi, string)
{
	return ansi ? '\x1b[95m' + string + '\x1b[0m' : string;
}

function _Debug_stringColor(ansi, string)
{
	return ansi ? '\x1b[93m' + string + '\x1b[0m' : string;
}

function _Debug_charColor(ansi, string)
{
	return ansi ? '\x1b[92m' + string + '\x1b[0m' : string;
}

function _Debug_fadeColor(ansi, string)
{
	return ansi ? '\x1b[37m' + string + '\x1b[0m' : string;
}

function _Debug_internalColor(ansi, string)
{
	return ansi ? '\x1b[36m' + string + '\x1b[0m' : string;
}

function _Debug_toHexDigit(n)
{
	return String.fromCharCode(n < 10 ? 48 + n : 55 + n);
}


// CRASH


function _Debug_crash(identifier)
{
	throw new Error('https://github.com/elm/core/blob/1.0.0/hints/' + identifier + '.md');
}


function _Debug_crash_UNUSED(identifier, fact1, fact2, fact3, fact4)
{
	switch(identifier)
	{
		case 0:
			throw new Error('What node should I take over? In JavaScript I need something like:\n\n    Elm.Main.init({\n        node: document.getElementById("elm-node")\n    })\n\nYou need to do this with any Browser.sandbox or Browser.element program.');

		case 1:
			throw new Error('Browser.application programs cannot handle URLs like this:\n\n    ' + document.location.href + '\n\nWhat is the root? The root of your file system? Try looking at this program with `elm reactor` or some other server.');

		case 2:
			var jsonErrorString = fact1;
			throw new Error('Problem with the flags given to your Elm program on initialization.\n\n' + jsonErrorString);

		case 3:
			var portName = fact1;
			throw new Error('There can only be one port named `' + portName + '`, but your program has multiple.');

		case 4:
			var portName = fact1;
			var problem = fact2;
			throw new Error('Trying to send an unexpected type of value through port `' + portName + '`:\n' + problem);

		case 5:
			throw new Error('Trying to use `(==)` on functions.\nThere is no way to know if functions are "the same" in the Elm sense.\nRead more about this at https://package.elm-lang.org/packages/elm/core/latest/Basics#== which describes why it is this way and what the better version will look like.');

		case 6:
			var moduleName = fact1;
			throw new Error('Your page is loading multiple Elm scripts with a module named ' + moduleName + '. Maybe a duplicate script is getting loaded accidentally? If not, rename one of them so I know which is which!');

		case 8:
			var moduleName = fact1;
			var region = fact2;
			var message = fact3;
			throw new Error('TODO in module `' + moduleName + '` ' + _Debug_regionToString(region) + '\n\n' + message);

		case 9:
			var moduleName = fact1;
			var region = fact2;
			var value = fact3;
			var message = fact4;
			throw new Error(
				'TODO in module `' + moduleName + '` from the `case` expression '
				+ _Debug_regionToString(region) + '\n\nIt received the following value:\n\n    '
				+ _Debug_toString(value).replace('\n', '\n    ')
				+ '\n\nBut the branch that handles it says:\n\n    ' + message.replace('\n', '\n    ')
			);

		case 10:
			throw new Error('Bug in https://github.com/elm/virtual-dom/issues');

		case 11:
			throw new Error('Cannot perform mod 0. Division by zero error.');
	}
}

function _Debug_regionToString(region)
{
	if (region.bL.aI === region.b_.aI)
	{
		return 'on line ' + region.bL.aI;
	}
	return 'on lines ' + region.bL.aI + ' through ' + region.b_.aI;
}



// MATH

var _Basics_add = F2(function(a, b) { return a + b; });
var _Basics_sub = F2(function(a, b) { return a - b; });
var _Basics_mul = F2(function(a, b) { return a * b; });
var _Basics_fdiv = F2(function(a, b) { return a / b; });
var _Basics_idiv = F2(function(a, b) { return (a / b) | 0; });
var _Basics_pow = F2(Math.pow);

var _Basics_remainderBy = F2(function(b, a) { return a % b; });

// https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/divmodnote-letter.pdf
var _Basics_modBy = F2(function(modulus, x)
{
	var answer = x % modulus;
	return modulus === 0
		? _Debug_crash(11)
		:
	((answer > 0 && modulus < 0) || (answer < 0 && modulus > 0))
		? answer + modulus
		: answer;
});


// TRIGONOMETRY

var _Basics_pi = Math.PI;
var _Basics_e = Math.E;
var _Basics_cos = Math.cos;
var _Basics_sin = Math.sin;
var _Basics_tan = Math.tan;
var _Basics_acos = Math.acos;
var _Basics_asin = Math.asin;
var _Basics_atan = Math.atan;
var _Basics_atan2 = F2(Math.atan2);


// MORE MATH

function _Basics_toFloat(x) { return x; }
function _Basics_truncate(n) { return n | 0; }
function _Basics_isInfinite(n) { return n === Infinity || n === -Infinity; }

var _Basics_ceiling = Math.ceil;
var _Basics_floor = Math.floor;
var _Basics_round = Math.round;
var _Basics_sqrt = Math.sqrt;
var _Basics_log = Math.log;
var _Basics_isNaN = isNaN;


// BOOLEANS

function _Basics_not(bool) { return !bool; }
var _Basics_and = F2(function(a, b) { return a && b; });
var _Basics_or  = F2(function(a, b) { return a || b; });
var _Basics_xor = F2(function(a, b) { return a !== b; });



var _String_cons = F2(function(chr, str)
{
	return chr + str;
});

function _String_uncons(string)
{
	var word = string.charCodeAt(0);
	return !isNaN(word)
		? $elm$core$Maybe$Just(
			0xD800 <= word && word <= 0xDBFF
				? _Utils_Tuple2(_Utils_chr(string[0] + string[1]), string.slice(2))
				: _Utils_Tuple2(_Utils_chr(string[0]), string.slice(1))
		)
		: $elm$core$Maybe$Nothing;
}

var _String_append = F2(function(a, b)
{
	return a + b;
});

function _String_length(str)
{
	return str.length;
}

var _String_map = F2(function(func, string)
{
	var len = string.length;
	var array = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = string.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			array[i] = func(_Utils_chr(string[i] + string[i+1]));
			i += 2;
			continue;
		}
		array[i] = func(_Utils_chr(string[i]));
		i++;
	}
	return array.join('');
});

var _String_filter = F2(function(isGood, str)
{
	var arr = [];
	var len = str.length;
	var i = 0;
	while (i < len)
	{
		var char = str[i];
		var word = str.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += str[i];
			i++;
		}

		if (isGood(_Utils_chr(char)))
		{
			arr.push(char);
		}
	}
	return arr.join('');
});

function _String_reverse(str)
{
	var len = str.length;
	var arr = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = str.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			arr[len - i] = str[i + 1];
			i++;
			arr[len - i] = str[i - 1];
			i++;
		}
		else
		{
			arr[len - i] = str[i];
			i++;
		}
	}
	return arr.join('');
}

var _String_foldl = F3(function(func, state, string)
{
	var len = string.length;
	var i = 0;
	while (i < len)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += string[i];
			i++;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_foldr = F3(function(func, state, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_split = F2(function(sep, str)
{
	return str.split(sep);
});

var _String_join = F2(function(sep, strs)
{
	return strs.join(sep);
});

var _String_slice = F3(function(start, end, str) {
	return str.slice(start, end);
});

function _String_trim(str)
{
	return str.trim();
}

function _String_trimLeft(str)
{
	return str.replace(/^\s+/, '');
}

function _String_trimRight(str)
{
	return str.replace(/\s+$/, '');
}

function _String_words(str)
{
	return _List_fromArray(str.trim().split(/\s+/g));
}

function _String_lines(str)
{
	return _List_fromArray(str.split(/\r\n|\r|\n/g));
}

function _String_toUpper(str)
{
	return str.toUpperCase();
}

function _String_toLower(str)
{
	return str.toLowerCase();
}

var _String_any = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (isGood(_Utils_chr(char)))
		{
			return true;
		}
	}
	return false;
});

var _String_all = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (!isGood(_Utils_chr(char)))
		{
			return false;
		}
	}
	return true;
});

var _String_contains = F2(function(sub, str)
{
	return str.indexOf(sub) > -1;
});

var _String_startsWith = F2(function(sub, str)
{
	return str.indexOf(sub) === 0;
});

var _String_endsWith = F2(function(sub, str)
{
	return str.length >= sub.length &&
		str.lastIndexOf(sub) === str.length - sub.length;
});

var _String_indexes = F2(function(sub, str)
{
	var subLen = sub.length;

	if (subLen < 1)
	{
		return _List_Nil;
	}

	var i = 0;
	var is = [];

	while ((i = str.indexOf(sub, i)) > -1)
	{
		is.push(i);
		i = i + subLen;
	}

	return _List_fromArray(is);
});


// TO STRING

function _String_fromNumber(number)
{
	return number + '';
}


// INT CONVERSIONS

function _String_toInt(str)
{
	var total = 0;
	var code0 = str.charCodeAt(0);
	var start = code0 == 0x2B /* + */ || code0 == 0x2D /* - */ ? 1 : 0;

	for (var i = start; i < str.length; ++i)
	{
		var code = str.charCodeAt(i);
		if (code < 0x30 || 0x39 < code)
		{
			return $elm$core$Maybe$Nothing;
		}
		total = 10 * total + code - 0x30;
	}

	return i == start
		? $elm$core$Maybe$Nothing
		: $elm$core$Maybe$Just(code0 == 0x2D ? -total : total);
}


// FLOAT CONVERSIONS

function _String_toFloat(s)
{
	// check if it is a hex, octal, or binary number
	if (s.length === 0 || /[\sxbo]/.test(s))
	{
		return $elm$core$Maybe$Nothing;
	}
	var n = +s;
	// faster isNaN check
	return n === n ? $elm$core$Maybe$Just(n) : $elm$core$Maybe$Nothing;
}

function _String_fromList(chars)
{
	return _List_toArray(chars).join('');
}




function _Char_toCode(char)
{
	var code = char.charCodeAt(0);
	if (0xD800 <= code && code <= 0xDBFF)
	{
		return (code - 0xD800) * 0x400 + char.charCodeAt(1) - 0xDC00 + 0x10000
	}
	return code;
}

function _Char_fromCode(code)
{
	return _Utils_chr(
		(code < 0 || 0x10FFFF < code)
			? '\uFFFD'
			:
		(code <= 0xFFFF)
			? String.fromCharCode(code)
			:
		(code -= 0x10000,
			String.fromCharCode(Math.floor(code / 0x400) + 0xD800, code % 0x400 + 0xDC00)
		)
	);
}

function _Char_toUpper(char)
{
	return _Utils_chr(char.toUpperCase());
}

function _Char_toLower(char)
{
	return _Utils_chr(char.toLowerCase());
}

function _Char_toLocaleUpper(char)
{
	return _Utils_chr(char.toLocaleUpperCase());
}

function _Char_toLocaleLower(char)
{
	return _Utils_chr(char.toLocaleLowerCase());
}



/**_UNUSED/
function _Json_errorToString(error)
{
	return $elm$json$Json$Decode$errorToString(error);
}
//*/


// CORE DECODERS

function _Json_succeed(msg)
{
	return {
		$: 0,
		a: msg
	};
}

function _Json_fail(msg)
{
	return {
		$: 1,
		a: msg
	};
}

function _Json_decodePrim(decoder)
{
	return { $: 2, b: decoder };
}

var _Json_decodeInt = _Json_decodePrim(function(value) {
	return (typeof value !== 'number')
		? _Json_expecting('an INT', value)
		:
	(-2147483647 < value && value < 2147483647 && (value | 0) === value)
		? $elm$core$Result$Ok(value)
		:
	(isFinite(value) && !(value % 1))
		? $elm$core$Result$Ok(value)
		: _Json_expecting('an INT', value);
});

var _Json_decodeBool = _Json_decodePrim(function(value) {
	return (typeof value === 'boolean')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a BOOL', value);
});

var _Json_decodeFloat = _Json_decodePrim(function(value) {
	return (typeof value === 'number')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a FLOAT', value);
});

var _Json_decodeValue = _Json_decodePrim(function(value) {
	return $elm$core$Result$Ok(_Json_wrap(value));
});

var _Json_decodeString = _Json_decodePrim(function(value) {
	return (typeof value === 'string')
		? $elm$core$Result$Ok(value)
		: (value instanceof String)
			? $elm$core$Result$Ok(value + '')
			: _Json_expecting('a STRING', value);
});

function _Json_decodeList(decoder) { return { $: 3, b: decoder }; }
function _Json_decodeArray(decoder) { return { $: 4, b: decoder }; }

function _Json_decodeNull(value) { return { $: 5, c: value }; }

var _Json_decodeField = F2(function(field, decoder)
{
	return {
		$: 6,
		d: field,
		b: decoder
	};
});

var _Json_decodeIndex = F2(function(index, decoder)
{
	return {
		$: 7,
		e: index,
		b: decoder
	};
});

function _Json_decodeKeyValuePairs(decoder)
{
	return {
		$: 8,
		b: decoder
	};
}

function _Json_mapMany(f, decoders)
{
	return {
		$: 9,
		f: f,
		g: decoders
	};
}

var _Json_andThen = F2(function(callback, decoder)
{
	return {
		$: 10,
		b: decoder,
		h: callback
	};
});

function _Json_oneOf(decoders)
{
	return {
		$: 11,
		g: decoders
	};
}


// DECODING OBJECTS

var _Json_map1 = F2(function(f, d1)
{
	return _Json_mapMany(f, [d1]);
});

var _Json_map2 = F3(function(f, d1, d2)
{
	return _Json_mapMany(f, [d1, d2]);
});

var _Json_map3 = F4(function(f, d1, d2, d3)
{
	return _Json_mapMany(f, [d1, d2, d3]);
});

var _Json_map4 = F5(function(f, d1, d2, d3, d4)
{
	return _Json_mapMany(f, [d1, d2, d3, d4]);
});

var _Json_map5 = F6(function(f, d1, d2, d3, d4, d5)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5]);
});

var _Json_map6 = F7(function(f, d1, d2, d3, d4, d5, d6)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6]);
});

var _Json_map7 = F8(function(f, d1, d2, d3, d4, d5, d6, d7)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7]);
});

var _Json_map8 = F9(function(f, d1, d2, d3, d4, d5, d6, d7, d8)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7, d8]);
});


// DECODE

var _Json_runOnString = F2(function(decoder, string)
{
	try
	{
		var value = JSON.parse(string);
		return _Json_runHelp(decoder, value);
	}
	catch (e)
	{
		return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'This is not valid JSON! ' + e.message, _Json_wrap(string)));
	}
});

var _Json_run = F2(function(decoder, value)
{
	return _Json_runHelp(decoder, _Json_unwrap(value));
});

function _Json_runHelp(decoder, value)
{
	switch (decoder.$)
	{
		case 2:
			return decoder.b(value);

		case 5:
			return (value === null)
				? $elm$core$Result$Ok(decoder.c)
				: _Json_expecting('null', value);

		case 3:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('a LIST', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _List_fromArray);

		case 4:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _Json_toElmArray);

		case 6:
			var field = decoder.d;
			if (typeof value !== 'object' || value === null || !(field in value))
			{
				return _Json_expecting('an OBJECT with a field named `' + field + '`', value);
			}
			var result = _Json_runHelp(decoder.b, value[field]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, field, result.a));

		case 7:
			var index = decoder.e;
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			if (index >= value.length)
			{
				return _Json_expecting('a LONGER array. Need index ' + index + ' but only see ' + value.length + ' entries', value);
			}
			var result = _Json_runHelp(decoder.b, value[index]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, index, result.a));

		case 8:
			if (typeof value !== 'object' || value === null || _Json_isArray(value))
			{
				return _Json_expecting('an OBJECT', value);
			}

			var keyValuePairs = _List_Nil;
			// TODO test perf of Object.keys and switch when support is good enough
			for (var key in value)
			{
				if (value.hasOwnProperty(key))
				{
					var result = _Json_runHelp(decoder.b, value[key]);
					if (!$elm$core$Result$isOk(result))
					{
						return $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, key, result.a));
					}
					keyValuePairs = _List_Cons(_Utils_Tuple2(key, result.a), keyValuePairs);
				}
			}
			return $elm$core$Result$Ok($elm$core$List$reverse(keyValuePairs));

		case 9:
			var answer = decoder.f;
			var decoders = decoder.g;
			for (var i = 0; i < decoders.length; i++)
			{
				var result = _Json_runHelp(decoders[i], value);
				if (!$elm$core$Result$isOk(result))
				{
					return result;
				}
				answer = answer(result.a);
			}
			return $elm$core$Result$Ok(answer);

		case 10:
			var result = _Json_runHelp(decoder.b, value);
			return (!$elm$core$Result$isOk(result))
				? result
				: _Json_runHelp(decoder.h(result.a), value);

		case 11:
			var errors = _List_Nil;
			for (var temp = decoder.g; temp.b; temp = temp.b) // WHILE_CONS
			{
				var result = _Json_runHelp(temp.a, value);
				if ($elm$core$Result$isOk(result))
				{
					return result;
				}
				errors = _List_Cons(result.a, errors);
			}
			return $elm$core$Result$Err($elm$json$Json$Decode$OneOf($elm$core$List$reverse(errors)));

		case 1:
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, decoder.a, _Json_wrap(value)));

		case 0:
			return $elm$core$Result$Ok(decoder.a);
	}
}

function _Json_runArrayDecoder(decoder, value, toElmValue)
{
	var len = value.length;
	var array = new Array(len);
	for (var i = 0; i < len; i++)
	{
		var result = _Json_runHelp(decoder, value[i]);
		if (!$elm$core$Result$isOk(result))
		{
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, i, result.a));
		}
		array[i] = result.a;
	}
	return $elm$core$Result$Ok(toElmValue(array));
}

function _Json_isArray(value)
{
	return Array.isArray(value) || (typeof FileList === 'function' && value instanceof FileList);
}

function _Json_toElmArray(array)
{
	return A2($elm$core$Array$initialize, array.length, function(i) { return array[i]; });
}

function _Json_expecting(type, value)
{
	return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'Expecting ' + type, _Json_wrap(value)));
}


// EQUALITY

function _Json_equality(x, y)
{
	if (x === y)
	{
		return true;
	}

	if (x.$ !== y.$)
	{
		return false;
	}

	switch (x.$)
	{
		case 0:
		case 1:
			return x.a === y.a;

		case 2:
			return x.b === y.b;

		case 5:
			return x.c === y.c;

		case 3:
		case 4:
		case 8:
			return _Json_equality(x.b, y.b);

		case 6:
			return x.d === y.d && _Json_equality(x.b, y.b);

		case 7:
			return x.e === y.e && _Json_equality(x.b, y.b);

		case 9:
			return x.f === y.f && _Json_listEquality(x.g, y.g);

		case 10:
			return x.h === y.h && _Json_equality(x.b, y.b);

		case 11:
			return _Json_listEquality(x.g, y.g);
	}
}

function _Json_listEquality(aDecoders, bDecoders)
{
	var len = aDecoders.length;
	if (len !== bDecoders.length)
	{
		return false;
	}
	for (var i = 0; i < len; i++)
	{
		if (!_Json_equality(aDecoders[i], bDecoders[i]))
		{
			return false;
		}
	}
	return true;
}


// ENCODE

var _Json_encode = F2(function(indentLevel, value)
{
	return JSON.stringify(_Json_unwrap(value), null, indentLevel) + '';
});

function _Json_wrap_UNUSED(value) { return { $: 0, a: value }; }
function _Json_unwrap_UNUSED(value) { return value.a; }

function _Json_wrap(value) { return value; }
function _Json_unwrap(value) { return value; }

function _Json_emptyArray() { return []; }
function _Json_emptyObject() { return {}; }

var _Json_addField = F3(function(key, value, object)
{
	object[key] = _Json_unwrap(value);
	return object;
});

function _Json_addEntry(func)
{
	return F2(function(entry, array)
	{
		array.push(_Json_unwrap(func(entry)));
		return array;
	});
}

var _Json_encodeNull = _Json_wrap(null);



// TASKS

function _Scheduler_succeed(value)
{
	return {
		$: 0,
		a: value
	};
}

function _Scheduler_fail(error)
{
	return {
		$: 1,
		a: error
	};
}

function _Scheduler_binding(callback)
{
	return {
		$: 2,
		b: callback,
		c: null
	};
}

var _Scheduler_andThen = F2(function(callback, task)
{
	return {
		$: 3,
		b: callback,
		d: task
	};
});

var _Scheduler_onError = F2(function(callback, task)
{
	return {
		$: 4,
		b: callback,
		d: task
	};
});

function _Scheduler_receive(callback)
{
	return {
		$: 5,
		b: callback
	};
}


// PROCESSES

var _Scheduler_guid = 0;

function _Scheduler_rawSpawn(task)
{
	var proc = {
		$: 0,
		e: _Scheduler_guid++,
		f: task,
		g: null,
		h: []
	};

	_Scheduler_enqueue(proc);

	return proc;
}

function _Scheduler_spawn(task)
{
	return _Scheduler_binding(function(callback) {
		callback(_Scheduler_succeed(_Scheduler_rawSpawn(task)));
	});
}

function _Scheduler_rawSend(proc, msg)
{
	proc.h.push(msg);
	_Scheduler_enqueue(proc);
}

var _Scheduler_send = F2(function(proc, msg)
{
	return _Scheduler_binding(function(callback) {
		_Scheduler_rawSend(proc, msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});

function _Scheduler_kill(proc)
{
	return _Scheduler_binding(function(callback) {
		var task = proc.f;
		if (task.$ === 2 && task.c)
		{
			task.c();
		}

		proc.f = null;

		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
}


/* STEP PROCESSES

type alias Process =
  { $ : tag
  , id : unique_id
  , root : Task
  , stack : null | { $: SUCCEED | FAIL, a: callback, b: stack }
  , mailbox : [msg]
  }

*/


var _Scheduler_working = false;
var _Scheduler_queue = [];


function _Scheduler_enqueue(proc)
{
	_Scheduler_queue.push(proc);
	if (_Scheduler_working)
	{
		return;
	}
	_Scheduler_working = true;
	while (proc = _Scheduler_queue.shift())
	{
		_Scheduler_step(proc);
	}
	_Scheduler_working = false;
}


function _Scheduler_step(proc)
{
	while (proc.f)
	{
		var rootTag = proc.f.$;
		if (rootTag === 0 || rootTag === 1)
		{
			while (proc.g && proc.g.$ !== rootTag)
			{
				proc.g = proc.g.i;
			}
			if (!proc.g)
			{
				return;
			}
			proc.f = proc.g.b(proc.f.a);
			proc.g = proc.g.i;
		}
		else if (rootTag === 2)
		{
			proc.f.c = proc.f.b(function(newRoot) {
				proc.f = newRoot;
				_Scheduler_enqueue(proc);
			});
			return;
		}
		else if (rootTag === 5)
		{
			if (proc.h.length === 0)
			{
				return;
			}
			proc.f = proc.f.b(proc.h.shift());
		}
		else // if (rootTag === 3 || rootTag === 4)
		{
			proc.g = {
				$: rootTag === 3 ? 0 : 1,
				b: proc.f.b,
				i: proc.g
			};
			proc.f = proc.f.d;
		}
	}
}



function _Process_sleep(time)
{
	return _Scheduler_binding(function(callback) {
		var id = setTimeout(function() {
			callback(_Scheduler_succeed(_Utils_Tuple0));
		}, time);

		return function() { clearTimeout(id); };
	});
}




// PROGRAMS


var _Platform_worker = F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.ds,
		impl.d0,
		impl.dT,
		function() { return function() {} }
	);
});



// INITIALIZE A PROGRAM


function _Platform_initialize(flagDecoder, args, init, update, subscriptions, stepperBuilder)
{
	var result = A2(_Json_run, flagDecoder, _Json_wrap(args ? args['flags'] : undefined));
	$elm$core$Result$isOk(result) || _Debug_crash(2 /**_UNUSED/, _Json_errorToString(result.a) /**/);
	var managers = {};
	result = init(result.a);
	var model = result.a;
	var stepper = stepperBuilder(sendToApp, model);
	var ports = _Platform_setupEffects(managers, sendToApp);

	function sendToApp(msg, viewMetadata)
	{
		result = A2(update, msg, model);
		stepper(model = result.a, viewMetadata);
		_Platform_enqueueEffects(managers, result.b, subscriptions(model));
	}

	_Platform_enqueueEffects(managers, result.b, subscriptions(model));

	return ports ? { ports: ports } : {};
}



// TRACK PRELOADS
//
// This is used by code in elm/browser and elm/http
// to register any HTTP requests that are triggered by init.
//


var _Platform_preload;


function _Platform_registerPreload(url)
{
	_Platform_preload.add(url);
}



// EFFECT MANAGERS


var _Platform_effectManagers = {};


function _Platform_setupEffects(managers, sendToApp)
{
	var ports;

	// setup all necessary effect managers
	for (var key in _Platform_effectManagers)
	{
		var manager = _Platform_effectManagers[key];

		if (manager.a)
		{
			ports = ports || {};
			ports[key] = manager.a(key, sendToApp);
		}

		managers[key] = _Platform_instantiateManager(manager, sendToApp);
	}

	return ports;
}


function _Platform_createManager(init, onEffects, onSelfMsg, cmdMap, subMap)
{
	return {
		b: init,
		c: onEffects,
		d: onSelfMsg,
		e: cmdMap,
		f: subMap
	};
}


function _Platform_instantiateManager(info, sendToApp)
{
	var router = {
		g: sendToApp,
		h: undefined
	};

	var onEffects = info.c;
	var onSelfMsg = info.d;
	var cmdMap = info.e;
	var subMap = info.f;

	function loop(state)
	{
		return A2(_Scheduler_andThen, loop, _Scheduler_receive(function(msg)
		{
			var value = msg.a;

			if (msg.$ === 0)
			{
				return A3(onSelfMsg, router, value, state);
			}

			return cmdMap && subMap
				? A4(onEffects, router, value.i, value.j, state)
				: A3(onEffects, router, cmdMap ? value.i : value.j, state);
		}));
	}

	return router.h = _Scheduler_rawSpawn(A2(_Scheduler_andThen, loop, info.b));
}



// ROUTING


var _Platform_sendToApp = F2(function(router, msg)
{
	return _Scheduler_binding(function(callback)
	{
		router.g(msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});


var _Platform_sendToSelf = F2(function(router, msg)
{
	return A2(_Scheduler_send, router.h, {
		$: 0,
		a: msg
	});
});



// BAGS


function _Platform_leaf(home)
{
	return function(value)
	{
		return {
			$: 1,
			k: home,
			l: value
		};
	};
}


function _Platform_batch(list)
{
	return {
		$: 2,
		m: list
	};
}


var _Platform_map = F2(function(tagger, bag)
{
	return {
		$: 3,
		n: tagger,
		o: bag
	}
});



// PIPE BAGS INTO EFFECT MANAGERS
//
// Effects must be queued!
//
// Say your init contains a synchronous command, like Time.now or Time.here
//
//   - This will produce a batch of effects (FX_1)
//   - The synchronous task triggers the subsequent `update` call
//   - This will produce a batch of effects (FX_2)
//
// If we just start dispatching FX_2, subscriptions from FX_2 can be processed
// before subscriptions from FX_1. No good! Earlier versions of this code had
// this problem, leading to these reports:
//
//   https://github.com/elm/core/issues/980
//   https://github.com/elm/core/pull/981
//   https://github.com/elm/compiler/issues/1776
//
// The queue is necessary to avoid ordering issues for synchronous commands.


// Why use true/false here? Why not just check the length of the queue?
// The goal is to detect "are we currently dispatching effects?" If we
// are, we need to bail and let the ongoing while loop handle things.
//
// Now say the queue has 1 element. When we dequeue the final element,
// the queue will be empty, but we are still actively dispatching effects.
// So you could get queue jumping in a really tricky category of cases.
//
var _Platform_effectsQueue = [];
var _Platform_effectsActive = false;


function _Platform_enqueueEffects(managers, cmdBag, subBag)
{
	_Platform_effectsQueue.push({ p: managers, q: cmdBag, r: subBag });

	if (_Platform_effectsActive) return;

	_Platform_effectsActive = true;
	for (var fx; fx = _Platform_effectsQueue.shift(); )
	{
		_Platform_dispatchEffects(fx.p, fx.q, fx.r);
	}
	_Platform_effectsActive = false;
}


function _Platform_dispatchEffects(managers, cmdBag, subBag)
{
	var effectsDict = {};
	_Platform_gatherEffects(true, cmdBag, effectsDict, null);
	_Platform_gatherEffects(false, subBag, effectsDict, null);

	for (var home in managers)
	{
		_Scheduler_rawSend(managers[home], {
			$: 'fx',
			a: effectsDict[home] || { i: _List_Nil, j: _List_Nil }
		});
	}
}


function _Platform_gatherEffects(isCmd, bag, effectsDict, taggers)
{
	switch (bag.$)
	{
		case 1:
			var home = bag.k;
			var effect = _Platform_toEffect(isCmd, home, taggers, bag.l);
			effectsDict[home] = _Platform_insert(isCmd, effect, effectsDict[home]);
			return;

		case 2:
			for (var list = bag.m; list.b; list = list.b) // WHILE_CONS
			{
				_Platform_gatherEffects(isCmd, list.a, effectsDict, taggers);
			}
			return;

		case 3:
			_Platform_gatherEffects(isCmd, bag.o, effectsDict, {
				s: bag.n,
				t: taggers
			});
			return;
	}
}


function _Platform_toEffect(isCmd, home, taggers, value)
{
	function applyTaggers(x)
	{
		for (var temp = taggers; temp; temp = temp.t)
		{
			x = temp.s(x);
		}
		return x;
	}

	var map = isCmd
		? _Platform_effectManagers[home].e
		: _Platform_effectManagers[home].f;

	return A2(map, applyTaggers, value)
}


function _Platform_insert(isCmd, newEffect, effects)
{
	effects = effects || { i: _List_Nil, j: _List_Nil };

	isCmd
		? (effects.i = _List_Cons(newEffect, effects.i))
		: (effects.j = _List_Cons(newEffect, effects.j));

	return effects;
}



// PORTS


function _Platform_checkPortName(name)
{
	if (_Platform_effectManagers[name])
	{
		_Debug_crash(3, name)
	}
}



// OUTGOING PORTS


function _Platform_outgoingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		e: _Platform_outgoingPortMap,
		u: converter,
		a: _Platform_setupOutgoingPort
	};
	return _Platform_leaf(name);
}


var _Platform_outgoingPortMap = F2(function(tagger, value) { return value; });


function _Platform_setupOutgoingPort(name)
{
	var subs = [];
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Process_sleep(0);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, cmdList, state)
	{
		for ( ; cmdList.b; cmdList = cmdList.b) // WHILE_CONS
		{
			// grab a separate reference to subs in case unsubscribe is called
			var currentSubs = subs;
			var value = _Json_unwrap(converter(cmdList.a));
			for (var i = 0; i < currentSubs.length; i++)
			{
				currentSubs[i](value);
			}
		}
		return init;
	});

	// PUBLIC API

	function subscribe(callback)
	{
		subs.push(callback);
	}

	function unsubscribe(callback)
	{
		// copy subs into a new array in case unsubscribe is called within a
		// subscribed callback
		subs = subs.slice();
		var index = subs.indexOf(callback);
		if (index >= 0)
		{
			subs.splice(index, 1);
		}
	}

	return {
		subscribe: subscribe,
		unsubscribe: unsubscribe
	};
}



// INCOMING PORTS


function _Platform_incomingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		f: _Platform_incomingPortMap,
		u: converter,
		a: _Platform_setupIncomingPort
	};
	return _Platform_leaf(name);
}


var _Platform_incomingPortMap = F2(function(tagger, finalTagger)
{
	return function(value)
	{
		return tagger(finalTagger(value));
	};
});


function _Platform_setupIncomingPort(name, sendToApp)
{
	var subs = _List_Nil;
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Scheduler_succeed(null);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, subList, state)
	{
		subs = subList;
		return init;
	});

	// PUBLIC API

	function send(incomingValue)
	{
		var result = A2(_Json_run, converter, _Json_wrap(incomingValue));

		$elm$core$Result$isOk(result) || _Debug_crash(4, name, result.a);

		var value = result.a;
		for (var temp = subs; temp.b; temp = temp.b) // WHILE_CONS
		{
			sendToApp(temp.a(value));
		}
	}

	return { send: send };
}



// EXPORT ELM MODULES
//
// Have DEBUG and PROD versions so that we can (1) give nicer errors in
// debug mode and (2) not pay for the bits needed for that in prod mode.
//


function _Platform_export(exports)
{
	scope['Elm']
		? _Platform_mergeExportsProd(scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsProd(obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6)
				: _Platform_mergeExportsProd(obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}


function _Platform_export_UNUSED(exports)
{
	scope['Elm']
		? _Platform_mergeExportsDebug('Elm', scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsDebug(moduleName, obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6, moduleName)
				: _Platform_mergeExportsDebug(moduleName + '.' + name, obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}




// HELPERS


var _VirtualDom_divertHrefToApp;

var _VirtualDom_doc = typeof document !== 'undefined' ? document : {};


function _VirtualDom_appendChild(parent, child)
{
	parent.appendChild(child);
}

var _VirtualDom_init = F4(function(virtualNode, flagDecoder, debugMetadata, args)
{
	// NOTE: this function needs _Platform_export available to work

	/**/
	var node = args['node'];
	//*/
	/**_UNUSED/
	var node = args && args['node'] ? args['node'] : _Debug_crash(0);
	//*/

	node.parentNode.replaceChild(
		_VirtualDom_render(virtualNode, function() {}),
		node
	);

	return {};
});



// TEXT


function _VirtualDom_text(string)
{
	return {
		$: 0,
		a: string
	};
}



// NODE


var _VirtualDom_nodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 1,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_node = _VirtualDom_nodeNS(undefined);



// KEYED NODE


var _VirtualDom_keyedNodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 2,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_keyedNode = _VirtualDom_keyedNodeNS(undefined);



// CUSTOM


function _VirtualDom_custom(factList, model, render, diff)
{
	return {
		$: 3,
		d: _VirtualDom_organizeFacts(factList),
		g: model,
		h: render,
		i: diff
	};
}



// MAP


var _VirtualDom_map = F2(function(tagger, node)
{
	return {
		$: 4,
		j: tagger,
		k: node,
		b: 1 + (node.b || 0)
	};
});



// LAZY


function _VirtualDom_thunk(refs, thunk)
{
	return {
		$: 5,
		l: refs,
		m: thunk,
		k: undefined
	};
}

var _VirtualDom_lazy = F2(function(func, a)
{
	return _VirtualDom_thunk([func, a], function() {
		return func(a);
	});
});

var _VirtualDom_lazy2 = F3(function(func, a, b)
{
	return _VirtualDom_thunk([func, a, b], function() {
		return A2(func, a, b);
	});
});

var _VirtualDom_lazy3 = F4(function(func, a, b, c)
{
	return _VirtualDom_thunk([func, a, b, c], function() {
		return A3(func, a, b, c);
	});
});

var _VirtualDom_lazy4 = F5(function(func, a, b, c, d)
{
	return _VirtualDom_thunk([func, a, b, c, d], function() {
		return A4(func, a, b, c, d);
	});
});

var _VirtualDom_lazy5 = F6(function(func, a, b, c, d, e)
{
	return _VirtualDom_thunk([func, a, b, c, d, e], function() {
		return A5(func, a, b, c, d, e);
	});
});

var _VirtualDom_lazy6 = F7(function(func, a, b, c, d, e, f)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f], function() {
		return A6(func, a, b, c, d, e, f);
	});
});

var _VirtualDom_lazy7 = F8(function(func, a, b, c, d, e, f, g)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g], function() {
		return A7(func, a, b, c, d, e, f, g);
	});
});

var _VirtualDom_lazy8 = F9(function(func, a, b, c, d, e, f, g, h)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g, h], function() {
		return A8(func, a, b, c, d, e, f, g, h);
	});
});



// FACTS


var _VirtualDom_on = F2(function(key, handler)
{
	return {
		$: 'a0',
		n: key,
		o: handler
	};
});
var _VirtualDom_style = F2(function(key, value)
{
	return {
		$: 'a1',
		n: key,
		o: value
	};
});
var _VirtualDom_property = F2(function(key, value)
{
	return {
		$: 'a2',
		n: key,
		o: value
	};
});
var _VirtualDom_attribute = F2(function(key, value)
{
	return {
		$: 'a3',
		n: key,
		o: value
	};
});
var _VirtualDom_attributeNS = F3(function(namespace, key, value)
{
	return {
		$: 'a4',
		n: key,
		o: { f: namespace, o: value }
	};
});



// XSS ATTACK VECTOR CHECKS


function _VirtualDom_noScript(tag)
{
	return tag == 'script' ? 'p' : tag;
}

function _VirtualDom_noOnOrFormAction(key)
{
	return /^(on|formAction$)/i.test(key) ? 'data-' + key : key;
}

function _VirtualDom_noInnerHtmlOrFormAction(key)
{
	return key == 'innerHTML' || key == 'formAction' ? 'data-' + key : key;
}

function _VirtualDom_noJavaScriptUri(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,'')) ? '' : value;
}

function _VirtualDom_noJavaScriptUri_UNUSED(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,''))
		? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlUri(value)
{
	return /^\s*(javascript:|data:text\/html)/i.test(value) ? '' : value;
}

function _VirtualDom_noJavaScriptOrHtmlUri_UNUSED(value)
{
	return /^\s*(javascript:|data:text\/html)/i.test(value)
		? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
		: value;
}



// MAP FACTS


var _VirtualDom_mapAttribute = F2(function(func, attr)
{
	return (attr.$ === 'a0')
		? A2(_VirtualDom_on, attr.n, _VirtualDom_mapHandler(func, attr.o))
		: attr;
});

function _VirtualDom_mapHandler(func, handler)
{
	var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

	// 0 = Normal
	// 1 = MayStopPropagation
	// 2 = MayPreventDefault
	// 3 = Custom

	return {
		$: handler.$,
		a:
			!tag
				? A2($elm$json$Json$Decode$map, func, handler.a)
				:
			A3($elm$json$Json$Decode$map2,
				tag < 3
					? _VirtualDom_mapEventTuple
					: _VirtualDom_mapEventRecord,
				$elm$json$Json$Decode$succeed(func),
				handler.a
			)
	};
}

var _VirtualDom_mapEventTuple = F2(function(func, tuple)
{
	return _Utils_Tuple2(func(tuple.a), tuple.b);
});

var _VirtualDom_mapEventRecord = F2(function(func, record)
{
	return {
		ae: func(record.ae),
		bM: record.bM,
		bH: record.bH
	}
});



// ORGANIZE FACTS


function _VirtualDom_organizeFacts(factList)
{
	for (var facts = {}; factList.b; factList = factList.b) // WHILE_CONS
	{
		var entry = factList.a;

		var tag = entry.$;
		var key = entry.n;
		var value = entry.o;

		if (tag === 'a2')
		{
			(key === 'className')
				? _VirtualDom_addClass(facts, key, _Json_unwrap(value))
				: facts[key] = _Json_unwrap(value);

			continue;
		}

		var subFacts = facts[tag] || (facts[tag] = {});
		(tag === 'a3' && key === 'class')
			? _VirtualDom_addClass(subFacts, key, value)
			: subFacts[key] = value;
	}

	return facts;
}

function _VirtualDom_addClass(object, key, newClass)
{
	var classes = object[key];
	object[key] = classes ? classes + ' ' + newClass : newClass;
}



// RENDER


function _VirtualDom_render(vNode, eventNode)
{
	var tag = vNode.$;

	if (tag === 5)
	{
		return _VirtualDom_render(vNode.k || (vNode.k = vNode.m()), eventNode);
	}

	if (tag === 0)
	{
		return _VirtualDom_doc.createTextNode(vNode.a);
	}

	if (tag === 4)
	{
		var subNode = vNode.k;
		var tagger = vNode.j;

		while (subNode.$ === 4)
		{
			typeof tagger !== 'object'
				? tagger = [tagger, subNode.j]
				: tagger.push(subNode.j);

			subNode = subNode.k;
		}

		var subEventRoot = { j: tagger, p: eventNode };
		var domNode = _VirtualDom_render(subNode, subEventRoot);
		domNode.elm_event_node_ref = subEventRoot;
		return domNode;
	}

	if (tag === 3)
	{
		var domNode = vNode.h(vNode.g);
		_VirtualDom_applyFacts(domNode, eventNode, vNode.d);
		return domNode;
	}

	// at this point `tag` must be 1 or 2

	var domNode = vNode.f
		? _VirtualDom_doc.createElementNS(vNode.f, vNode.c)
		: _VirtualDom_doc.createElement(vNode.c);

	if (_VirtualDom_divertHrefToApp && vNode.c == 'a')
	{
		domNode.addEventListener('click', _VirtualDom_divertHrefToApp(domNode));
	}

	_VirtualDom_applyFacts(domNode, eventNode, vNode.d);

	for (var kids = vNode.e, i = 0; i < kids.length; i++)
	{
		_VirtualDom_appendChild(domNode, _VirtualDom_render(tag === 1 ? kids[i] : kids[i].b, eventNode));
	}

	return domNode;
}



// APPLY FACTS


function _VirtualDom_applyFacts(domNode, eventNode, facts)
{
	for (var key in facts)
	{
		var value = facts[key];

		key === 'a1'
			? _VirtualDom_applyStyles(domNode, value)
			:
		key === 'a0'
			? _VirtualDom_applyEvents(domNode, eventNode, value)
			:
		key === 'a3'
			? _VirtualDom_applyAttrs(domNode, value)
			:
		key === 'a4'
			? _VirtualDom_applyAttrsNS(domNode, value)
			:
		((key !== 'value' && key !== 'checked') || domNode[key] !== value) && (domNode[key] = value);
	}
}



// APPLY STYLES


function _VirtualDom_applyStyles(domNode, styles)
{
	var domNodeStyle = domNode.style;

	for (var key in styles)
	{
		domNodeStyle[key] = styles[key];
	}
}



// APPLY ATTRS


function _VirtualDom_applyAttrs(domNode, attrs)
{
	for (var key in attrs)
	{
		var value = attrs[key];
		typeof value !== 'undefined'
			? domNode.setAttribute(key, value)
			: domNode.removeAttribute(key);
	}
}



// APPLY NAMESPACED ATTRS


function _VirtualDom_applyAttrsNS(domNode, nsAttrs)
{
	for (var key in nsAttrs)
	{
		var pair = nsAttrs[key];
		var namespace = pair.f;
		var value = pair.o;

		typeof value !== 'undefined'
			? domNode.setAttributeNS(namespace, key, value)
			: domNode.removeAttributeNS(namespace, key);
	}
}



// APPLY EVENTS


function _VirtualDom_applyEvents(domNode, eventNode, events)
{
	var allCallbacks = domNode.elmFs || (domNode.elmFs = {});

	for (var key in events)
	{
		var newHandler = events[key];
		var oldCallback = allCallbacks[key];

		if (!newHandler)
		{
			domNode.removeEventListener(key, oldCallback);
			allCallbacks[key] = undefined;
			continue;
		}

		if (oldCallback)
		{
			var oldHandler = oldCallback.q;
			if (oldHandler.$ === newHandler.$)
			{
				oldCallback.q = newHandler;
				continue;
			}
			domNode.removeEventListener(key, oldCallback);
		}

		oldCallback = _VirtualDom_makeCallback(eventNode, newHandler);
		domNode.addEventListener(key, oldCallback,
			_VirtualDom_passiveSupported
			&& { passive: $elm$virtual_dom$VirtualDom$toHandlerInt(newHandler) < 2 }
		);
		allCallbacks[key] = oldCallback;
	}
}



// PASSIVE EVENTS


var _VirtualDom_passiveSupported;

try
{
	window.addEventListener('t', null, Object.defineProperty({}, 'passive', {
		get: function() { _VirtualDom_passiveSupported = true; }
	}));
}
catch(e) {}



// EVENT HANDLERS


function _VirtualDom_makeCallback(eventNode, initialHandler)
{
	function callback(event)
	{
		var handler = callback.q;
		var result = _Json_runHelp(handler.a, event);

		if (!$elm$core$Result$isOk(result))
		{
			return;
		}

		var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

		// 0 = Normal
		// 1 = MayStopPropagation
		// 2 = MayPreventDefault
		// 3 = Custom

		var value = result.a;
		var message = !tag ? value : tag < 3 ? value.a : value.ae;
		var stopPropagation = tag == 1 ? value.b : tag == 3 && value.bM;
		var currentEventNode = (
			stopPropagation && event.stopPropagation(),
			(tag == 2 ? value.b : tag == 3 && value.bH) && event.preventDefault(),
			eventNode
		);
		var tagger;
		var i;
		while (tagger = currentEventNode.j)
		{
			if (typeof tagger == 'function')
			{
				message = tagger(message);
			}
			else
			{
				for (var i = tagger.length; i--; )
				{
					message = tagger[i](message);
				}
			}
			currentEventNode = currentEventNode.p;
		}
		currentEventNode(message, stopPropagation); // stopPropagation implies isSync
	}

	callback.q = initialHandler;

	return callback;
}

function _VirtualDom_equalEvents(x, y)
{
	return x.$ == y.$ && _Json_equality(x.a, y.a);
}



// DIFF


// TODO: Should we do patches like in iOS?
//
// type Patch
//   = At Int Patch
//   | Batch (List Patch)
//   | Change ...
//
// How could it not be better?
//
function _VirtualDom_diff(x, y)
{
	var patches = [];
	_VirtualDom_diffHelp(x, y, patches, 0);
	return patches;
}


function _VirtualDom_pushPatch(patches, type, index, data)
{
	var patch = {
		$: type,
		r: index,
		s: data,
		t: undefined,
		u: undefined
	};
	patches.push(patch);
	return patch;
}


function _VirtualDom_diffHelp(x, y, patches, index)
{
	if (x === y)
	{
		return;
	}

	var xType = x.$;
	var yType = y.$;

	// Bail if you run into different types of nodes. Implies that the
	// structure has changed significantly and it's not worth a diff.
	if (xType !== yType)
	{
		if (xType === 1 && yType === 2)
		{
			y = _VirtualDom_dekey(y);
			yType = 1;
		}
		else
		{
			_VirtualDom_pushPatch(patches, 0, index, y);
			return;
		}
	}

	// Now we know that both nodes are the same $.
	switch (yType)
	{
		case 5:
			var xRefs = x.l;
			var yRefs = y.l;
			var i = xRefs.length;
			var same = i === yRefs.length;
			while (same && i--)
			{
				same = xRefs[i] === yRefs[i];
			}
			if (same)
			{
				y.k = x.k;
				return;
			}
			y.k = y.m();
			var subPatches = [];
			_VirtualDom_diffHelp(x.k, y.k, subPatches, 0);
			subPatches.length > 0 && _VirtualDom_pushPatch(patches, 1, index, subPatches);
			return;

		case 4:
			// gather nested taggers
			var xTaggers = x.j;
			var yTaggers = y.j;
			var nesting = false;

			var xSubNode = x.k;
			while (xSubNode.$ === 4)
			{
				nesting = true;

				typeof xTaggers !== 'object'
					? xTaggers = [xTaggers, xSubNode.j]
					: xTaggers.push(xSubNode.j);

				xSubNode = xSubNode.k;
			}

			var ySubNode = y.k;
			while (ySubNode.$ === 4)
			{
				nesting = true;

				typeof yTaggers !== 'object'
					? yTaggers = [yTaggers, ySubNode.j]
					: yTaggers.push(ySubNode.j);

				ySubNode = ySubNode.k;
			}

			// Just bail if different numbers of taggers. This implies the
			// structure of the virtual DOM has changed.
			if (nesting && xTaggers.length !== yTaggers.length)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			// check if taggers are "the same"
			if (nesting ? !_VirtualDom_pairwiseRefEqual(xTaggers, yTaggers) : xTaggers !== yTaggers)
			{
				_VirtualDom_pushPatch(patches, 2, index, yTaggers);
			}

			// diff everything below the taggers
			_VirtualDom_diffHelp(xSubNode, ySubNode, patches, index + 1);
			return;

		case 0:
			if (x.a !== y.a)
			{
				_VirtualDom_pushPatch(patches, 3, index, y.a);
			}
			return;

		case 1:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKids);
			return;

		case 2:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKeyedKids);
			return;

		case 3:
			if (x.h !== y.h)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
			factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

			var patch = y.i(x.g, y.g);
			patch && _VirtualDom_pushPatch(patches, 5, index, patch);

			return;
	}
}

// assumes the incoming arrays are the same length
function _VirtualDom_pairwiseRefEqual(as, bs)
{
	for (var i = 0; i < as.length; i++)
	{
		if (as[i] !== bs[i])
		{
			return false;
		}
	}

	return true;
}

function _VirtualDom_diffNodes(x, y, patches, index, diffKids)
{
	// Bail if obvious indicators have changed. Implies more serious
	// structural changes such that it's not worth it to diff.
	if (x.c !== y.c || x.f !== y.f)
	{
		_VirtualDom_pushPatch(patches, 0, index, y);
		return;
	}

	var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
	factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

	diffKids(x, y, patches, index);
}



// DIFF FACTS


// TODO Instead of creating a new diff object, it's possible to just test if
// there *is* a diff. During the actual patch, do the diff again and make the
// modifications directly. This way, there's no new allocations. Worth it?
function _VirtualDom_diffFacts(x, y, category)
{
	var diff;

	// look for changes and removals
	for (var xKey in x)
	{
		if (xKey === 'a1' || xKey === 'a0' || xKey === 'a3' || xKey === 'a4')
		{
			var subDiff = _VirtualDom_diffFacts(x[xKey], y[xKey] || {}, xKey);
			if (subDiff)
			{
				diff = diff || {};
				diff[xKey] = subDiff;
			}
			continue;
		}

		// remove if not in the new facts
		if (!(xKey in y))
		{
			diff = diff || {};
			diff[xKey] =
				!category
					? (typeof x[xKey] === 'string' ? '' : null)
					:
				(category === 'a1')
					? ''
					:
				(category === 'a0' || category === 'a3')
					? undefined
					:
				{ f: x[xKey].f, o: undefined };

			continue;
		}

		var xValue = x[xKey];
		var yValue = y[xKey];

		// reference equal, so don't worry about it
		if (xValue === yValue && xKey !== 'value' && xKey !== 'checked'
			|| category === 'a0' && _VirtualDom_equalEvents(xValue, yValue))
		{
			continue;
		}

		diff = diff || {};
		diff[xKey] = yValue;
	}

	// add new stuff
	for (var yKey in y)
	{
		if (!(yKey in x))
		{
			diff = diff || {};
			diff[yKey] = y[yKey];
		}
	}

	return diff;
}



// DIFF KIDS


function _VirtualDom_diffKids(xParent, yParent, patches, index)
{
	var xKids = xParent.e;
	var yKids = yParent.e;

	var xLen = xKids.length;
	var yLen = yKids.length;

	// FIGURE OUT IF THERE ARE INSERTS OR REMOVALS

	if (xLen > yLen)
	{
		_VirtualDom_pushPatch(patches, 6, index, {
			v: yLen,
			i: xLen - yLen
		});
	}
	else if (xLen < yLen)
	{
		_VirtualDom_pushPatch(patches, 7, index, {
			v: xLen,
			e: yKids
		});
	}

	// PAIRWISE DIFF EVERYTHING ELSE

	for (var minLen = xLen < yLen ? xLen : yLen, i = 0; i < minLen; i++)
	{
		var xKid = xKids[i];
		_VirtualDom_diffHelp(xKid, yKids[i], patches, ++index);
		index += xKid.b || 0;
	}
}



// KEYED DIFF


function _VirtualDom_diffKeyedKids(xParent, yParent, patches, rootIndex)
{
	var localPatches = [];

	var changes = {}; // Dict String Entry
	var inserts = []; // Array { index : Int, entry : Entry }
	// type Entry = { tag : String, vnode : VNode, index : Int, data : _ }

	var xKids = xParent.e;
	var yKids = yParent.e;
	var xLen = xKids.length;
	var yLen = yKids.length;
	var xIndex = 0;
	var yIndex = 0;

	var index = rootIndex;

	while (xIndex < xLen && yIndex < yLen)
	{
		var x = xKids[xIndex];
		var y = yKids[yIndex];

		var xKey = x.a;
		var yKey = y.a;
		var xNode = x.b;
		var yNode = y.b;

		var newMatch = undefined;
		var oldMatch = undefined;

		// check if keys match

		if (xKey === yKey)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNode, localPatches, index);
			index += xNode.b || 0;

			xIndex++;
			yIndex++;
			continue;
		}

		// look ahead 1 to detect insertions and removals.

		var xNext = xKids[xIndex + 1];
		var yNext = yKids[yIndex + 1];

		if (xNext)
		{
			var xNextKey = xNext.a;
			var xNextNode = xNext.b;
			oldMatch = yKey === xNextKey;
		}

		if (yNext)
		{
			var yNextKey = yNext.a;
			var yNextNode = yNext.b;
			newMatch = xKey === yNextKey;
		}


		// swap x and y
		if (newMatch && oldMatch)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			_VirtualDom_insertNode(changes, localPatches, xKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNextNode, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		// insert y
		if (newMatch)
		{
			index++;
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			index += xNode.b || 0;

			xIndex += 1;
			yIndex += 2;
			continue;
		}

		// remove x
		if (oldMatch)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 1;
			continue;
		}

		// remove x, insert y
		if (xNext && xNextKey === yNextKey)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNextNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		break;
	}

	// eat up any remaining nodes with removeNode and insertNode

	while (xIndex < xLen)
	{
		index++;
		var x = xKids[xIndex];
		var xNode = x.b;
		_VirtualDom_removeNode(changes, localPatches, x.a, xNode, index);
		index += xNode.b || 0;
		xIndex++;
	}

	while (yIndex < yLen)
	{
		var endInserts = endInserts || [];
		var y = yKids[yIndex];
		_VirtualDom_insertNode(changes, localPatches, y.a, y.b, undefined, endInserts);
		yIndex++;
	}

	if (localPatches.length > 0 || inserts.length > 0 || endInserts)
	{
		_VirtualDom_pushPatch(patches, 8, rootIndex, {
			w: localPatches,
			x: inserts,
			y: endInserts
		});
	}
}



// CHANGES FROM KEYED DIFF


var _VirtualDom_POSTFIX = '_elmW6BL';


function _VirtualDom_insertNode(changes, localPatches, key, vnode, yIndex, inserts)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		entry = {
			c: 0,
			z: vnode,
			r: yIndex,
			s: undefined
		};

		inserts.push({ r: yIndex, A: entry });
		changes[key] = entry;

		return;
	}

	// this key was removed earlier, a match!
	if (entry.c === 1)
	{
		inserts.push({ r: yIndex, A: entry });

		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(entry.z, vnode, subPatches, entry.r);
		entry.r = yIndex;
		entry.s.s = {
			w: subPatches,
			A: entry
		};

		return;
	}

	// this key has already been inserted or moved, a duplicate!
	_VirtualDom_insertNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, yIndex, inserts);
}


function _VirtualDom_removeNode(changes, localPatches, key, vnode, index)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		var patch = _VirtualDom_pushPatch(localPatches, 9, index, undefined);

		changes[key] = {
			c: 1,
			z: vnode,
			r: index,
			s: patch
		};

		return;
	}

	// this key was inserted earlier, a match!
	if (entry.c === 0)
	{
		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(vnode, entry.z, subPatches, index);

		_VirtualDom_pushPatch(localPatches, 9, index, {
			w: subPatches,
			A: entry
		});

		return;
	}

	// this key has already been removed or moved, a duplicate!
	_VirtualDom_removeNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, index);
}



// ADD DOM NODES
//
// Each DOM node has an "index" assigned in order of traversal. It is important
// to minimize our crawl over the actual DOM, so these indexes (along with the
// descendantsCount of virtual nodes) let us skip touching entire subtrees of
// the DOM if we know there are no patches there.


function _VirtualDom_addDomNodes(domNode, vNode, patches, eventNode)
{
	_VirtualDom_addDomNodesHelp(domNode, vNode, patches, 0, 0, vNode.b, eventNode);
}


// assumes `patches` is non-empty and indexes increase monotonically.
function _VirtualDom_addDomNodesHelp(domNode, vNode, patches, i, low, high, eventNode)
{
	var patch = patches[i];
	var index = patch.r;

	while (index === low)
	{
		var patchType = patch.$;

		if (patchType === 1)
		{
			_VirtualDom_addDomNodes(domNode, vNode.k, patch.s, eventNode);
		}
		else if (patchType === 8)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var subPatches = patch.s.w;
			if (subPatches.length > 0)
			{
				_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
			}
		}
		else if (patchType === 9)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var data = patch.s;
			if (data)
			{
				data.A.s = domNode;
				var subPatches = data.w;
				if (subPatches.length > 0)
				{
					_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
				}
			}
		}
		else
		{
			patch.t = domNode;
			patch.u = eventNode;
		}

		i++;

		if (!(patch = patches[i]) || (index = patch.r) > high)
		{
			return i;
		}
	}

	var tag = vNode.$;

	if (tag === 4)
	{
		var subNode = vNode.k;

		while (subNode.$ === 4)
		{
			subNode = subNode.k;
		}

		return _VirtualDom_addDomNodesHelp(domNode, subNode, patches, i, low + 1, high, domNode.elm_event_node_ref);
	}

	// tag must be 1 or 2 at this point

	var vKids = vNode.e;
	var childNodes = domNode.childNodes;
	for (var j = 0; j < vKids.length; j++)
	{
		low++;
		var vKid = tag === 1 ? vKids[j] : vKids[j].b;
		var nextLow = low + (vKid.b || 0);
		if (low <= index && index <= nextLow)
		{
			i = _VirtualDom_addDomNodesHelp(childNodes[j], vKid, patches, i, low, nextLow, eventNode);
			if (!(patch = patches[i]) || (index = patch.r) > high)
			{
				return i;
			}
		}
		low = nextLow;
	}
	return i;
}



// APPLY PATCHES


function _VirtualDom_applyPatches(rootDomNode, oldVirtualNode, patches, eventNode)
{
	if (patches.length === 0)
	{
		return rootDomNode;
	}

	_VirtualDom_addDomNodes(rootDomNode, oldVirtualNode, patches, eventNode);
	return _VirtualDom_applyPatchesHelp(rootDomNode, patches);
}

function _VirtualDom_applyPatchesHelp(rootDomNode, patches)
{
	for (var i = 0; i < patches.length; i++)
	{
		var patch = patches[i];
		var localDomNode = patch.t
		var newNode = _VirtualDom_applyPatch(localDomNode, patch);
		if (localDomNode === rootDomNode)
		{
			rootDomNode = newNode;
		}
	}
	return rootDomNode;
}

function _VirtualDom_applyPatch(domNode, patch)
{
	switch (patch.$)
	{
		case 0:
			return _VirtualDom_applyPatchRedraw(domNode, patch.s, patch.u);

		case 4:
			_VirtualDom_applyFacts(domNode, patch.u, patch.s);
			return domNode;

		case 3:
			domNode.replaceData(0, domNode.length, patch.s);
			return domNode;

		case 1:
			return _VirtualDom_applyPatchesHelp(domNode, patch.s);

		case 2:
			if (domNode.elm_event_node_ref)
			{
				domNode.elm_event_node_ref.j = patch.s;
			}
			else
			{
				domNode.elm_event_node_ref = { j: patch.s, p: patch.u };
			}
			return domNode;

		case 6:
			var data = patch.s;
			for (var i = 0; i < data.i; i++)
			{
				domNode.removeChild(domNode.childNodes[data.v]);
			}
			return domNode;

		case 7:
			var data = patch.s;
			var kids = data.e;
			var i = data.v;
			var theEnd = domNode.childNodes[i];
			for (; i < kids.length; i++)
			{
				domNode.insertBefore(_VirtualDom_render(kids[i], patch.u), theEnd);
			}
			return domNode;

		case 9:
			var data = patch.s;
			if (!data)
			{
				domNode.parentNode.removeChild(domNode);
				return domNode;
			}
			var entry = data.A;
			if (typeof entry.r !== 'undefined')
			{
				domNode.parentNode.removeChild(domNode);
			}
			entry.s = _VirtualDom_applyPatchesHelp(domNode, data.w);
			return domNode;

		case 8:
			return _VirtualDom_applyPatchReorder(domNode, patch);

		case 5:
			return patch.s(domNode);

		default:
			_Debug_crash(10); // 'Ran into an unknown patch!'
	}
}


function _VirtualDom_applyPatchRedraw(domNode, vNode, eventNode)
{
	var parentNode = domNode.parentNode;
	var newNode = _VirtualDom_render(vNode, eventNode);

	if (!newNode.elm_event_node_ref)
	{
		newNode.elm_event_node_ref = domNode.elm_event_node_ref;
	}

	if (parentNode && newNode !== domNode)
	{
		parentNode.replaceChild(newNode, domNode);
	}
	return newNode;
}


function _VirtualDom_applyPatchReorder(domNode, patch)
{
	var data = patch.s;

	// remove end inserts
	var frag = _VirtualDom_applyPatchReorderEndInsertsHelp(data.y, patch);

	// removals
	domNode = _VirtualDom_applyPatchesHelp(domNode, data.w);

	// inserts
	var inserts = data.x;
	for (var i = 0; i < inserts.length; i++)
	{
		var insert = inserts[i];
		var entry = insert.A;
		var node = entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u);
		domNode.insertBefore(node, domNode.childNodes[insert.r]);
	}

	// add end inserts
	if (frag)
	{
		_VirtualDom_appendChild(domNode, frag);
	}

	return domNode;
}


function _VirtualDom_applyPatchReorderEndInsertsHelp(endInserts, patch)
{
	if (!endInserts)
	{
		return;
	}

	var frag = _VirtualDom_doc.createDocumentFragment();
	for (var i = 0; i < endInserts.length; i++)
	{
		var insert = endInserts[i];
		var entry = insert.A;
		_VirtualDom_appendChild(frag, entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u)
		);
	}
	return frag;
}


function _VirtualDom_virtualize(node)
{
	// TEXT NODES

	if (node.nodeType === 3)
	{
		return _VirtualDom_text(node.textContent);
	}


	// WEIRD NODES

	if (node.nodeType !== 1)
	{
		return _VirtualDom_text('');
	}


	// ELEMENT NODES

	var attrList = _List_Nil;
	var attrs = node.attributes;
	for (var i = attrs.length; i--; )
	{
		var attr = attrs[i];
		var name = attr.name;
		var value = attr.value;
		attrList = _List_Cons( A2(_VirtualDom_attribute, name, value), attrList );
	}

	var tag = node.tagName.toLowerCase();
	var kidList = _List_Nil;
	var kids = node.childNodes;

	for (var i = kids.length; i--; )
	{
		kidList = _List_Cons(_VirtualDom_virtualize(kids[i]), kidList);
	}
	return A3(_VirtualDom_node, tag, attrList, kidList);
}

function _VirtualDom_dekey(keyedNode)
{
	var keyedKids = keyedNode.e;
	var len = keyedKids.length;
	var kids = new Array(len);
	for (var i = 0; i < len; i++)
	{
		kids[i] = keyedKids[i].b;
	}

	return {
		$: 1,
		c: keyedNode.c,
		d: keyedNode.d,
		e: kids,
		f: keyedNode.f,
		b: keyedNode.b
	};
}




// ELEMENT


var _Debugger_element;

var _Browser_element = _Debugger_element || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.ds,
		impl.d0,
		impl.dT,
		function(sendToApp, initialModel) {
			var view = impl.d2;
			/**/
			var domNode = args['node'];
			//*/
			/**_UNUSED/
			var domNode = args && args['node'] ? args['node'] : _Debug_crash(0);
			//*/
			var currNode = _VirtualDom_virtualize(domNode);

			return _Browser_makeAnimator(initialModel, function(model)
			{
				var nextNode = view(model);
				var patches = _VirtualDom_diff(currNode, nextNode);
				domNode = _VirtualDom_applyPatches(domNode, currNode, patches, sendToApp);
				currNode = nextNode;
			});
		}
	);
});



// DOCUMENT


var _Debugger_document;

var _Browser_document = _Debugger_document || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.ds,
		impl.d0,
		impl.dT,
		function(sendToApp, initialModel) {
			var divertHrefToApp = impl.bK && impl.bK(sendToApp)
			var view = impl.d2;
			var title = _VirtualDom_doc.title;
			var bodyNode = _VirtualDom_doc.body;
			var currNode = _VirtualDom_virtualize(bodyNode);
			return _Browser_makeAnimator(initialModel, function(model)
			{
				_VirtualDom_divertHrefToApp = divertHrefToApp;
				var doc = view(model);
				var nextNode = _VirtualDom_node('body')(_List_Nil)(doc.cZ);
				var patches = _VirtualDom_diff(currNode, nextNode);
				bodyNode = _VirtualDom_applyPatches(bodyNode, currNode, patches, sendToApp);
				currNode = nextNode;
				_VirtualDom_divertHrefToApp = 0;
				(title !== doc.dZ) && (_VirtualDom_doc.title = title = doc.dZ);
			});
		}
	);
});



// ANIMATION


var _Browser_cancelAnimationFrame =
	typeof cancelAnimationFrame !== 'undefined'
		? cancelAnimationFrame
		: function(id) { clearTimeout(id); };

var _Browser_requestAnimationFrame =
	typeof requestAnimationFrame !== 'undefined'
		? requestAnimationFrame
		: function(callback) { return setTimeout(callback, 1000 / 60); };


function _Browser_makeAnimator(model, draw)
{
	draw(model);

	var state = 0;

	function updateIfNeeded()
	{
		state = state === 1
			? 0
			: ( _Browser_requestAnimationFrame(updateIfNeeded), draw(model), 1 );
	}

	return function(nextModel, isSync)
	{
		model = nextModel;

		isSync
			? ( draw(model),
				state === 2 && (state = 1)
				)
			: ( state === 0 && _Browser_requestAnimationFrame(updateIfNeeded),
				state = 2
				);
	};
}



// APPLICATION


function _Browser_application(impl)
{
	var onUrlChange = impl.dD;
	var onUrlRequest = impl.dE;
	var key = function() { key.a(onUrlChange(_Browser_getUrl())); };

	return _Browser_document({
		bK: function(sendToApp)
		{
			key.a = sendToApp;
			_Browser_window.addEventListener('popstate', key);
			_Browser_window.navigator.userAgent.indexOf('Trident') < 0 || _Browser_window.addEventListener('hashchange', key);

			return F2(function(domNode, event)
			{
				if (!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button < 1 && !domNode.target && !domNode.hasAttribute('download'))
				{
					event.preventDefault();
					var href = domNode.href;
					var curr = _Browser_getUrl();
					var next = $elm$url$Url$fromString(href).a;
					sendToApp(onUrlRequest(
						(next
							&& curr.cx === next.cx
							&& curr.b6 === next.b6
							&& curr.cu.a === next.cu.a
						)
							? $elm$browser$Browser$Internal(next)
							: $elm$browser$Browser$External(href)
					));
				}
			});
		},
		ds: function(flags)
		{
			return A3(impl.ds, flags, _Browser_getUrl(), key);
		},
		d2: impl.d2,
		d0: impl.d0,
		dT: impl.dT
	});
}

function _Browser_getUrl()
{
	return $elm$url$Url$fromString(_VirtualDom_doc.location.href).a || _Debug_crash(1);
}

var _Browser_go = F2(function(key, n)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		n && history.go(n);
		key();
	}));
});

var _Browser_pushUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.pushState({}, '', url);
		key();
	}));
});

var _Browser_replaceUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.replaceState({}, '', url);
		key();
	}));
});



// GLOBAL EVENTS


var _Browser_fakeNode = { addEventListener: function() {}, removeEventListener: function() {} };
var _Browser_doc = typeof document !== 'undefined' ? document : _Browser_fakeNode;
var _Browser_window = typeof window !== 'undefined' ? window : _Browser_fakeNode;

var _Browser_on = F3(function(node, eventName, sendToSelf)
{
	return _Scheduler_spawn(_Scheduler_binding(function(callback)
	{
		function handler(event)	{ _Scheduler_rawSpawn(sendToSelf(event)); }
		node.addEventListener(eventName, handler, _VirtualDom_passiveSupported && { passive: true });
		return function() { node.removeEventListener(eventName, handler); };
	}));
});

var _Browser_decodeEvent = F2(function(decoder, event)
{
	var result = _Json_runHelp(decoder, event);
	return $elm$core$Result$isOk(result) ? $elm$core$Maybe$Just(result.a) : $elm$core$Maybe$Nothing;
});



// PAGE VISIBILITY


function _Browser_visibilityInfo()
{
	return (typeof _VirtualDom_doc.hidden !== 'undefined')
		? { dp: 'hidden', c$: 'visibilitychange' }
		:
	(typeof _VirtualDom_doc.mozHidden !== 'undefined')
		? { dp: 'mozHidden', c$: 'mozvisibilitychange' }
		:
	(typeof _VirtualDom_doc.msHidden !== 'undefined')
		? { dp: 'msHidden', c$: 'msvisibilitychange' }
		:
	(typeof _VirtualDom_doc.webkitHidden !== 'undefined')
		? { dp: 'webkitHidden', c$: 'webkitvisibilitychange' }
		: { dp: 'hidden', c$: 'visibilitychange' };
}



// ANIMATION FRAMES


function _Browser_rAF()
{
	return _Scheduler_binding(function(callback)
	{
		var id = _Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(Date.now()));
		});

		return function() {
			_Browser_cancelAnimationFrame(id);
		};
	});
}


function _Browser_now()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(Date.now()));
	});
}



// DOM STUFF


function _Browser_withNode(id, doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			var node = document.getElementById(id);
			callback(node
				? _Scheduler_succeed(doStuff(node))
				: _Scheduler_fail($elm$browser$Browser$Dom$NotFound(id))
			);
		});
	});
}


function _Browser_withWindow(doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(doStuff()));
		});
	});
}


// FOCUS and BLUR


var _Browser_call = F2(function(functionName, id)
{
	return _Browser_withNode(id, function(node) {
		node[functionName]();
		return _Utils_Tuple0;
	});
});



// WINDOW VIEWPORT


function _Browser_getViewport()
{
	return {
		cD: _Browser_getScene(),
		cO: {
			cP: _Browser_window.pageXOffset,
			cQ: _Browser_window.pageYOffset,
			d3: _Browser_doc.documentElement.clientWidth,
			dn: _Browser_doc.documentElement.clientHeight
		}
	};
}

function _Browser_getScene()
{
	var body = _Browser_doc.body;
	var elem = _Browser_doc.documentElement;
	return {
		d3: Math.max(body.scrollWidth, body.offsetWidth, elem.scrollWidth, elem.offsetWidth, elem.clientWidth),
		dn: Math.max(body.scrollHeight, body.offsetHeight, elem.scrollHeight, elem.offsetHeight, elem.clientHeight)
	};
}

var _Browser_setViewport = F2(function(x, y)
{
	return _Browser_withWindow(function()
	{
		_Browser_window.scroll(x, y);
		return _Utils_Tuple0;
	});
});



// ELEMENT VIEWPORT


function _Browser_getViewportOf(id)
{
	return _Browser_withNode(id, function(node)
	{
		return {
			cD: {
				d3: node.scrollWidth,
				dn: node.scrollHeight
			},
			cO: {
				cP: node.scrollLeft,
				cQ: node.scrollTop,
				d3: node.clientWidth,
				dn: node.clientHeight
			}
		};
	});
}


var _Browser_setViewportOf = F3(function(id, x, y)
{
	return _Browser_withNode(id, function(node)
	{
		node.scrollLeft = x;
		node.scrollTop = y;
		return _Utils_Tuple0;
	});
});



// ELEMENT


function _Browser_getElement(id)
{
	return _Browser_withNode(id, function(node)
	{
		var rect = node.getBoundingClientRect();
		var x = _Browser_window.pageXOffset;
		var y = _Browser_window.pageYOffset;
		return {
			cD: _Browser_getScene(),
			cO: {
				cP: x,
				cQ: y,
				d3: _Browser_doc.documentElement.clientWidth,
				dn: _Browser_doc.documentElement.clientHeight
			},
			df: {
				cP: x + rect.left,
				cQ: y + rect.top,
				d3: rect.width,
				dn: rect.height
			}
		};
	});
}



// LOAD and RELOAD


function _Browser_reload(skipCache)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		_VirtualDom_doc.location.reload(skipCache);
	}));
}

function _Browser_load(url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		try
		{
			_Browser_window.location = url;
		}
		catch(err)
		{
			// Only Firefox can throw a NS_ERROR_MALFORMED_URI exception here.
			// Other browsers reload the page, so let's be consistent about that.
			_VirtualDom_doc.location.reload(false);
		}
	}));
}



var _Bitwise_and = F2(function(a, b)
{
	return a & b;
});

var _Bitwise_or = F2(function(a, b)
{
	return a | b;
});

var _Bitwise_xor = F2(function(a, b)
{
	return a ^ b;
});

function _Bitwise_complement(a)
{
	return ~a;
};

var _Bitwise_shiftLeftBy = F2(function(offset, a)
{
	return a << offset;
});

var _Bitwise_shiftRightBy = F2(function(offset, a)
{
	return a >> offset;
});

var _Bitwise_shiftRightZfBy = F2(function(offset, a)
{
	return a >>> offset;
});



function _Time_now(millisToPosix)
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(millisToPosix(Date.now())));
	});
}

var _Time_setInterval = F2(function(interval, task)
{
	return _Scheduler_binding(function(callback)
	{
		var id = setInterval(function() { _Scheduler_rawSpawn(task); }, interval);
		return function() { clearInterval(id); };
	});
});

function _Time_here()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(
			A2($elm$time$Time$customZone, -(new Date().getTimezoneOffset()), _List_Nil)
		));
	});
}


function _Time_getZoneName()
{
	return _Scheduler_binding(function(callback)
	{
		try
		{
			var name = $elm$time$Time$Name(Intl.DateTimeFormat().resolvedOptions().timeZone);
		}
		catch (e)
		{
			var name = $elm$time$Time$Offset(new Date().getTimezoneOffset());
		}
		callback(_Scheduler_succeed(name));
	});
}
var $elm$core$Basics$EQ = 1;
var $elm$core$Basics$GT = 2;
var $elm$core$Basics$LT = 0;
var $elm$core$List$cons = _List_cons;
var $elm$core$Dict$foldr = F3(
	function (func, acc, t) {
		foldr:
		while (true) {
			if (t.$ === -2) {
				return acc;
			} else {
				var key = t.b;
				var value = t.c;
				var left = t.d;
				var right = t.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldr, func, acc, right)),
					$temp$t = left;
				func = $temp$func;
				acc = $temp$acc;
				t = $temp$t;
				continue foldr;
			}
		}
	});
var $elm$core$Dict$toList = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, list) {
				return A2(
					$elm$core$List$cons,
					_Utils_Tuple2(key, value),
					list);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Dict$keys = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, keyList) {
				return A2($elm$core$List$cons, key, keyList);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Set$toList = function (_v0) {
	var dict = _v0;
	return $elm$core$Dict$keys(dict);
};
var $elm$core$Elm$JsArray$foldr = _JsArray_foldr;
var $elm$core$Array$foldr = F3(
	function (func, baseCase, _v0) {
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = F2(
			function (node, acc) {
				if (!node.$) {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldr, helper, acc, subTree);
				} else {
					var values = node.a;
					return A3($elm$core$Elm$JsArray$foldr, func, acc, values);
				}
			});
		return A3(
			$elm$core$Elm$JsArray$foldr,
			helper,
			A3($elm$core$Elm$JsArray$foldr, func, baseCase, tail),
			tree);
	});
var $elm$core$Array$toList = function (array) {
	return A3($elm$core$Array$foldr, $elm$core$List$cons, _List_Nil, array);
};
var $elm$core$Result$Err = function (a) {
	return {$: 1, a: a};
};
var $elm$json$Json$Decode$Failure = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var $elm$json$Json$Decode$Field = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$json$Json$Decode$Index = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $elm$core$Result$Ok = function (a) {
	return {$: 0, a: a};
};
var $elm$json$Json$Decode$OneOf = function (a) {
	return {$: 2, a: a};
};
var $elm$core$Basics$False = 1;
var $elm$core$Basics$add = _Basics_add;
var $elm$core$Maybe$Just = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Maybe$Nothing = {$: 1};
var $elm$core$String$all = _String_all;
var $elm$core$Basics$and = _Basics_and;
var $elm$core$Basics$append = _Utils_append;
var $elm$json$Json$Encode$encode = _Json_encode;
var $elm$core$String$fromInt = _String_fromNumber;
var $elm$core$String$join = F2(
	function (sep, chunks) {
		return A2(
			_String_join,
			sep,
			_List_toArray(chunks));
	});
var $elm$core$String$split = F2(
	function (sep, string) {
		return _List_fromArray(
			A2(_String_split, sep, string));
	});
var $elm$json$Json$Decode$indent = function (str) {
	return A2(
		$elm$core$String$join,
		'\n    ',
		A2($elm$core$String$split, '\n', str));
};
var $elm$core$List$foldl = F3(
	function (func, acc, list) {
		foldl:
		while (true) {
			if (!list.b) {
				return acc;
			} else {
				var x = list.a;
				var xs = list.b;
				var $temp$func = func,
					$temp$acc = A2(func, x, acc),
					$temp$list = xs;
				func = $temp$func;
				acc = $temp$acc;
				list = $temp$list;
				continue foldl;
			}
		}
	});
var $elm$core$List$length = function (xs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, i) {
				return i + 1;
			}),
		0,
		xs);
};
var $elm$core$List$map2 = _List_map2;
var $elm$core$Basics$le = _Utils_le;
var $elm$core$Basics$sub = _Basics_sub;
var $elm$core$List$rangeHelp = F3(
	function (lo, hi, list) {
		rangeHelp:
		while (true) {
			if (_Utils_cmp(lo, hi) < 1) {
				var $temp$lo = lo,
					$temp$hi = hi - 1,
					$temp$list = A2($elm$core$List$cons, hi, list);
				lo = $temp$lo;
				hi = $temp$hi;
				list = $temp$list;
				continue rangeHelp;
			} else {
				return list;
			}
		}
	});
var $elm$core$List$range = F2(
	function (lo, hi) {
		return A3($elm$core$List$rangeHelp, lo, hi, _List_Nil);
	});
var $elm$core$List$indexedMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$map2,
			f,
			A2(
				$elm$core$List$range,
				0,
				$elm$core$List$length(xs) - 1),
			xs);
	});
var $elm$core$Char$toCode = _Char_toCode;
var $elm$core$Char$isLower = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (97 <= code) && (code <= 122);
};
var $elm$core$Char$isUpper = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 90) && (65 <= code);
};
var $elm$core$Basics$or = _Basics_or;
var $elm$core$Char$isAlpha = function (_char) {
	return $elm$core$Char$isLower(_char) || $elm$core$Char$isUpper(_char);
};
var $elm$core$Char$isDigit = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 57) && (48 <= code);
};
var $elm$core$Char$isAlphaNum = function (_char) {
	return $elm$core$Char$isLower(_char) || ($elm$core$Char$isUpper(_char) || $elm$core$Char$isDigit(_char));
};
var $elm$core$List$reverse = function (list) {
	return A3($elm$core$List$foldl, $elm$core$List$cons, _List_Nil, list);
};
var $elm$core$String$uncons = _String_uncons;
var $elm$json$Json$Decode$errorOneOf = F2(
	function (i, error) {
		return '\n\n(' + ($elm$core$String$fromInt(i + 1) + (') ' + $elm$json$Json$Decode$indent(
			$elm$json$Json$Decode$errorToString(error))));
	});
var $elm$json$Json$Decode$errorToString = function (error) {
	return A2($elm$json$Json$Decode$errorToStringHelp, error, _List_Nil);
};
var $elm$json$Json$Decode$errorToStringHelp = F2(
	function (error, context) {
		errorToStringHelp:
		while (true) {
			switch (error.$) {
				case 0:
					var f = error.a;
					var err = error.b;
					var isSimple = function () {
						var _v1 = $elm$core$String$uncons(f);
						if (_v1.$ === 1) {
							return false;
						} else {
							var _v2 = _v1.a;
							var _char = _v2.a;
							var rest = _v2.b;
							return $elm$core$Char$isAlpha(_char) && A2($elm$core$String$all, $elm$core$Char$isAlphaNum, rest);
						}
					}();
					var fieldName = isSimple ? ('.' + f) : ('[\'' + (f + '\']'));
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, fieldName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 1:
					var i = error.a;
					var err = error.b;
					var indexName = '[' + ($elm$core$String$fromInt(i) + ']');
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, indexName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 2:
					var errors = error.a;
					if (!errors.b) {
						return 'Ran into a Json.Decode.oneOf with no possibilities' + function () {
							if (!context.b) {
								return '!';
							} else {
								return ' at json' + A2(
									$elm$core$String$join,
									'',
									$elm$core$List$reverse(context));
							}
						}();
					} else {
						if (!errors.b.b) {
							var err = errors.a;
							var $temp$error = err,
								$temp$context = context;
							error = $temp$error;
							context = $temp$context;
							continue errorToStringHelp;
						} else {
							var starter = function () {
								if (!context.b) {
									return 'Json.Decode.oneOf';
								} else {
									return 'The Json.Decode.oneOf at json' + A2(
										$elm$core$String$join,
										'',
										$elm$core$List$reverse(context));
								}
							}();
							var introduction = starter + (' failed in the following ' + ($elm$core$String$fromInt(
								$elm$core$List$length(errors)) + ' ways:'));
							return A2(
								$elm$core$String$join,
								'\n\n',
								A2(
									$elm$core$List$cons,
									introduction,
									A2($elm$core$List$indexedMap, $elm$json$Json$Decode$errorOneOf, errors)));
						}
					}
				default:
					var msg = error.a;
					var json = error.b;
					var introduction = function () {
						if (!context.b) {
							return 'Problem with the given value:\n\n';
						} else {
							return 'Problem with the value at json' + (A2(
								$elm$core$String$join,
								'',
								$elm$core$List$reverse(context)) + ':\n\n    ');
						}
					}();
					return introduction + ($elm$json$Json$Decode$indent(
						A2($elm$json$Json$Encode$encode, 4, json)) + ('\n\n' + msg));
			}
		}
	});
var $elm$core$Array$branchFactor = 32;
var $elm$core$Array$Array_elm_builtin = F4(
	function (a, b, c, d) {
		return {$: 0, a: a, b: b, c: c, d: d};
	});
var $elm$core$Elm$JsArray$empty = _JsArray_empty;
var $elm$core$Basics$ceiling = _Basics_ceiling;
var $elm$core$Basics$fdiv = _Basics_fdiv;
var $elm$core$Basics$logBase = F2(
	function (base, number) {
		return _Basics_log(number) / _Basics_log(base);
	});
var $elm$core$Basics$toFloat = _Basics_toFloat;
var $elm$core$Array$shiftStep = $elm$core$Basics$ceiling(
	A2($elm$core$Basics$logBase, 2, $elm$core$Array$branchFactor));
var $elm$core$Array$empty = A4($elm$core$Array$Array_elm_builtin, 0, $elm$core$Array$shiftStep, $elm$core$Elm$JsArray$empty, $elm$core$Elm$JsArray$empty);
var $elm$core$Elm$JsArray$initialize = _JsArray_initialize;
var $elm$core$Array$Leaf = function (a) {
	return {$: 1, a: a};
};
var $elm$core$Basics$apL = F2(
	function (f, x) {
		return f(x);
	});
var $elm$core$Basics$apR = F2(
	function (x, f) {
		return f(x);
	});
var $elm$core$Basics$eq = _Utils_equal;
var $elm$core$Basics$floor = _Basics_floor;
var $elm$core$Elm$JsArray$length = _JsArray_length;
var $elm$core$Basics$gt = _Utils_gt;
var $elm$core$Basics$max = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) > 0) ? x : y;
	});
var $elm$core$Basics$mul = _Basics_mul;
var $elm$core$Array$SubTree = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Elm$JsArray$initializeFromList = _JsArray_initializeFromList;
var $elm$core$Array$compressNodes = F2(
	function (nodes, acc) {
		compressNodes:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodes);
			var node = _v0.a;
			var remainingNodes = _v0.b;
			var newAcc = A2(
				$elm$core$List$cons,
				$elm$core$Array$SubTree(node),
				acc);
			if (!remainingNodes.b) {
				return $elm$core$List$reverse(newAcc);
			} else {
				var $temp$nodes = remainingNodes,
					$temp$acc = newAcc;
				nodes = $temp$nodes;
				acc = $temp$acc;
				continue compressNodes;
			}
		}
	});
var $elm$core$Tuple$first = function (_v0) {
	var x = _v0.a;
	return x;
};
var $elm$core$Array$treeFromBuilder = F2(
	function (nodeList, nodeListSize) {
		treeFromBuilder:
		while (true) {
			var newNodeSize = $elm$core$Basics$ceiling(nodeListSize / $elm$core$Array$branchFactor);
			if (newNodeSize === 1) {
				return A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodeList).a;
			} else {
				var $temp$nodeList = A2($elm$core$Array$compressNodes, nodeList, _List_Nil),
					$temp$nodeListSize = newNodeSize;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue treeFromBuilder;
			}
		}
	});
var $elm$core$Array$builderToArray = F2(
	function (reverseNodeList, builder) {
		if (!builder.f) {
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.i),
				$elm$core$Array$shiftStep,
				$elm$core$Elm$JsArray$empty,
				builder.i);
		} else {
			var treeLen = builder.f * $elm$core$Array$branchFactor;
			var depth = $elm$core$Basics$floor(
				A2($elm$core$Basics$logBase, $elm$core$Array$branchFactor, treeLen - 1));
			var correctNodeList = reverseNodeList ? $elm$core$List$reverse(builder.j) : builder.j;
			var tree = A2($elm$core$Array$treeFromBuilder, correctNodeList, builder.f);
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.i) + treeLen,
				A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep),
				tree,
				builder.i);
		}
	});
var $elm$core$Basics$idiv = _Basics_idiv;
var $elm$core$Basics$lt = _Utils_lt;
var $elm$core$Array$initializeHelp = F5(
	function (fn, fromIndex, len, nodeList, tail) {
		initializeHelp:
		while (true) {
			if (fromIndex < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					false,
					{j: nodeList, f: (len / $elm$core$Array$branchFactor) | 0, i: tail});
			} else {
				var leaf = $elm$core$Array$Leaf(
					A3($elm$core$Elm$JsArray$initialize, $elm$core$Array$branchFactor, fromIndex, fn));
				var $temp$fn = fn,
					$temp$fromIndex = fromIndex - $elm$core$Array$branchFactor,
					$temp$len = len,
					$temp$nodeList = A2($elm$core$List$cons, leaf, nodeList),
					$temp$tail = tail;
				fn = $temp$fn;
				fromIndex = $temp$fromIndex;
				len = $temp$len;
				nodeList = $temp$nodeList;
				tail = $temp$tail;
				continue initializeHelp;
			}
		}
	});
var $elm$core$Basics$remainderBy = _Basics_remainderBy;
var $elm$core$Array$initialize = F2(
	function (len, fn) {
		if (len <= 0) {
			return $elm$core$Array$empty;
		} else {
			var tailLen = len % $elm$core$Array$branchFactor;
			var tail = A3($elm$core$Elm$JsArray$initialize, tailLen, len - tailLen, fn);
			var initialFromIndex = (len - tailLen) - $elm$core$Array$branchFactor;
			return A5($elm$core$Array$initializeHelp, fn, initialFromIndex, len, _List_Nil, tail);
		}
	});
var $elm$core$Basics$True = 0;
var $elm$core$Result$isOk = function (result) {
	if (!result.$) {
		return true;
	} else {
		return false;
	}
};
var $elm$json$Json$Decode$map = _Json_map1;
var $elm$json$Json$Decode$map2 = _Json_map2;
var $elm$json$Json$Decode$succeed = _Json_succeed;
var $elm$virtual_dom$VirtualDom$toHandlerInt = function (handler) {
	switch (handler.$) {
		case 0:
			return 0;
		case 1:
			return 1;
		case 2:
			return 2;
		default:
			return 3;
	}
};
var $elm$browser$Browser$External = function (a) {
	return {$: 1, a: a};
};
var $elm$browser$Browser$Internal = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Basics$identity = function (x) {
	return x;
};
var $elm$browser$Browser$Dom$NotFound = $elm$core$Basics$identity;
var $elm$url$Url$Http = 0;
var $elm$url$Url$Https = 1;
var $elm$url$Url$Url = F6(
	function (protocol, host, port_, path, query, fragment) {
		return {b1: fragment, b6: host, cq: path, cu: port_, cx: protocol, cy: query};
	});
var $elm$core$String$contains = _String_contains;
var $elm$core$String$length = _String_length;
var $elm$core$String$slice = _String_slice;
var $elm$core$String$dropLeft = F2(
	function (n, string) {
		return (n < 1) ? string : A3(
			$elm$core$String$slice,
			n,
			$elm$core$String$length(string),
			string);
	});
var $elm$core$String$indexes = _String_indexes;
var $elm$core$String$isEmpty = function (string) {
	return string === '';
};
var $elm$core$String$left = F2(
	function (n, string) {
		return (n < 1) ? '' : A3($elm$core$String$slice, 0, n, string);
	});
var $elm$core$String$toInt = _String_toInt;
var $elm$url$Url$chompBeforePath = F5(
	function (protocol, path, params, frag, str) {
		if ($elm$core$String$isEmpty(str) || A2($elm$core$String$contains, '@', str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, ':', str);
			if (!_v0.b) {
				return $elm$core$Maybe$Just(
					A6($elm$url$Url$Url, protocol, str, $elm$core$Maybe$Nothing, path, params, frag));
			} else {
				if (!_v0.b.b) {
					var i = _v0.a;
					var _v1 = $elm$core$String$toInt(
						A2($elm$core$String$dropLeft, i + 1, str));
					if (_v1.$ === 1) {
						return $elm$core$Maybe$Nothing;
					} else {
						var port_ = _v1;
						return $elm$core$Maybe$Just(
							A6(
								$elm$url$Url$Url,
								protocol,
								A2($elm$core$String$left, i, str),
								port_,
								path,
								params,
								frag));
					}
				} else {
					return $elm$core$Maybe$Nothing;
				}
			}
		}
	});
var $elm$url$Url$chompBeforeQuery = F4(
	function (protocol, params, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '/', str);
			if (!_v0.b) {
				return A5($elm$url$Url$chompBeforePath, protocol, '/', params, frag, str);
			} else {
				var i = _v0.a;
				return A5(
					$elm$url$Url$chompBeforePath,
					protocol,
					A2($elm$core$String$dropLeft, i, str),
					params,
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompBeforeFragment = F3(
	function (protocol, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '?', str);
			if (!_v0.b) {
				return A4($elm$url$Url$chompBeforeQuery, protocol, $elm$core$Maybe$Nothing, frag, str);
			} else {
				var i = _v0.a;
				return A4(
					$elm$url$Url$chompBeforeQuery,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompAfterProtocol = F2(
	function (protocol, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '#', str);
			if (!_v0.b) {
				return A3($elm$url$Url$chompBeforeFragment, protocol, $elm$core$Maybe$Nothing, str);
			} else {
				var i = _v0.a;
				return A3(
					$elm$url$Url$chompBeforeFragment,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$core$String$startsWith = _String_startsWith;
var $elm$url$Url$fromString = function (str) {
	return A2($elm$core$String$startsWith, 'http://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		0,
		A2($elm$core$String$dropLeft, 7, str)) : (A2($elm$core$String$startsWith, 'https://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		1,
		A2($elm$core$String$dropLeft, 8, str)) : $elm$core$Maybe$Nothing);
};
var $elm$core$Basics$never = function (_v0) {
	never:
	while (true) {
		var nvr = _v0;
		var $temp$_v0 = nvr;
		_v0 = $temp$_v0;
		continue never;
	}
};
var $elm$core$Task$Perform = $elm$core$Basics$identity;
var $elm$core$Task$succeed = _Scheduler_succeed;
var $elm$core$Task$init = $elm$core$Task$succeed(0);
var $elm$core$List$foldrHelper = F4(
	function (fn, acc, ctr, ls) {
		if (!ls.b) {
			return acc;
		} else {
			var a = ls.a;
			var r1 = ls.b;
			if (!r1.b) {
				return A2(fn, a, acc);
			} else {
				var b = r1.a;
				var r2 = r1.b;
				if (!r2.b) {
					return A2(
						fn,
						a,
						A2(fn, b, acc));
				} else {
					var c = r2.a;
					var r3 = r2.b;
					if (!r3.b) {
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(fn, c, acc)));
					} else {
						var d = r3.a;
						var r4 = r3.b;
						var res = (ctr > 500) ? A3(
							$elm$core$List$foldl,
							fn,
							acc,
							$elm$core$List$reverse(r4)) : A4($elm$core$List$foldrHelper, fn, acc, ctr + 1, r4);
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(
									fn,
									c,
									A2(fn, d, res))));
					}
				}
			}
		}
	});
var $elm$core$List$foldr = F3(
	function (fn, acc, ls) {
		return A4($elm$core$List$foldrHelper, fn, acc, 0, ls);
	});
var $elm$core$List$map = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, acc) {
					return A2(
						$elm$core$List$cons,
						f(x),
						acc);
				}),
			_List_Nil,
			xs);
	});
var $elm$core$Task$andThen = _Scheduler_andThen;
var $elm$core$Task$map = F2(
	function (func, taskA) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return $elm$core$Task$succeed(
					func(a));
			},
			taskA);
	});
var $elm$core$Task$map2 = F3(
	function (func, taskA, taskB) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return A2(
					$elm$core$Task$andThen,
					function (b) {
						return $elm$core$Task$succeed(
							A2(func, a, b));
					},
					taskB);
			},
			taskA);
	});
var $elm$core$Task$sequence = function (tasks) {
	return A3(
		$elm$core$List$foldr,
		$elm$core$Task$map2($elm$core$List$cons),
		$elm$core$Task$succeed(_List_Nil),
		tasks);
};
var $elm$core$Platform$sendToApp = _Platform_sendToApp;
var $elm$core$Task$spawnCmd = F2(
	function (router, _v0) {
		var task = _v0;
		return _Scheduler_spawn(
			A2(
				$elm$core$Task$andThen,
				$elm$core$Platform$sendToApp(router),
				task));
	});
var $elm$core$Task$onEffects = F3(
	function (router, commands, state) {
		return A2(
			$elm$core$Task$map,
			function (_v0) {
				return 0;
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Task$spawnCmd(router),
					commands)));
	});
var $elm$core$Task$onSelfMsg = F3(
	function (_v0, _v1, _v2) {
		return $elm$core$Task$succeed(0);
	});
var $elm$core$Task$cmdMap = F2(
	function (tagger, _v0) {
		var task = _v0;
		return A2($elm$core$Task$map, tagger, task);
	});
_Platform_effectManagers['Task'] = _Platform_createManager($elm$core$Task$init, $elm$core$Task$onEffects, $elm$core$Task$onSelfMsg, $elm$core$Task$cmdMap);
var $elm$core$Task$command = _Platform_leaf('Task');
var $elm$core$Task$perform = F2(
	function (toMessage, task) {
		return $elm$core$Task$command(
			A2($elm$core$Task$map, toMessage, task));
	});
var $elm$browser$Browser$element = _Browser_element;
var $author$project$Main$SettingsScreen = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Array$repeat = F2(
	function (n, e) {
		return A2(
			$elm$core$Array$initialize,
			n,
			function (_v0) {
				return e;
			});
	});
var $author$project$Settings$default = {
	a2: 0.3,
	N: 50,
	X: 50,
	dw: 5,
	af: 3,
	cs: A2($elm$core$Array$repeat, 2, 0),
	c: 2,
	dY: 0
};
var $elm$core$Platform$Cmd$batch = _Platform_batch;
var $elm$core$Platform$Cmd$none = $elm$core$Platform$Cmd$batch(_List_Nil);
var $author$project$Main$init = _Utils_Tuple2(
	$author$project$Main$SettingsScreen($author$project$Settings$default),
	$elm$core$Platform$Cmd$none);
var $elm$core$Platform$Sub$batch = _Platform_batch;
var $elm$core$Platform$Sub$none = $elm$core$Platform$Sub$batch(_List_Nil);
var $author$project$Main$StartGameNow = function (a) {
	return {$: 5, a: a};
};
var $author$project$Models$Negative = 1;
var $elm$core$Dict$RBEmpty_elm_builtin = {$: -2};
var $elm$core$Dict$empty = $elm$core$Dict$RBEmpty_elm_builtin;
var $author$project$Models$emptyBoard = function (boardConfig) {
	return {bW: boardConfig, r: $elm$core$Dict$empty, aG: $elm$core$Dict$empty, aJ: $elm$core$Dict$empty, af: boardConfig.af, be: $elm$core$Dict$empty, s: $elm$core$Dict$empty, E: $elm$core$Dict$empty, aB: $elm$core$Dict$empty, bk: $elm$core$Dict$empty, ai: $elm$core$Dict$empty};
};
var $elm$core$Dict$Black = 1;
var $elm$core$Dict$RBNode_elm_builtin = F5(
	function (a, b, c, d, e) {
		return {$: -1, a: a, b: b, c: c, d: d, e: e};
	});
var $elm$core$Dict$Red = 0;
var $elm$core$Dict$balance = F5(
	function (color, key, value, left, right) {
		if ((right.$ === -1) && (!right.a)) {
			var _v1 = right.a;
			var rK = right.b;
			var rV = right.c;
			var rLeft = right.d;
			var rRight = right.e;
			if ((left.$ === -1) && (!left.a)) {
				var _v3 = left.a;
				var lK = left.b;
				var lV = left.c;
				var lLeft = left.d;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					0,
					key,
					value,
					A5($elm$core$Dict$RBNode_elm_builtin, 1, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 1, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					rK,
					rV,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, left, rLeft),
					rRight);
			}
		} else {
			if ((((left.$ === -1) && (!left.a)) && (left.d.$ === -1)) && (!left.d.a)) {
				var _v5 = left.a;
				var lK = left.b;
				var lV = left.c;
				var _v6 = left.d;
				var _v7 = _v6.a;
				var llK = _v6.b;
				var llV = _v6.c;
				var llLeft = _v6.d;
				var llRight = _v6.e;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					0,
					lK,
					lV,
					A5($elm$core$Dict$RBNode_elm_builtin, 1, llK, llV, llLeft, llRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 1, key, value, lRight, right));
			} else {
				return A5($elm$core$Dict$RBNode_elm_builtin, color, key, value, left, right);
			}
		}
	});
var $elm$core$Basics$compare = _Utils_compare;
var $elm$core$Dict$insertHelp = F3(
	function (key, value, dict) {
		if (dict.$ === -2) {
			return A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, $elm$core$Dict$RBEmpty_elm_builtin, $elm$core$Dict$RBEmpty_elm_builtin);
		} else {
			var nColor = dict.a;
			var nKey = dict.b;
			var nValue = dict.c;
			var nLeft = dict.d;
			var nRight = dict.e;
			var _v1 = A2($elm$core$Basics$compare, key, nKey);
			switch (_v1) {
				case 0:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						A3($elm$core$Dict$insertHelp, key, value, nLeft),
						nRight);
				case 1:
					return A5($elm$core$Dict$RBNode_elm_builtin, nColor, nKey, value, nLeft, nRight);
				default:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						nLeft,
						A3($elm$core$Dict$insertHelp, key, value, nRight));
			}
		}
	});
var $elm$core$Dict$insert = F3(
	function (key, value, dict) {
		var _v0 = A3($elm$core$Dict$insertHelp, key, value, dict);
		if ((_v0.$ === -1) && (!_v0.a)) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, 1, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Dict$fromList = function (assocs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, dict) {
				var key = _v0.a;
				var value = _v0.b;
				return A3($elm$core$Dict$insert, key, value, dict);
			}),
		$elm$core$Dict$empty,
		assocs);
};
var $elm$core$Bitwise$and = _Bitwise_and;
var $elm$core$Bitwise$shiftRightZfBy = _Bitwise_shiftRightZfBy;
var $elm$core$Array$bitMask = 4294967295 >>> (32 - $elm$core$Array$shiftStep);
var $elm$core$Basics$ge = _Utils_ge;
var $elm$core$Elm$JsArray$unsafeGet = _JsArray_unsafeGet;
var $elm$core$Array$getHelp = F3(
	function (shift, index, tree) {
		getHelp:
		while (true) {
			var pos = $elm$core$Array$bitMask & (index >>> shift);
			var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, pos, tree);
			if (!_v0.$) {
				var subTree = _v0.a;
				var $temp$shift = shift - $elm$core$Array$shiftStep,
					$temp$index = index,
					$temp$tree = subTree;
				shift = $temp$shift;
				index = $temp$index;
				tree = $temp$tree;
				continue getHelp;
			} else {
				var values = _v0.a;
				return A2($elm$core$Elm$JsArray$unsafeGet, $elm$core$Array$bitMask & index, values);
			}
		}
	});
var $elm$core$Bitwise$shiftLeftBy = _Bitwise_shiftLeftBy;
var $elm$core$Array$tailIndex = function (len) {
	return (len >>> 5) << 5;
};
var $elm$core$Array$get = F2(
	function (index, _v0) {
		var len = _v0.a;
		var startShift = _v0.b;
		var tree = _v0.c;
		var tail = _v0.d;
		return ((index < 0) || (_Utils_cmp(index, len) > -1)) ? $elm$core$Maybe$Nothing : ((_Utils_cmp(
			index,
			$elm$core$Array$tailIndex(len)) > -1) ? $elm$core$Maybe$Just(
			A2($elm$core$Elm$JsArray$unsafeGet, $elm$core$Array$bitMask & index, tail)) : $elm$core$Maybe$Just(
			A3($elm$core$Array$getHelp, startShift, index, tree)));
	});
var $author$project$Game$AIEasy = 1;
var $author$project$Game$AIHard = 2;
var $author$project$Game$Human = 0;
var $author$project$Game$getAgentFromInt = function (agent) {
	switch (agent) {
		case 0:
			return 0;
		case 1:
			return 1;
		case 2:
			return 2;
		default:
			return 0;
	}
};
var $author$project$Game$getBoardConfig = function (settings) {
	var padding = settings.af;
	var gridSize = settings.N;
	var cellSize = (600 / settings.N) | 0;
	return {dd: cellSize * (gridSize + (padding * 2)), bz: settings.N, af: settings.af};
};
var $author$project$Game$AI = function (a) {
	return {$: 3, a: a};
};
var $author$project$Game$HumanMove = {$: 0};
var $elm$core$Maybe$withDefault = F2(
	function (_default, maybe) {
		if (!maybe.$) {
			var value = maybe.a;
			return value;
		} else {
			return _default;
		}
	});
var $author$project$Game$getInitGameStatus = function (settings) {
	var firstPlayerAgency = $author$project$Game$getAgentFromInt(
		A2(
			$elm$core$Maybe$withDefault,
			0,
			A2($elm$core$Array$get, 0, settings.cs)));
	switch (firstPlayerAgency) {
		case 0:
			return $author$project$Game$HumanMove;
		case 1:
			return $author$project$Game$AI(0);
		default:
			return $author$project$Game$AI(1);
	}
};
var $elm$random$Random$Seed = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$random$Random$next = function (_v0) {
	var state0 = _v0.a;
	var incr = _v0.b;
	return A2($elm$random$Random$Seed, ((state0 * 1664525) + incr) >>> 0, incr);
};
var $elm$random$Random$initialSeed = function (x) {
	var _v0 = $elm$random$Random$next(
		A2($elm$random$Random$Seed, 0, 1013904223));
	var state1 = _v0.a;
	var incr = _v0.b;
	var state2 = (state1 + x) >>> 0;
	return $elm$random$Random$next(
		A2($elm$random$Random$Seed, state2, incr));
};
var $elm$core$Basics$min = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) < 0) ? x : y;
	});
var $author$project$Game$GenerateAIMove = function (a) {
	return {$: 1, a: a};
};
var $author$project$Game$UpdateBoard = function (a) {
	return {$: 3, a: a};
};
var $elm$core$List$append = F2(
	function (xs, ys) {
		if (!ys.b) {
			return xs;
		} else {
			return A3($elm$core$List$foldr, $elm$core$List$cons, ys, xs);
		}
	});
var $elm$core$Process$sleep = _Process_sleep;
var $author$project$Game$send = F2(
	function (wait, msg) {
		return A2(
			$elm$core$Task$perform,
			function (_v0) {
				return msg;
			},
			$elm$core$Process$sleep(wait));
	});
var $author$project$Game$determineUpdateCommand = F3(
	function (previousGame, previousStates, game) {
		var _v0 = game.d;
		_v0$3:
		while (true) {
			switch (_v0.$) {
				case 1:
					return A2(
						$author$project$Game$send,
						50.0,
						$author$project$Game$UpdateBoard(
							A2(
								$elm$core$List$append,
								previousStates,
								_List_fromArray(
									[previousGame.b]))));
				case 3:
					switch (_v0.a) {
						case 0:
							return A2(
								$author$project$Game$send,
								100.0,
								$author$project$Game$GenerateAIMove(0));
						case 1:
							return A2(
								$author$project$Game$send,
								100.0,
								$author$project$Game$GenerateAIMove(game.ab));
						default:
							break _v0$3;
					}
				default:
					break _v0$3;
			}
		}
		return $elm$core$Platform$Cmd$none;
	});
var $author$project$Game$withCmd = F2(
	function (cmd, game) {
		return _Utils_Tuple2(game, cmd);
	});
var $author$project$Game$withDetermineUpdateCommand = F3(
	function (prevGame, previousStates, game) {
		return A2(
			$author$project$Game$withCmd,
			A3($author$project$Game$determineUpdateCommand, prevGame, previousStates, game),
			game);
	});
var $author$project$Game$init = function (settings) {
	var initialGame = {
		ab: A2($elm$core$Basics$min, 100, settings.N) * 2,
		ak: 0,
		b: $author$project$Models$emptyBoard(
			$author$project$Game$getBoardConfig(settings)),
		a2: settings.a2,
		N: settings.N,
		X: settings.X,
		af: settings.af,
		ct: 1,
		c: $elm$core$Dict$fromList(
			A2(
				$elm$core$List$map,
				function (player) {
					return _Utils_Tuple2(
						player,
						{
							bo: $author$project$Game$getAgentFromInt(
								A2(
									$elm$core$Maybe$withDefault,
									0,
									A2($elm$core$Array$get, player, settings.cs))),
							y: 1,
							ay: settings.dw,
							z: 0.0
						});
				},
				A2($elm$core$List$range, 0, settings.c - 1))),
		l: {
			Z: {y: 1, cP: (settings.N / 2) | 0, cQ: (settings.N / 2) | 0},
			z: $elm$core$Maybe$Nothing,
			J: $elm$random$Random$initialSeed(settings.dY)
		},
		cE: settings,
		d: $author$project$Game$getInitGameStatus(settings),
		aR: 0,
		t: 0
	};
	return function (game) {
		return A3($author$project$Game$withDetermineUpdateCommand, game, _List_Nil, game);
	}(initialGame);
};
var $author$project$Main$GameplayMsg = function (a) {
	return {$: 1, a: a};
};
var $author$project$Main$GameplayScreen = function (a) {
	return {$: 1, a: a};
};
var $elm$core$Platform$Cmd$map = _Platform_map;
var $author$project$Main$mapGameCmd = function (_v0) {
	var game = _v0.a;
	var cmd = _v0.b;
	return _Utils_Tuple2(
		$author$project$Main$GameplayScreen(game),
		A2($elm$core$Platform$Cmd$map, $author$project$Main$GameplayMsg, cmd));
};
var $elm$time$Time$Name = function (a) {
	return {$: 0, a: a};
};
var $elm$time$Time$Offset = function (a) {
	return {$: 1, a: a};
};
var $elm$time$Time$Zone = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$time$Time$customZone = $elm$time$Time$Zone;
var $elm$time$Time$Posix = $elm$core$Basics$identity;
var $elm$time$Time$millisToPosix = $elm$core$Basics$identity;
var $elm$time$Time$now = _Time_now($elm$time$Time$millisToPosix);
var $elm$time$Time$posixToMillis = function (_v0) {
	var millis = _v0;
	return millis;
};
var $author$project$Game$DisplayPiece = F2(
	function (a, b) {
		return {$: 2, a: a, b: b};
	});
var $author$project$Game$PlacePiece = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $author$project$Game$PlayAIMove = {$: 2};
var $author$project$Game$SelectPolarity = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $author$project$Game$alwaysCommand = F2(
	function (msg, _v0) {
		var game = _v0.W;
		var status = _v0.d;
		return _Utils_Tuple2(game, msg);
	});
var $author$project$Game$Failure = 1;
var $author$project$Game$Success = 0;
var $elm$core$List$filter = F2(
	function (isGood, list) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, xs) {
					return isGood(x) ? A2($elm$core$List$cons, x, xs) : xs;
				}),
			_List_Nil,
			list);
	});
var $elm$core$List$maybeCons = F3(
	function (f, mx, xs) {
		var _v0 = f(mx);
		if (!_v0.$) {
			var x = _v0.a;
			return A2($elm$core$List$cons, x, xs);
		} else {
			return xs;
		}
	});
var $elm$core$List$filterMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			$elm$core$List$maybeCons(f),
			_List_Nil,
			xs);
	});
var $elm$core$Maybe$andThen = F2(
	function (callback, maybeValue) {
		if (!maybeValue.$) {
			var value = maybeValue.a;
			return callback(value);
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $author$project$Utils$Utils$coordinateToTuple = function (coordinate) {
	return _Utils_Tuple2(coordinate.cP, coordinate.cQ);
};
var $elm$core$Dict$get = F2(
	function (targetKey, dict) {
		get:
		while (true) {
			if (dict.$ === -2) {
				return $elm$core$Maybe$Nothing;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var _v1 = A2($elm$core$Basics$compare, targetKey, key);
				switch (_v1) {
					case 0:
						var $temp$targetKey = targetKey,
							$temp$dict = left;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
					case 1:
						return $elm$core$Maybe$Just(value);
					default:
						var $temp$targetKey = targetKey,
							$temp$dict = right;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
				}
			}
		}
	});
var $author$project$Models$getPieceFromCoordinate = F2(
	function (board, coordinate) {
		var pieceIndex = A2(
			$elm$core$Dict$get,
			$author$project$Utils$Utils$coordinateToTuple(coordinate),
			board.r);
		return A2(
			$elm$core$Maybe$andThen,
			function (index) {
				return A2($elm$core$Dict$get, index, board.E);
			},
			pieceIndex);
	});
var $author$project$Utils$Utils$getSurroundingCoordinates = function (coordinate) {
	var y = coordinate.cQ;
	var x = coordinate.cP;
	return _List_fromArray(
		[
			{cP: x, cQ: y},
			{cP: x - 1, cQ: y},
			{cP: x, cQ: y - 1},
			{cP: x, cQ: y + 1},
			{cP: x + 1, cQ: y}
		]);
};
var $elm$core$List$isEmpty = function (xs) {
	if (!xs.b) {
		return true;
	} else {
		return false;
	}
};
var $elm$core$Basics$neq = _Utils_notEqual;
var $author$project$Models$checkValidPiecePlacement = F3(
	function (coordinate, toOmit, board) {
		var allCheckedCoordinates = $author$project$Utils$Utils$getSurroundingCoordinates(coordinate);
		var checkedCoordinates = function () {
			if (!toOmit.$) {
				var omit = toOmit.a;
				return A2(
					$elm$core$List$filter,
					function (coord) {
						return !_Utils_eq(coord, omit);
					},
					allCheckedCoordinates);
			} else {
				return allCheckedCoordinates;
			}
		}();
		return $elm$core$List$isEmpty(
			A2(
				$elm$core$List$filterMap,
				function (coord) {
					return A2($author$project$Models$getPieceFromCoordinate, board, coord);
				},
				checkedCoordinates));
	});
var $elm$core$List$maximum = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(
			A3($elm$core$List$foldl, $elm$core$Basics$max, x, xs));
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Models$insertPiece = F3(
	function (piece, coordinate, board) {
		var pieceIndex = A2(
			$elm$core$Maybe$withDefault,
			0,
			$elm$core$List$maximum(
				$elm$core$Dict$keys(board.E))) + 1;
		return _Utils_update(
			board,
			{
				r: A3(
					$elm$core$Dict$insert,
					$author$project$Utils$Utils$coordinateToTuple(coordinate),
					pieceIndex,
					board.r),
				be: A3($elm$core$Dict$insert, pieceIndex, coordinate, board.be),
				E: A3($elm$core$Dict$insert, pieceIndex, piece, board.E)
			});
	});
var $author$project$Models$insertTentativePiece = F3(
	function (piece, coordinate, board) {
		var pieceIndex = 9999;
		return _Utils_update(
			board,
			{
				aB: $elm$core$Dict$fromList(
					_List_fromArray(
						[
							_Utils_Tuple2(
							$author$project$Utils$Utils$coordinateToTuple(coordinate),
							pieceIndex)
						])),
				bk: $elm$core$Dict$fromList(
					_List_fromArray(
						[
							_Utils_Tuple2(pieceIndex, coordinate)
						])),
				ai: $elm$core$Dict$fromList(
					_List_fromArray(
						[
							_Utils_Tuple2(pieceIndex, piece)
						]))
			});
	});
var $author$project$Utils$Utils$intCoordinateToFloat = function (_v0) {
	var x = _v0.cP;
	var y = _v0.cQ;
	return {cP: x, cQ: y};
};
var $author$project$Models$removeTentativePieces = function (board) {
	return _Utils_update(
		board,
		{aB: $elm$core$Dict$empty, bk: $elm$core$Dict$empty, ai: $elm$core$Dict$empty});
};
var $elm$core$List$concat = function (lists) {
	return A3($elm$core$List$foldr, $elm$core$List$append, _List_Nil, lists);
};
var $author$project$Models$emptyMagneticField = {
	P: {cP: 0, cQ: 0},
	p: $elm$core$Dict$empty,
	S: {cP: 0, cQ: 0}
};
var $elm$core$Dict$foldl = F3(
	function (func, acc, dict) {
		foldl:
		while (true) {
			if (dict.$ === -2) {
				return acc;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldl, func, acc, left)),
					$temp$dict = right;
				func = $temp$func;
				acc = $temp$acc;
				dict = $temp$dict;
				continue foldl;
			}
		}
	});
var $author$project$Utils$Utils$combineDicts = F2(
	function (dict1, dict2) {
		return A3(
			$elm$core$Dict$foldl,
			F3(
				function (key, value, existing) {
					return A3($elm$core$Dict$insert, key, value, existing);
				}),
			dict1,
			dict2);
	});
var $author$project$Utils$Utils$coordinateFromTuple = function (_v0) {
	var x = _v0.a;
	var y = _v0.b;
	return {cP: x, cQ: y};
};
var $elm$core$Maybe$map = F2(
	function (f, maybe) {
		if (!maybe.$) {
			var value = maybe.a;
			return $elm$core$Maybe$Just(
				f(value));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $author$project$Models$getCoordinatePieces = function (board) {
	var allPieces = A2($author$project$Utils$Utils$combineDicts, board.E, board.ai);
	var allCoordinatePieces = A2($author$project$Utils$Utils$combineDicts, board.r, board.aB);
	return A2(
		$elm$core$List$filterMap,
		function (_v0) {
			var coordinate = _v0.a;
			var pieceIndex = _v0.b;
			return A2(
				$elm$core$Maybe$map,
				function (piece) {
					return _Utils_Tuple3(
						pieceIndex,
						$author$project$Utils$Utils$coordinateFromTuple(coordinate),
						piece);
				},
				A2($elm$core$Dict$get, pieceIndex, allPieces));
		},
		$elm$core$Dict$toList(allCoordinatePieces));
};
var $elm$core$Basics$negate = function (n) {
	return -n;
};
var $elm$core$Basics$abs = function (n) {
	return (n < 0) ? (-n) : n;
};
var $elm$core$Basics$pow = _Basics_pow;
var $elm$core$Basics$sqrt = _Basics_sqrt;
var $author$project$Utils$Utils$euclideanDistance = F2(
	function (coordinate1, coordinate2) {
		var yDiff = coordinate1.cQ - coordinate2.cQ;
		var xDiff = coordinate1.cP - coordinate2.cP;
		return $elm$core$Basics$sqrt(
			A2($elm$core$Basics$pow, xDiff, 2) + A2($elm$core$Basics$pow, yDiff, 2));
	});
var $author$project$Utils$PhysicsUtils$calculateForceVector = F3(
	function (magnetism, coordinate, pieceCoordinate) {
		var eDistance = A2($author$project$Utils$Utils$euclideanDistance, coordinate, pieceCoordinate);
		var magnetStrength = (!eDistance) ? 0 : (magnetism / A2($elm$core$Basics$pow, eDistance, 2));
		var distanceVector = {cP: coordinate.cP - pieceCoordinate.cP, cQ: coordinate.cQ - pieceCoordinate.cQ};
		var distanceVectorSum = $elm$core$Basics$abs(distanceVector.cP) + $elm$core$Basics$abs(distanceVector.cQ);
		var resultantVector = {cP: (distanceVector.cP * magnetStrength) / distanceVectorSum, cQ: (distanceVector.cQ * magnetStrength) / distanceVectorSum};
		return _Utils_Tuple2(resultantVector, magnetStrength);
	});
var $author$project$Models$getFieldFromPieceAtCoordinate = F4(
	function (magnetism, coordinate, pieceCoordinate, piece) {
		if (_Utils_eq(
			$author$project$Utils$Utils$intCoordinateToFloat(coordinate),
			pieceCoordinate)) {
			return $author$project$Models$emptyMagneticField;
		} else {
			var floatCoordinate = $author$project$Utils$Utils$intCoordinateToFloat(coordinate);
			var _v0 = A3($author$project$Utils$PhysicsUtils$calculateForceVector, magnetism, floatCoordinate, pieceCoordinate);
			var resultantVector = _v0.a;
			var magnetStrength = _v0.b;
			var _v1 = piece.y;
			switch (_v1) {
				case 0:
					return {
						P: {cP: 0, cQ: 0},
						p: $elm$core$Dict$fromList(
							_List_fromArray(
								[
									_Utils_Tuple2(piece.bf, magnetStrength)
								])),
						S: resultantVector
					};
				case 1:
					return {
						P: resultantVector,
						p: $elm$core$Dict$fromList(
							_List_fromArray(
								[
									_Utils_Tuple2(piece.bf, magnetStrength)
								])),
						S: {cP: 0, cQ: 0}
					};
				default:
					return {
						P: {cP: 0, cQ: 0},
						p: $elm$core$Dict$empty,
						S: {cP: 0, cQ: 0}
					};
			}
		}
	});
var $author$project$Utils$Utils$addDicts = F2(
	function (dict1, dict2) {
		return A3(
			$elm$core$Dict$foldl,
			F3(
				function (key, value, existing) {
					var _v0 = A2($elm$core$Dict$get, key, existing);
					if (_v0.$ === 1) {
						return A3($elm$core$Dict$insert, key, value, existing);
					} else {
						var value2 = _v0.a;
						return A3($elm$core$Dict$insert, key, value + value2, existing);
					}
				}),
			dict1,
			dict2);
	});
var $author$project$Models$mergeMagneticFields = F2(
	function (field1, field2) {
		return {
			P: {cP: field1.P.cP + field2.P.cP, cQ: field1.P.cQ + field2.P.cQ},
			p: A2($author$project$Utils$Utils$addDicts, field1.p, field2.p),
			S: {cP: field1.S.cP + field2.S.cP, cQ: field1.S.cQ + field2.S.cQ}
		};
	});
var $author$project$Models$getMagneticFieldForCoordinate = F3(
	function (board, magnetism, coordinate) {
		var coordinatePieces = $author$project$Models$getCoordinatePieces(board);
		return A3(
			$elm$core$List$foldl,
			F2(
				function (_v0, existingFields) {
					var coord = _v0.b;
					var piece = _v0.c;
					return A2(
						$author$project$Models$mergeMagneticFields,
						existingFields,
						A4($author$project$Models$getFieldFromPieceAtCoordinate, magnetism, coordinate, coord, piece));
				}),
			$author$project$Models$emptyMagneticField,
			coordinatePieces);
	});
var $author$project$Utils$Utils$intCoordinateToTuple = function (coordinate) {
	return _Utils_Tuple2(coordinate.cP, coordinate.cQ);
};
var $author$project$Models$getBoardMagneticFieldRec = F4(
	function (board, magnetism, remainingCoordinates, magneticFields) {
		getBoardMagneticFieldRec:
		while (true) {
			if (!remainingCoordinates.b) {
				return magneticFields;
			} else {
				var coordinate = remainingCoordinates.a;
				var rest = remainingCoordinates.b;
				var currentField = A3($author$project$Models$getMagneticFieldForCoordinate, board, magnetism, coordinate);
				var $temp$board = board,
					$temp$magnetism = magnetism,
					$temp$remainingCoordinates = rest,
					$temp$magneticFields = A3(
					$elm$core$Dict$insert,
					$author$project$Utils$Utils$intCoordinateToTuple(coordinate),
					currentField,
					magneticFields);
				board = $temp$board;
				magnetism = $temp$magnetism;
				remainingCoordinates = $temp$remainingCoordinates;
				magneticFields = $temp$magneticFields;
				continue getBoardMagneticFieldRec;
			}
		}
	});
var $author$project$Models$getBoardMagneticField = F2(
	function (board, magnetism) {
		var allCoordinates = $elm$core$List$concat(
			A2(
				$elm$core$List$map,
				function (x) {
					return A2(
						$elm$core$List$map,
						function (y) {
							return {cP: x, cQ: y};
						},
						A2($elm$core$List$range, 0, board.bW.bz - 1));
				},
				A2($elm$core$List$range, 0, board.bW.bz - 1)));
		return A4($author$project$Models$getBoardMagneticFieldRec, board, magnetism, allCoordinates, $elm$core$Dict$empty);
	});
var $author$project$Models$updateBoardMagneticField = F2(
	function (magnetism, board) {
		return _Utils_update(
			board,
			{
				aJ: A2($author$project$Models$getBoardMagneticField, board, magnetism)
			});
	});
var $elm$core$Dict$getMin = function (dict) {
	getMin:
	while (true) {
		if ((dict.$ === -1) && (dict.d.$ === -1)) {
			var left = dict.d;
			var $temp$dict = left;
			dict = $temp$dict;
			continue getMin;
		} else {
			return dict;
		}
	}
};
var $elm$core$Dict$moveRedLeft = function (dict) {
	if (((dict.$ === -1) && (dict.d.$ === -1)) && (dict.e.$ === -1)) {
		if ((dict.e.d.$ === -1) && (!dict.e.d.a)) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var lLeft = _v1.d;
			var lRight = _v1.e;
			var _v2 = dict.e;
			var rClr = _v2.a;
			var rK = _v2.b;
			var rV = _v2.c;
			var rLeft = _v2.d;
			var _v3 = rLeft.a;
			var rlK = rLeft.b;
			var rlV = rLeft.c;
			var rlL = rLeft.d;
			var rlR = rLeft.e;
			var rRight = _v2.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				0,
				rlK,
				rlV,
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					rlL),
				A5($elm$core$Dict$RBNode_elm_builtin, 1, rK, rV, rlR, rRight));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v4 = dict.d;
			var lClr = _v4.a;
			var lK = _v4.b;
			var lV = _v4.c;
			var lLeft = _v4.d;
			var lRight = _v4.e;
			var _v5 = dict.e;
			var rClr = _v5.a;
			var rK = _v5.b;
			var rV = _v5.c;
			var rLeft = _v5.d;
			var rRight = _v5.e;
			if (clr === 1) {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$moveRedRight = function (dict) {
	if (((dict.$ === -1) && (dict.d.$ === -1)) && (dict.e.$ === -1)) {
		if ((dict.d.d.$ === -1) && (!dict.d.d.a)) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var _v2 = _v1.d;
			var _v3 = _v2.a;
			var llK = _v2.b;
			var llV = _v2.c;
			var llLeft = _v2.d;
			var llRight = _v2.e;
			var lRight = _v1.e;
			var _v4 = dict.e;
			var rClr = _v4.a;
			var rK = _v4.b;
			var rV = _v4.c;
			var rLeft = _v4.d;
			var rRight = _v4.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				0,
				lK,
				lV,
				A5($elm$core$Dict$RBNode_elm_builtin, 1, llK, llV, llLeft, llRight),
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					lRight,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight)));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v5 = dict.d;
			var lClr = _v5.a;
			var lK = _v5.b;
			var lV = _v5.c;
			var lLeft = _v5.d;
			var lRight = _v5.e;
			var _v6 = dict.e;
			var rClr = _v6.a;
			var rK = _v6.b;
			var rV = _v6.c;
			var rLeft = _v6.d;
			var rRight = _v6.e;
			if (clr === 1) {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$removeHelpPrepEQGT = F7(
	function (targetKey, dict, color, key, value, left, right) {
		if ((left.$ === -1) && (!left.a)) {
			var _v1 = left.a;
			var lK = left.b;
			var lV = left.c;
			var lLeft = left.d;
			var lRight = left.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				lK,
				lV,
				lLeft,
				A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, lRight, right));
		} else {
			_v2$2:
			while (true) {
				if ((right.$ === -1) && (right.a === 1)) {
					if (right.d.$ === -1) {
						if (right.d.a === 1) {
							var _v3 = right.a;
							var _v4 = right.d;
							var _v5 = _v4.a;
							return $elm$core$Dict$moveRedRight(dict);
						} else {
							break _v2$2;
						}
					} else {
						var _v6 = right.a;
						var _v7 = right.d;
						return $elm$core$Dict$moveRedRight(dict);
					}
				} else {
					break _v2$2;
				}
			}
			return dict;
		}
	});
var $elm$core$Dict$removeMin = function (dict) {
	if ((dict.$ === -1) && (dict.d.$ === -1)) {
		var color = dict.a;
		var key = dict.b;
		var value = dict.c;
		var left = dict.d;
		var lColor = left.a;
		var lLeft = left.d;
		var right = dict.e;
		if (lColor === 1) {
			if ((lLeft.$ === -1) && (!lLeft.a)) {
				var _v3 = lLeft.a;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					key,
					value,
					$elm$core$Dict$removeMin(left),
					right);
			} else {
				var _v4 = $elm$core$Dict$moveRedLeft(dict);
				if (_v4.$ === -1) {
					var nColor = _v4.a;
					var nKey = _v4.b;
					var nValue = _v4.c;
					var nLeft = _v4.d;
					var nRight = _v4.e;
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						$elm$core$Dict$removeMin(nLeft),
						nRight);
				} else {
					return $elm$core$Dict$RBEmpty_elm_builtin;
				}
			}
		} else {
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				key,
				value,
				$elm$core$Dict$removeMin(left),
				right);
		}
	} else {
		return $elm$core$Dict$RBEmpty_elm_builtin;
	}
};
var $elm$core$Dict$removeHelp = F2(
	function (targetKey, dict) {
		if (dict.$ === -2) {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		} else {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_cmp(targetKey, key) < 0) {
				if ((left.$ === -1) && (left.a === 1)) {
					var _v4 = left.a;
					var lLeft = left.d;
					if ((lLeft.$ === -1) && (!lLeft.a)) {
						var _v6 = lLeft.a;
						return A5(
							$elm$core$Dict$RBNode_elm_builtin,
							color,
							key,
							value,
							A2($elm$core$Dict$removeHelp, targetKey, left),
							right);
					} else {
						var _v7 = $elm$core$Dict$moveRedLeft(dict);
						if (_v7.$ === -1) {
							var nColor = _v7.a;
							var nKey = _v7.b;
							var nValue = _v7.c;
							var nLeft = _v7.d;
							var nRight = _v7.e;
							return A5(
								$elm$core$Dict$balance,
								nColor,
								nKey,
								nValue,
								A2($elm$core$Dict$removeHelp, targetKey, nLeft),
								nRight);
						} else {
							return $elm$core$Dict$RBEmpty_elm_builtin;
						}
					}
				} else {
					return A5(
						$elm$core$Dict$RBNode_elm_builtin,
						color,
						key,
						value,
						A2($elm$core$Dict$removeHelp, targetKey, left),
						right);
				}
			} else {
				return A2(
					$elm$core$Dict$removeHelpEQGT,
					targetKey,
					A7($elm$core$Dict$removeHelpPrepEQGT, targetKey, dict, color, key, value, left, right));
			}
		}
	});
var $elm$core$Dict$removeHelpEQGT = F2(
	function (targetKey, dict) {
		if (dict.$ === -1) {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_eq(targetKey, key)) {
				var _v1 = $elm$core$Dict$getMin(right);
				if (_v1.$ === -1) {
					var minKey = _v1.b;
					var minValue = _v1.c;
					return A5(
						$elm$core$Dict$balance,
						color,
						minKey,
						minValue,
						left,
						$elm$core$Dict$removeMin(right));
				} else {
					return $elm$core$Dict$RBEmpty_elm_builtin;
				}
			} else {
				return A5(
					$elm$core$Dict$balance,
					color,
					key,
					value,
					left,
					A2($elm$core$Dict$removeHelp, targetKey, right));
			}
		} else {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		}
	});
var $elm$core$Dict$remove = F2(
	function (key, dict) {
		var _v0 = A2($elm$core$Dict$removeHelp, key, dict);
		if ((_v0.$ === -1) && (!_v0.a)) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, 1, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Dict$update = F3(
	function (targetKey, alter, dictionary) {
		var _v0 = alter(
			A2($elm$core$Dict$get, targetKey, dictionary));
		if (!_v0.$) {
			var value = _v0.a;
			return A3($elm$core$Dict$insert, targetKey, value, dictionary);
		} else {
			return A2($elm$core$Dict$remove, targetKey, dictionary);
		}
	});
var $author$project$Game$updatePlayerPolarity = F3(
	function (player, polarity, game) {
		return _Utils_update(
			game,
			{
				c: A3(
					$elm$core$Dict$update,
					player,
					$elm$core$Maybe$map(
						function (playerData) {
							return _Utils_update(
								playerData,
								{y: polarity});
						}),
					game.c)
			});
	});
var $author$project$Game$applyMove = F2(
	function (move, game) {
		switch (move.$) {
			case 0:
				var player = move.a;
				var polarity = move.b;
				return {
					W: A3($author$project$Game$updatePlayerPolarity, player, polarity, game),
					d: 0
				};
			case 1:
				var coordinate = move.a;
				var polarity = move.b;
				return A3(
					$author$project$Models$checkValidPiecePlacement,
					$author$project$Utils$Utils$intCoordinateToFloat(coordinate),
					$elm$core$Maybe$Nothing,
					game.b) ? {
					W: _Utils_update(
						game,
						{
							b: A2(
								$author$project$Models$updateBoardMagneticField,
								game.X,
								A3(
									$author$project$Models$insertPiece,
									{bf: game.t, y: polarity},
									$author$project$Utils$Utils$intCoordinateToFloat(coordinate),
									$author$project$Models$removeTentativePieces(game.b)))
						}),
					d: 0
				} : {W: game, d: 1};
			default:
				var coordinate = move.a;
				var polarity = move.b;
				return A3(
					$author$project$Models$checkValidPiecePlacement,
					$author$project$Utils$Utils$intCoordinateToFloat(coordinate),
					$elm$core$Maybe$Nothing,
					game.b) ? {
					W: _Utils_update(
						game,
						{
							b: A2(
								$author$project$Models$updateBoardMagneticField,
								game.X,
								A3(
									$author$project$Models$insertTentativePiece,
									{bf: game.t, y: polarity},
									$author$project$Utils$Utils$intCoordinateToFloat(coordinate),
									game.b))
						}),
					d: 0
				} : {
					W: _Utils_update(
						game,
						{
							b: A2(
								$author$project$Models$updateBoardMagneticField,
								game.X,
								$author$project$Models$removeTentativePieces(game.b))
						}),
					d: 1
				};
		}
	});
var $author$project$Models$mapViewCoordinateToBoard = F3(
	function (padding, boardSize, viewCoordinate) {
		var newY = viewCoordinate.cQ - padding;
		var newX = viewCoordinate.cP - padding;
		return ((newX >= 0) && ((newY >= 0) && ((_Utils_cmp(newX, boardSize) < 0) && (_Utils_cmp(newY, boardSize) < 0)))) ? $elm$core$Maybe$Just(
			{cP: newX, cQ: newY}) : $elm$core$Maybe$Nothing;
	});
var $author$project$Game$determineCellCoordinates = F2(
	function (game, cellMsg) {
		var boardCoordinate = A3(
			$author$project$Models$mapViewCoordinateToBoard,
			game.af,
			game.N,
			{cP: cellMsg.bq.bU, cQ: cellMsg.bq.cB});
		return boardCoordinate;
	});
var $author$project$Models$Positive = 0;
var $elm$core$Dict$map = F2(
	function (func, dict) {
		if (dict.$ === -2) {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		} else {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				key,
				A2(func, key, value),
				A2($elm$core$Dict$map, func, left),
				A2($elm$core$Dict$map, func, right));
		}
	});
var $author$project$Models$getFieldScore = function (field) {
	var totalFieldStrength = A3(
		$elm$core$Dict$foldl,
		F3(
			function (player, strength, total) {
				return total + strength;
			}),
		0,
		field.p);
	return A2(
		$elm$core$Dict$map,
		F2(
			function (player, strength) {
				return strength / totalFieldStrength;
			}),
		field.p);
};
var $author$project$Utils$Utils$intCoordinateFromTuple = function (_v0) {
	var x = _v0.a;
	var y = _v0.b;
	return {cP: x, cQ: y};
};
var $author$project$Models$getBoardScores = function (board) {
	var playerDict = $elm$core$Dict$fromList(
		_List_fromArray(
			[
				_Utils_Tuple2(0, 0),
				_Utils_Tuple2(1, 0),
				_Utils_Tuple2(2, 0),
				_Utils_Tuple2(3, 0)
			]));
	return A3(
		$elm$core$Dict$foldl,
		F3(
			function (coordinate, field, existing) {
				var _v0 = A2(
					$author$project$Models$getPieceFromCoordinate,
					board,
					$author$project$Utils$Utils$intCoordinateToFloat(
						$author$project$Utils$Utils$intCoordinateFromTuple(coordinate)));
				if (!_v0.$) {
					var piece = _v0.a;
					return A2(
						$author$project$Utils$Utils$addDicts,
						existing,
						$elm$core$Dict$fromList(
							_List_fromArray(
								[
									_Utils_Tuple2(piece.bf, 1.0)
								])));
				} else {
					return A2(
						$author$project$Utils$Utils$addDicts,
						existing,
						$author$project$Models$getFieldScore(field));
				}
			}),
		playerDict,
		board.aJ);
};
var $elm$core$Dict$sizeHelp = F2(
	function (n, dict) {
		sizeHelp:
		while (true) {
			if (dict.$ === -2) {
				return n;
			} else {
				var left = dict.d;
				var right = dict.e;
				var $temp$n = A2($elm$core$Dict$sizeHelp, n + 1, right),
					$temp$dict = left;
				n = $temp$n;
				dict = $temp$dict;
				continue sizeHelp;
			}
		}
	});
var $elm$core$Dict$size = function (dict) {
	return A2($elm$core$Dict$sizeHelp, 0, dict);
};
var $author$project$Game$getGameScore = function (game) {
	var scores = $elm$core$Dict$fromList(
		A2(
			$elm$core$List$map,
			function (player) {
				return _Utils_Tuple2(player, 0.0);
			},
			A2(
				$elm$core$List$range,
				0,
				$elm$core$Dict$size(game.c) - 1)));
	var boardScores = $author$project$Models$getBoardScores(game.b);
	return A2($author$project$Utils$Utils$addDicts, scores, boardScores);
};
var $elm$core$Dict$values = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, valueList) {
				return A2($elm$core$List$cons, value, valueList);
			}),
		_List_Nil,
		dict);
};
var $author$project$Game$getAvgScoreMargin = F2(
	function (player, game) {
		var scores = $author$project$Game$getGameScore(game);
		var playerScore = A2(
			$elm$core$Maybe$withDefault,
			0.0,
			A2($elm$core$Dict$get, player, scores));
		return function (x) {
			return x / ($elm$core$Dict$size(scores) - 1);
		}(
			A3(
				$elm$core$List$foldl,
				$elm$core$Basics$add,
				0.0,
				A2(
					$elm$core$List$map,
					function (otherScore) {
						return playerScore - otherScore;
					},
					$elm$core$Dict$values(scores))));
	});
var $author$project$Game$GameOver = {$: 2};
var $author$project$Game$checkGameOver = function (game) {
	return A3(
		$elm$core$Dict$foldl,
		F3(
			function (_v0, playerData, accum) {
				return (playerData.ay <= 0) && accum;
			}),
		true,
		game.c) ? true : false;
};
var $author$project$Game$getPlayerAgency = F2(
	function (player, game) {
		return A2(
			$elm$core$Maybe$withDefault,
			0,
			A2(
				$elm$core$Maybe$map,
				function (playerData) {
					return playerData.bo;
				},
				A2($elm$core$Dict$get, player, game.c)));
	});
var $author$project$Game$getGameStatus = function (game) {
	if ($author$project$Game$checkGameOver(game)) {
		return $author$project$Game$GameOver;
	} else {
		var _v0 = A2($author$project$Game$getPlayerAgency, game.t, game);
		switch (_v0) {
			case 0:
				return $author$project$Game$HumanMove;
			case 1:
				return $author$project$Game$AI(0);
			default:
				return $author$project$Game$AI(1);
		}
	}
};
var $elm$core$Basics$round = _Basics_round;
var $author$project$Utils$Utils$floatCoordinateToInt = function (_v0) {
	var x = _v0.cP;
	var y = _v0.cQ;
	return {
		cP: $elm$core$Basics$round(x),
		cQ: $elm$core$Basics$round(y)
	};
};
var $author$project$Models$coordinateOnBoard = F2(
	function (coordinate, board) {
		return (coordinate.cP >= 0) && ((_Utils_cmp(coordinate.cP, board.bW.bz) < 0) && ((coordinate.cQ >= 0) && (_Utils_cmp(coordinate.cQ, board.bW.bz) < 0)));
	});
var $author$project$Utils$VectorUtils$decreaseIntVectorMagnitude = function (vector) {
	var newY = (!vector.cQ) ? 0 : ((vector.cQ > 0) ? (vector.cQ - 1) : (vector.cQ + 1));
	var newX = (!vector.cP) ? 0 : ((vector.cP > 0) ? (vector.cP - 1) : (vector.cP + 1));
	return {cP: newX, cQ: newY};
};
var $author$project$Utils$PhysicsUtils$movePieceCoordinate = F2(
	function (coordinate, vector) {
		return {cP: coordinate.cP + vector.cP, cQ: coordinate.cQ + vector.cQ};
	});
var $author$project$Models$movePieceUnsafe = F3(
	function (board, pieceIndex, vector) {
		var pieceCoordinate = A2($elm$core$Dict$get, pieceIndex, board.be);
		if (!pieceCoordinate.$) {
			var coordinate = pieceCoordinate.a;
			var newPieceCoordinate = A2($author$project$Utils$PhysicsUtils$movePieceCoordinate, coordinate, vector);
			return _Utils_update(
				board,
				{
					r: A3(
						$elm$core$Dict$insert,
						$author$project$Utils$Utils$coordinateToTuple(newPieceCoordinate),
						pieceIndex,
						A2(
							$elm$core$Dict$remove,
							$author$project$Utils$Utils$coordinateToTuple(coordinate),
							board.r)),
					be: A3($elm$core$Dict$insert, pieceIndex, newPieceCoordinate, board.be)
				});
		} else {
			return board;
		}
	});
var $author$project$Utils$VectorUtils$unitIntVector = function (vector) {
	var y = (!vector.cQ) ? 0 : ((vector.cQ > 0) ? 1 : (-1));
	var x = (!vector.cP) ? 0 : ((vector.cP > 0) ? 1 : (-1));
	return {cP: x, cQ: y};
};
var $author$project$Models$getMaxMovementCoordinate = F4(
	function (pieceIndex, board, coordinate, vector) {
		getMaxMovementCoordinate:
		while (true) {
			var unitVector = $author$project$Utils$VectorUtils$unitIntVector(vector);
			var actualNext = A2($author$project$Utils$PhysicsUtils$movePieceCoordinate, coordinate, unitVector);
			var isNextSpaceValid = A3(
				$author$project$Models$checkValidPiecePlacement,
				actualNext,
				$elm$core$Maybe$Just(coordinate),
				board);
			if (_Utils_eq(coordinate, actualNext)) {
				return coordinate;
			} else {
				if (isNextSpaceValid) {
					var $temp$pieceIndex = pieceIndex,
						$temp$board = A3($author$project$Models$movePieceUnsafe, board, pieceIndex, unitVector),
						$temp$coordinate = actualNext,
						$temp$vector = $author$project$Utils$VectorUtils$decreaseIntVectorMagnitude(vector);
					pieceIndex = $temp$pieceIndex;
					board = $temp$board;
					coordinate = $temp$coordinate;
					vector = $temp$vector;
					continue getMaxMovementCoordinate;
				} else {
					return coordinate;
				}
			}
		}
	});
var $author$project$Models$getDeadPieceFromCoordinate = F2(
	function (board, coordinate) {
		return A2(
			$elm$core$Dict$get,
			$author$project$Utils$Utils$intCoordinateToTuple(coordinate),
			board.aG);
	});
var $author$project$Models$getNearestViewCoordinateToDeadPiece = F2(
	function (board, coordinate) {
		var padding = board.af;
		var isTop = coordinate.cQ < 0;
		var isRight = _Utils_cmp(coordinate.cP, board.bW.bz) > -1;
		var isLeft = coordinate.cP < 0;
		var nearestX = isRight ? ((board.bW.bz + padding) + ((padding / 2) | 0)) : (isLeft ? (padding - (((padding / 2) | 0) + 1)) : ($elm$core$Basics$round(coordinate.cP) + padding));
		var isBottom = _Utils_cmp(coordinate.cQ, board.bW.bz) > -1;
		var nearestY = isBottom ? ((board.bW.bz + padding) + ((padding / 2) | 0)) : (isTop ? (padding - (((padding / 2) | 0) + 1)) : ($elm$core$Basics$round(coordinate.cQ) + padding));
		var taken = A2(
			$author$project$Models$getDeadPieceFromCoordinate,
			board,
			{cP: nearestX, cQ: nearestY});
		if (taken.$ === 1) {
			return {cP: nearestX, cQ: nearestY};
		} else {
			return isRight ? {cP: nearestX - 1, cQ: nearestY} : (isLeft ? {cP: nearestX + 1, cQ: nearestY} : (isBottom ? {cP: nearestX, cQ: nearestY - 1} : (isTop ? {cP: nearestX, cQ: nearestY + 1} : {cP: nearestX, cQ: nearestY})));
		}
	});
var $author$project$Models$movePiece = F3(
	function (board, pieceIndex, vector) {
		var pieceCoordinate = A2($elm$core$Dict$get, pieceIndex, board.be);
		if (!pieceCoordinate.$) {
			var coordinate = pieceCoordinate.a;
			var newCoordinate = A4($author$project$Models$getMaxMovementCoordinate, pieceIndex, board, coordinate, vector);
			var newCoordinateOnMap = A2($author$project$Models$coordinateOnBoard, newCoordinate, board);
			if (newCoordinateOnMap) {
				return _Utils_update(
					board,
					{
						r: A3(
							$elm$core$Dict$insert,
							$author$project$Utils$Utils$coordinateToTuple(newCoordinate),
							pieceIndex,
							A2(
								$elm$core$Dict$remove,
								$author$project$Utils$Utils$coordinateToTuple(coordinate),
								board.r)),
						be: A3($elm$core$Dict$insert, pieceIndex, newCoordinate, board.be)
					});
			} else {
				var _v1 = A2($elm$core$Dict$get, pieceIndex, board.E);
				if (!_v1.$) {
					var piece = _v1.a;
					return _Utils_update(
						board,
						{
							r: A2(
								$elm$core$Dict$remove,
								$author$project$Utils$Utils$coordinateToTuple(coordinate),
								board.r),
							aG: A3(
								$elm$core$Dict$insert,
								$author$project$Utils$Utils$intCoordinateToTuple(
									A2($author$project$Models$getNearestViewCoordinateToDeadPiece, board, newCoordinate)),
								piece,
								board.aG),
							be: A2($elm$core$Dict$remove, pieceIndex, board.be),
							s: A2($elm$core$Dict$remove, pieceIndex, board.s),
							E: A2($elm$core$Dict$remove, pieceIndex, board.E)
						});
				} else {
					return board;
				}
			}
		} else {
			return board;
		}
	});
var $author$project$Utils$VectorUtils$multiplyVector = F2(
	function (scale, vector) {
		return {cP: vector.cP * scale, cQ: vector.cQ * scale};
	});
var $author$project$Models$updatePiecePositionsRecursive = F2(
	function (coordinatePieces, board) {
		updatePiecePositionsRecursive:
		while (true) {
			if (!coordinatePieces.b) {
				return board;
			} else {
				var coordinatePiece = coordinatePieces.a;
				var rest = coordinatePieces.b;
				var _v1 = coordinatePiece;
				var coordinate = _v1.a;
				var pieceIndex = _v1.b;
				var piece = _v1.c;
				var velocity = A2($elm$core$Dict$get, pieceIndex, board.s);
				if (!piece.$) {
					var p = piece.a;
					if (!velocity.$) {
						var f = velocity.a;
						var movementVector = $author$project$Utils$Utils$floatCoordinateToInt(
							A2($author$project$Utils$VectorUtils$multiplyVector, 1, f));
						var $temp$coordinatePieces = rest,
							$temp$board = A3($author$project$Models$movePiece, board, pieceIndex, movementVector);
						coordinatePieces = $temp$coordinatePieces;
						board = $temp$board;
						continue updatePiecePositionsRecursive;
					} else {
						var $temp$coordinatePieces = rest,
							$temp$board = board;
						coordinatePieces = $temp$coordinatePieces;
						board = $temp$board;
						continue updatePiecePositionsRecursive;
					}
				} else {
					var $temp$coordinatePieces = rest,
						$temp$board = board;
					coordinatePieces = $temp$coordinatePieces;
					board = $temp$board;
					continue updatePiecePositionsRecursive;
				}
			}
		}
	});
var $author$project$Models$updatePiecePositions = function (board) {
	var coordinatePieces = $elm$core$Dict$values(
		A2(
			$elm$core$Dict$map,
			F2(
				function (coordinate, index) {
					return _Utils_Tuple3(
						coordinate,
						index,
						A2($elm$core$Dict$get, index, board.E));
				}),
			board.r));
	return A2($author$project$Models$updatePiecePositionsRecursive, coordinatePieces, board);
};
var $author$project$Utils$VectorUtils$combineVectors = F2(
	function (vector1, vector2) {
		return {cP: vector1.cP + vector2.cP, cQ: vector1.cQ + vector2.cQ};
	});
var $author$project$Utils$VectorUtils$combineMaybeVectors = F2(
	function (vector, maybeVector) {
		if (!maybeVector.$) {
			var v = maybeVector.a;
			return A2($author$project$Utils$VectorUtils$combineVectors, vector, v);
		} else {
			return vector;
		}
	});
var $author$project$Models$addForceDicts = F2(
	function (forceDict, newForceDict) {
		return A3(
			$elm$core$Dict$foldl,
			F3(
				function (player, force, accumDict) {
					return A3(
						$elm$core$Dict$insert,
						player,
						A2(
							$author$project$Utils$VectorUtils$combineMaybeVectors,
							force,
							A2($elm$core$Dict$get, player, accumDict)),
						accumDict);
				}),
			forceDict,
			newForceDict);
	});
var $author$project$Utils$PhysicsUtils$checkVectorStop = function (vector) {
	return ($elm$core$Basics$sqrt(
		A2($elm$core$Basics$pow, vector.cP, 2) + A2($elm$core$Basics$pow, vector.cQ, 2)) < 1) ? {cP: 0, cQ: 0} : vector;
};
var $author$project$Models$checkAllVectorStop = function (board) {
	var newPieceVelocities = A2(
		$elm$core$Dict$map,
		F2(
			function (i, v) {
				return $author$project$Utils$PhysicsUtils$checkVectorStop(v);
			}),
		board.s);
	return _Utils_update(
		board,
		{s: newPieceVelocities});
};
var $author$project$Utils$PhysicsUtils$getFrictionVector = F2(
	function (friction, vector) {
		var ySign = (vector.cQ < 0) ? 1 : (-1);
		var yMagnitude = $elm$core$Basics$abs(vector.cQ);
		var yFriction = friction * yMagnitude;
		var xSign = (vector.cP < 0) ? 1 : (-1);
		var xMagnitude = $elm$core$Basics$abs(vector.cP);
		var xFriction = friction * xMagnitude;
		return {cP: xFriction * xSign, cQ: yFriction * ySign};
	});
var $author$project$Utils$VectorUtils$negative = function (vector) {
	return {cP: -vector.cP, cQ: -vector.cQ};
};
var $author$project$Models$getMagneticForceBetweenPieces = F5(
	function (magnetism, coordinate1, piece1, coordinate2, piece2) {
		var _v0 = A3($author$project$Utils$PhysicsUtils$calculateForceVector, magnetism, coordinate1, coordinate2);
		var force = _v0.a;
		var totalStrength = _v0.b;
		return _Utils_eq(piece1.y, piece2.y) ? force : $author$project$Utils$VectorUtils$negative(force);
	});
var $elm$core$List$concatMap = F2(
	function (f, list) {
		return $elm$core$List$concat(
			A2($elm$core$List$map, f, list));
	});
var $elm$core$List$drop = F2(
	function (n, list) {
		drop:
		while (true) {
			if (n <= 0) {
				return list;
			} else {
				if (!list.b) {
					return list;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs;
					n = $temp$n;
					list = $temp$list;
					continue drop;
				}
			}
		}
	});
var $elm$core$Tuple$pair = F2(
	function (a, b) {
		return _Utils_Tuple2(a, b);
	});
var $author$project$Utils$Utils$getPairs = function (list) {
	return A2(
		$elm$core$List$concatMap,
		function (_v0) {
			var i = _v0.a;
			var x = _v0.b;
			return A2(
				$elm$core$List$map,
				function (y) {
					return _Utils_Tuple2(x, y);
				},
				A2($elm$core$List$drop, i + 1, list));
		},
		A2($elm$core$List$indexedMap, $elm$core$Tuple$pair, list));
};
var $elm$core$Dict$member = F2(
	function (key, dict) {
		var _v0 = A2($elm$core$Dict$get, key, dict);
		if (!_v0.$) {
			return true;
		} else {
			return false;
		}
	});
var $elm$core$Basics$not = _Basics_not;
var $author$project$Models$getMagneticForceOnAllPieces = F2(
	function (magnetism, board) {
		var coordinatePieces = $author$project$Models$getCoordinatePieces(board);
		var coordinatePiecesWithoutTentative = A2(
			$elm$core$List$filter,
			function (_v3) {
				var index = _v3.a;
				return !A2($elm$core$Dict$member, index, board.ai);
			},
			coordinatePieces);
		var coordinatePairs = $author$project$Utils$Utils$getPairs(coordinatePiecesWithoutTentative);
		return A3(
			$elm$core$List$foldl,
			F2(
				function (_v0, accumDict) {
					var _v1 = _v0.a;
					var i1 = _v1.a;
					var coord1 = _v1.b;
					var piece1 = _v1.c;
					var _v2 = _v0.b;
					var i2 = _v2.a;
					var coord2 = _v2.b;
					var piece2 = _v2.c;
					var force = A5($author$project$Models$getMagneticForceBetweenPieces, magnetism, coord1, piece1, coord2, piece2);
					var resultantDict = $elm$core$Dict$fromList(
						_List_fromArray(
							[
								_Utils_Tuple2(i1, force),
								_Utils_Tuple2(
								i2,
								$author$project$Utils$VectorUtils$negative(force))
							]));
					return A2($author$project$Models$addForceDicts, accumDict, resultantDict);
				}),
			$elm$core$Dict$empty,
			coordinatePairs);
	});
var $author$project$Utils$PhysicsUtils$calculateCollisionNormal = F2(
	function (position1, position2) {
		var directionVector = {cP: position2.cP - position1.cP, cQ: position2.cQ - position1.cQ};
		var magnitude = $elm$core$Basics$sqrt(
			A2($elm$core$Basics$pow, directionVector.cP, 2) + A2($elm$core$Basics$pow, directionVector.cQ, 2));
		var collisionNormal = {cP: directionVector.cP / magnitude, cQ: directionVector.cQ / magnitude};
		return collisionNormal;
	});
var $author$project$Utils$PhysicsUtils$calculateImpulse = F4(
	function (restitution, velocity1, velocity2, collisionNormal) {
		var relativeVelocity = {cP: velocity1.cP - velocity2.cP, cQ: velocity1.cQ - velocity2.cQ};
		var velocityScaleAlongNormal = (relativeVelocity.cP * collisionNormal.cP) + (relativeVelocity.cQ * collisionNormal.cQ);
		var velocityAlongNormalVector = {cP: (restitution * velocityScaleAlongNormal) * collisionNormal.cP, cQ: (restitution * velocityScaleAlongNormal) * collisionNormal.cQ};
		var impulse = (velocityScaleAlongNormal > 0) ? $author$project$Utils$VectorUtils$negative(velocityAlongNormalVector) : {cP: 0, cQ: 0};
		return impulse;
	});
var $author$project$Utils$VectorUtils$vectorMagnitude = function (vector) {
	return $elm$core$Basics$sqrt((vector.cP * vector.cP) + (vector.cQ * vector.cQ));
};
var $author$project$Utils$PhysicsUtils$calculateCollisionVector = F2(
	function (_v0, _v1) {
		var c1 = _v0.a;
		var v1 = _v0.b;
		var c2 = _v1.a;
		var v2 = _v1.b;
		var proportion = $author$project$Utils$VectorUtils$vectorMagnitude(v1) / ($author$project$Utils$VectorUtils$vectorMagnitude(v1) + $author$project$Utils$VectorUtils$vectorMagnitude(v2));
		var impulse = A4(
			$author$project$Utils$PhysicsUtils$calculateImpulse,
			1,
			v1,
			v2,
			A2($author$project$Utils$PhysicsUtils$calculateCollisionNormal, c1, c2));
		var antiV2 = A2(
			$author$project$Utils$VectorUtils$multiplyVector,
			1 - proportion,
			$author$project$Utils$VectorUtils$negative(impulse));
		var antiV1 = A2($author$project$Utils$VectorUtils$multiplyVector, proportion, impulse);
		return _Utils_Tuple2(antiV1, antiV2);
	});
var $author$project$Models$getCollidingPieces = function (board) {
	var coordinatePieces = $author$project$Models$getCoordinatePieces(board);
	var coordinatePairs = $author$project$Utils$Utils$getPairs(coordinatePieces);
	return A2(
		$elm$core$List$filter,
		function (_v0) {
			var _v1 = _v0.a;
			var i1 = _v1.a;
			var coord1 = _v1.b;
			var piece1 = _v1.c;
			var _v2 = _v0.b;
			var i2 = _v2.a;
			var coord2 = _v2.b;
			var piece2 = _v2.c;
			var distance = A2($author$project$Utils$Utils$euclideanDistance, coord1, coord2);
			return distance <= 2;
		},
		coordinatePairs);
};
var $author$project$Models$getCollidingPieceUpdates = F2(
	function (board, velocities) {
		var collidingPieces = $author$project$Models$getCollidingPieces(board);
		var velocitiesAfterCollision = A3(
			$elm$core$List$foldl,
			F2(
				function (_v0, accumDict) {
					var _v1 = _v0.a;
					var i1 = _v1.a;
					var c1 = _v1.b;
					var _v2 = _v0.b;
					var i2 = _v2.a;
					var c2 = _v2.b;
					var _v3 = _Utils_Tuple2(
						A2($elm$core$Dict$get, i1, velocities),
						A2($elm$core$Dict$get, i2, velocities));
					if ((!_v3.a.$) && (!_v3.b.$)) {
						var v1 = _v3.a.a;
						var v2 = _v3.b.a;
						var _v4 = A2(
							$author$project$Utils$PhysicsUtils$calculateCollisionVector,
							_Utils_Tuple2(c1, v1),
							_Utils_Tuple2(c2, v2));
						var antiV1 = _v4.a;
						var antiV2 = _v4.b;
						return A2(
							$author$project$Models$addForceDicts,
							$elm$core$Dict$fromList(
								_List_fromArray(
									[
										_Utils_Tuple2(i1, antiV1),
										_Utils_Tuple2(i2, antiV2)
									])),
							accumDict);
					} else {
						return accumDict;
					}
				}),
			$elm$core$Dict$empty,
			collidingPieces);
		return velocitiesAfterCollision;
	});
var $author$project$Models$updatePieceCollisions = function (board) {
	var updates = A2($author$project$Models$getCollidingPieceUpdates, board, board.s);
	var newPieceVelocities = A2($author$project$Models$addForceDicts, board.s, updates);
	return _Utils_update(
		board,
		{s: newPieceVelocities});
};
var $author$project$Models$updatePieceVelocities = F3(
	function (friction, magnetism, board) {
		var magneticForceDict = A2($author$project$Models$getMagneticForceOnAllPieces, magnetism, board);
		var newVelocities = A2($author$project$Models$addForceDicts, board.s, magneticForceDict);
		var newVelocitiesWithFriction = A2(
			$elm$core$Dict$map,
			F2(
				function (index, vector) {
					return A2(
						$author$project$Utils$VectorUtils$combineVectors,
						A2($author$project$Utils$PhysicsUtils$getFrictionVector, friction, vector),
						vector);
				}),
			newVelocities);
		return $author$project$Models$checkAllVectorStop(
			$author$project$Models$updatePieceCollisions(
				_Utils_update(
					board,
					{s: newVelocitiesWithFriction})));
	});
var $author$project$Game$updatePlayerScores = F2(
	function (players, scoreDict) {
		return A2(
			$elm$core$Dict$map,
			F2(
				function (player, playerData) {
					return _Utils_update(
						playerData,
						{
							z: A2(
								$elm$core$Maybe$withDefault,
								0.0,
								A2($elm$core$Dict$get, player, scoreDict))
						});
				}),
			players);
	});
var $author$project$Models$zeroPieceVelocities = function (board) {
	return _Utils_update(
		board,
		{
			s: A2(
				$elm$core$Dict$map,
				F2(
					function (i, v) {
						return {cP: 0, cQ: 0};
					}),
				board.s)
		});
};
var $author$project$Game$updateGameBoard = function (game) {
	var gameScores = $author$project$Game$getGameScore(game);
	var newGame = _Utils_update(
		game,
		{
			b: A2(
				$author$project$Models$updateBoardMagneticField,
				game.X,
				$author$project$Models$updatePiecePositions(
					A3($author$project$Models$updatePieceVelocities, game.a2, game.X, game.b))),
			c: A2($author$project$Game$updatePlayerScores, game.c, gameScores)
		});
	if (_Utils_eq(newGame.b.be, game.b.be)) {
		var _v0 = game.d;
		if (_v0.$ === 1) {
			return _Utils_update(
				newGame,
				{
					b: $author$project$Models$zeroPieceVelocities(newGame.b),
					d: $author$project$Game$getGameStatus(game)
				});
		} else {
			return _Utils_update(
				newGame,
				{
					b: $author$project$Models$zeroPieceVelocities(newGame.b)
				});
		}
	} else {
		return newGame;
	}
};
var $author$project$Game$simulateGameBoard = F3(
	function (steps, prevGame, currentGame) {
		simulateGameBoard:
		while (true) {
			if ((steps <= 0) || _Utils_eq(prevGame.b.be, currentGame.b.be)) {
				return currentGame;
			} else {
				var $temp$steps = steps - 1,
					$temp$prevGame = currentGame,
					$temp$currentGame = $author$project$Game$updateGameBoard(currentGame);
				steps = $temp$steps;
				prevGame = $temp$prevGame;
				currentGame = $temp$currentGame;
				continue simulateGameBoard;
			}
		}
	});
var $author$project$Game$getMoveScore = F3(
	function (player, move, game) {
		if (A3(
			$author$project$Models$checkValidPiecePlacement,
			$author$project$Utils$Utils$intCoordinateToFloat(
				{cP: move.cP, cQ: move.cQ}),
			$elm$core$Maybe$Nothing,
			game.b)) {
			var newGame = _Utils_update(
				game,
				{
					b: A3(
						$author$project$Models$insertPiece,
						{bf: player, y: move.y},
						$author$project$Utils$Utils$intCoordinateToFloat(
							{cP: move.cP, cQ: move.cQ}),
						game.b)
				});
			var simulatedGame = A3($author$project$Game$simulateGameBoard, 10, game, newGame);
			return $elm$core$Maybe$Just(
				A2($author$project$Game$getAvgScoreMargin, player, simulatedGame));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $elm$random$Random$Generator = $elm$core$Basics$identity;
var $elm$core$Bitwise$xor = _Bitwise_xor;
var $elm$random$Random$peel = function (_v0) {
	var state = _v0.a;
	var word = (state ^ (state >>> ((state >>> 28) + 4))) * 277803737;
	return ((word >>> 22) ^ word) >>> 0;
};
var $elm$random$Random$int = F2(
	function (a, b) {
		return function (seed0) {
			var _v0 = (_Utils_cmp(a, b) < 0) ? _Utils_Tuple2(a, b) : _Utils_Tuple2(b, a);
			var lo = _v0.a;
			var hi = _v0.b;
			var range = (hi - lo) + 1;
			if (!((range - 1) & range)) {
				return _Utils_Tuple2(
					(((range - 1) & $elm$random$Random$peel(seed0)) >>> 0) + lo,
					$elm$random$Random$next(seed0));
			} else {
				var threshhold = (((-range) >>> 0) % range) >>> 0;
				var accountForBias = function (seed) {
					accountForBias:
					while (true) {
						var x = $elm$random$Random$peel(seed);
						var seedN = $elm$random$Random$next(seed);
						if (_Utils_cmp(x, threshhold) < 0) {
							var $temp$seed = seedN;
							seed = $temp$seed;
							continue accountForBias;
						} else {
							return _Utils_Tuple2((x % range) + lo, seedN);
						}
					}
				};
				return accountForBias(seed0);
			}
		};
	});
var $elm$random$Random$map2 = F3(
	function (func, _v0, _v1) {
		var genA = _v0;
		var genB = _v1;
		return function (seed0) {
			var _v2 = genA(seed0);
			var a = _v2.a;
			var seed1 = _v2.b;
			var _v3 = genB(seed1);
			var b = _v3.a;
			var seed2 = _v3.b;
			return _Utils_Tuple2(
				A2(func, a, b),
				seed2);
		};
	});
var $elm$random$Random$pair = F2(
	function (genA, genB) {
		return A3(
			$elm$random$Random$map2,
			F2(
				function (a, b) {
					return _Utils_Tuple2(a, b);
				}),
			genA,
			genB);
	});
var $elm$random$Random$step = F2(
	function (_v0, seed) {
		var generator = _v0;
		return generator(seed);
	});
var $author$project$Game$generateRandomMove = function (game) {
	var randomCoordinate = function (_v0) {
		var _v1 = _v0.a;
		var x = _v1.a;
		var y = _v1.b;
		var seed = _v0.b;
		return {J: seed, cP: x, cQ: y};
	}(
		A2(
			$elm$random$Random$step,
			A2(
				$elm$random$Random$pair,
				A2($elm$random$Random$int, 0, game.b.bW.bz - 1),
				A2($elm$random$Random$int, 0, game.b.bW.bz - 1)),
			game.l.J));
	var randomPolarity = (!A2(
		$elm$random$Random$step,
		A2($elm$random$Random$int, 0, 1),
		randomCoordinate.J).a) ? 1 : 0;
	var move = {y: randomPolarity, cP: randomCoordinate.cP, cQ: randomCoordinate.cQ};
	return {
		Z: move,
		z: A3($author$project$Game$getMoveScore, game.t, move, game),
		J: randomCoordinate.J
	};
};
var $author$project$Game$getPlayerPolarity = F2(
	function (player, game) {
		return A2(
			$elm$core$Maybe$withDefault,
			1,
			A2(
				$elm$core$Maybe$map,
				function (playerData) {
					return playerData.y;
				},
				A2($elm$core$Dict$get, player, game.c)));
	});
var $author$project$Game$processMoveResult = F4(
	function (player, onSuccess, onFailure, moveResult) {
		var _v0 = moveResult.d;
		if (!_v0) {
			return A2(onSuccess, player, moveResult.W);
		} else {
			return A2(onFailure, player, moveResult.W);
		}
	});
var $author$project$Game$Processing = {$: 1};
var $elm$core$Basics$modBy = _Basics_modBy;
var $author$project$Game$progressGameSuccess = F2(
	function (player, game) {
		return A2(
			$author$project$Game$withCmd,
			A2(
				$author$project$Game$send,
				200.0,
				$author$project$Game$UpdateBoard(_List_Nil)),
			_Utils_update(
				game,
				{
					c: A3(
						$elm$core$Dict$update,
						player,
						$elm$core$Maybe$map(
							function (playerData) {
								return _Utils_update(
									playerData,
									{ay: playerData.ay - 1});
							}),
						game.c),
					l: {Z: game.l.Z, z: $elm$core$Maybe$Nothing, J: game.l.J},
					d: $author$project$Game$Processing,
					aR: game.aR + 1,
					t: A2(
						$elm$core$Basics$modBy,
						$elm$core$Dict$size(game.c),
						game.aR + 1)
				}));
	});
var $author$project$Game$sendGetAIMove = F2(
	function (player, game) {
		return _Utils_Tuple2(
			game,
			A2(
				$author$project$Game$send,
				200.0,
				$author$project$Game$GenerateAIMove(1)));
	});
var $author$project$Game$sendNow = function (msg) {
	return A2(
		$elm$core$Task$perform,
		$elm$core$Basics$identity,
		$elm$core$Task$succeed(msg));
};
var $author$project$Game$update = F2(
	function (msg, game) {
		update:
		while (true) {
			switch (msg.$) {
				case 4:
					var player = msg.a;
					var polarity = msg.b;
					return A2(
						$author$project$Game$alwaysCommand,
						$elm$core$Platform$Cmd$none,
						A2(
							$author$project$Game$applyMove,
							A2($author$project$Game$SelectPolarity, player, polarity),
							game));
				case 0:
					var modelMsg = msg.a;
					var cellmsg = modelMsg;
					var _v2 = game.d;
					if (!_v2.$) {
						var _v3 = cellmsg.bB;
						if (!_v3) {
							var _v4 = A2($author$project$Game$determineCellCoordinates, game, cellmsg);
							if (!_v4.$) {
								var coordinate = _v4.a;
								return A4(
									$author$project$Game$processMoveResult,
									game.t,
									$author$project$Game$progressGameSuccess,
									F2(
										function (_v5, _v6) {
											return _Utils_Tuple2(game, $elm$core$Platform$Cmd$none);
										}),
									A2(
										$author$project$Game$applyMove,
										A2(
											$author$project$Game$PlacePiece,
											coordinate,
											A2($author$project$Game$getPlayerPolarity, game.t, game)),
										game));
							} else {
								return _Utils_Tuple2(game, $elm$core$Platform$Cmd$none);
							}
						} else {
							var _v7 = A2($author$project$Game$determineCellCoordinates, game, cellmsg);
							if (!_v7.$) {
								var coordinate = _v7.a;
								return A2(
									$author$project$Game$alwaysCommand,
									$elm$core$Platform$Cmd$none,
									A2(
										$author$project$Game$applyMove,
										A2(
											$author$project$Game$DisplayPiece,
											coordinate,
											A2($author$project$Game$getPlayerPolarity, game.t, game)),
										game));
							} else {
								return _Utils_Tuple2(game, $elm$core$Platform$Cmd$none);
							}
						}
					} else {
						return _Utils_Tuple2(game, $elm$core$Platform$Cmd$none);
					}
				case 3:
					var previousStates = msg.a;
					return A3(
						$author$project$Game$withDetermineUpdateCommand,
						game,
						previousStates,
						$author$project$Game$updateGameBoard(game));
				case 1:
					var num = msg.a;
					var _v8 = game.d;
					_v8$2:
					while (true) {
						if (_v8.$ === 3) {
							switch (_v8.a) {
								case 0:
									var newMove = $author$project$Game$generateRandomMove(game);
									var _v9 = newMove.z;
									if (!_v9.$) {
										var $temp$msg = $author$project$Game$PlayAIMove,
											$temp$game = _Utils_update(
											game,
											{l: newMove});
										msg = $temp$msg;
										game = $temp$game;
										continue update;
									} else {
										return A2(
											$author$project$Game$withCmd,
											$author$project$Game$sendNow(
												$author$project$Game$GenerateAIMove(0)),
											_Utils_update(
												game,
												{l: newMove}));
									}
								case 1:
									if (!num) {
										return A2(
											$author$project$Game$withCmd,
											$author$project$Game$sendNow($author$project$Game$PlayAIMove),
											game);
									} else {
										var newMove = $author$project$Game$generateRandomMove(game);
										var maybeNewMoveScore = A3($author$project$Game$getMoveScore, game.t, newMove.Z, game);
										if (!maybeNewMoveScore.$) {
											var newMoveScore = maybeNewMoveScore.a;
											var _v11 = game.l.z;
											if (!_v11.$) {
												var score = _v11.a;
												return (_Utils_cmp(newMoveScore, score) > 0) ? A2(
													$author$project$Game$withCmd,
													A2(
														$author$project$Game$send,
														0.0,
														$author$project$Game$GenerateAIMove(num - 1)),
													_Utils_update(
														game,
														{ak: game.ab - num, l: newMove})) : A2(
													$author$project$Game$withCmd,
													A2(
														$author$project$Game$send,
														0.0,
														$author$project$Game$GenerateAIMove(num - 1)),
													_Utils_update(
														game,
														{
															ak: game.ab - num,
															l: {Z: game.l.Z, z: game.l.z, J: newMove.J}
														}));
											} else {
												return A2(
													$author$project$Game$withCmd,
													A2(
														$author$project$Game$send,
														0.0,
														$author$project$Game$GenerateAIMove(num - 1)),
													_Utils_update(
														game,
														{ak: game.ab - num, l: newMove}));
											}
										} else {
											var $temp$msg = $author$project$Game$GenerateAIMove(num),
												$temp$game = _Utils_update(
												game,
												{ak: game.ab - num, l: newMove});
											msg = $temp$msg;
											game = $temp$game;
											continue update;
										}
									}
								default:
									break _v8$2;
							}
						} else {
							break _v8$2;
						}
					}
					return _Utils_Tuple2(game, $elm$core$Platform$Cmd$none);
				default:
					var _v12 = game.d;
					if (_v12.$ === 3) {
						var aiMove = game.l.Z;
						return A4(
							$author$project$Game$processMoveResult,
							game.t,
							$author$project$Game$progressGameSuccess,
							$author$project$Game$sendGetAIMove,
							A2(
								$author$project$Game$applyMove,
								A2(
									$author$project$Game$PlacePiece,
									{cP: aiMove.cP, cQ: aiMove.cQ},
									aiMove.y),
								game));
					} else {
						return _Utils_Tuple2(game, $elm$core$Platform$Cmd$none);
					}
			}
		}
	});
var $author$project$Settings$getMagnetismForGridSize = F3(
	function (oldGridSize, newGridSize, oldMagnetism) {
		var magnetismRatio = oldMagnetism / oldGridSize;
		return $elm$core$Basics$round(newGridSize * magnetismRatio);
	});
var $elm$core$Elm$JsArray$unsafeSet = _JsArray_unsafeSet;
var $elm$core$Array$setHelp = F4(
	function (shift, index, value, tree) {
		var pos = $elm$core$Array$bitMask & (index >>> shift);
		var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, pos, tree);
		if (!_v0.$) {
			var subTree = _v0.a;
			var newSub = A4($elm$core$Array$setHelp, shift - $elm$core$Array$shiftStep, index, value, subTree);
			return A3(
				$elm$core$Elm$JsArray$unsafeSet,
				pos,
				$elm$core$Array$SubTree(newSub),
				tree);
		} else {
			var values = _v0.a;
			var newLeaf = A3($elm$core$Elm$JsArray$unsafeSet, $elm$core$Array$bitMask & index, value, values);
			return A3(
				$elm$core$Elm$JsArray$unsafeSet,
				pos,
				$elm$core$Array$Leaf(newLeaf),
				tree);
		}
	});
var $elm$core$Array$set = F3(
	function (index, value, array) {
		var len = array.a;
		var startShift = array.b;
		var tree = array.c;
		var tail = array.d;
		return ((index < 0) || (_Utils_cmp(index, len) > -1)) ? array : ((_Utils_cmp(
			index,
			$elm$core$Array$tailIndex(len)) > -1) ? A4(
			$elm$core$Array$Array_elm_builtin,
			len,
			startShift,
			tree,
			A3($elm$core$Elm$JsArray$unsafeSet, $elm$core$Array$bitMask & index, value, tail)) : A4(
			$elm$core$Array$Array_elm_builtin,
			len,
			startShift,
			A4($elm$core$Array$setHelp, startShift, index, value, tree),
			tail));
	});
var $author$project$Settings$update = F2(
	function (msg, settings) {
		switch (msg.$) {
			case 0:
				var size = msg.a;
				return _Utils_update(
					settings,
					{
						N: size,
						X: A3($author$project$Settings$getMagnetismForGridSize, settings.N, size, settings.X)
					});
			case 1:
				var magnetism = msg.a;
				return _Utils_update(
					settings,
					{X: magnetism});
			case 2:
				var friction = msg.a;
				return _Utils_update(
					settings,
					{a2: friction});
			case 3:
				var moves = msg.a;
				return _Utils_update(
					settings,
					{dw: moves});
			case 4:
				var players = msg.a;
				return _Utils_update(
					settings,
					{
						cs: A2($elm$core$Array$repeat, players, 0),
						c: players
					});
			default:
				var player = msg.a;
				var ai = msg.b;
				return _Utils_update(
					settings,
					{
						cs: A3($elm$core$Array$set, player, ai, settings.cs)
					});
		}
	});
var $author$project$Main$withCmd = F2(
	function (cmd, screen) {
		return _Utils_Tuple2(screen, cmd);
	});
var $author$project$Main$update = F2(
	function (msg, screen) {
		if (!screen.$) {
			var settings = screen.a;
			switch (msg.$) {
				case 0:
					var settingsMsg = msg.a;
					return A2(
						$author$project$Main$withCmd,
						$elm$core$Platform$Cmd$none,
						$author$project$Main$SettingsScreen(
							A2($author$project$Settings$update, settingsMsg, settings)));
				case 2:
					return A2(
						$author$project$Main$withCmd,
						A2($elm$core$Task$perform, $author$project$Main$StartGameNow, $elm$time$Time$now),
						$author$project$Main$SettingsScreen(settings));
				case 5:
					var posix = msg.a;
					return $author$project$Main$mapGameCmd(
						$author$project$Game$init(
							_Utils_update(
								settings,
								{
									dY: $elm$time$Time$posixToMillis(posix)
								})));
				default:
					return A2($author$project$Main$withCmd, $elm$core$Platform$Cmd$none, screen);
			}
		} else {
			var game = screen.a;
			switch (msg.$) {
				case 1:
					var gameMsg = msg.a;
					return $author$project$Main$mapGameCmd(
						A2($author$project$Game$update, gameMsg, game));
				case 3:
					return A2(
						$author$project$Main$withCmd,
						$elm$core$Platform$Cmd$none,
						$author$project$Main$SettingsScreen(game.cE));
				default:
					return A2($author$project$Main$withCmd, $elm$core$Platform$Cmd$none, screen);
			}
		}
	});
var $author$project$Main$ClickedRestart = {$: 3};
var $author$project$Main$ClickedStartGame = {$: 2};
var $author$project$Main$SettingsMsg = function (a) {
	return {$: 0, a: a};
};
var $elm$html$Html$button = _VirtualDom_node('button');
var $elm$json$Json$Encode$string = _Json_wrap;
var $elm$html$Html$Attributes$stringProperty = F2(
	function (key, string) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$string(string));
	});
var $elm$html$Html$Attributes$class = $elm$html$Html$Attributes$stringProperty('className');
var $elm$html$Html$div = _VirtualDom_node('div');
var $elm$html$Html$h1 = _VirtualDom_node('h1');
var $elm$html$Html$h2 = _VirtualDom_node('h2');
var $elm$html$Html$Attributes$id = $elm$html$Html$Attributes$stringProperty('id');
var $elm$html$Html$h3 = _VirtualDom_node('h3');
var $elm$html$Html$p = _VirtualDom_node('p');
var $elm$html$Html$strong = _VirtualDom_node('strong');
var $elm$virtual_dom$VirtualDom$text = _VirtualDom_text;
var $elm$html$Html$text = $elm$virtual_dom$VirtualDom$text;
var $author$project$Main$introText = A2(
	$elm$html$Html$div,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class('intro-text')
		]),
	_List_fromArray(
		[
			A2(
			$elm$html$Html$h3,
			_List_Nil,
			_List_fromArray(
				[
					$elm$html$Html$text('Magnet Melee! Control as much space on the board as possible using your magnetic powers.')
				])),
			A2(
			$elm$html$Html$p,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					$elm$html$Html$strong,
					_List_Nil,
					_List_fromArray(
						[
							$elm$html$Html$text('Magnetism: ')
						])),
					$elm$html$Html$text('Strength of each magnet - the stronger the magnet, the more force they exert on other magnets.')
				])),
			A2(
			$elm$html$Html$p,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					$elm$html$Html$strong,
					_List_Nil,
					_List_fromArray(
						[
							$elm$html$Html$text('Friction: ')
						])),
					$elm$html$Html$text('Amount of friction on the field - this controls how much speed each magnet loses as it moves')
				]))
		]));
var $elm$virtual_dom$VirtualDom$map = _VirtualDom_map;
var $elm$html$Html$map = $elm$virtual_dom$VirtualDom$map;
var $elm$virtual_dom$VirtualDom$Normal = function (a) {
	return {$: 0, a: a};
};
var $elm$virtual_dom$VirtualDom$on = _VirtualDom_on;
var $elm$html$Html$Events$on = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$Normal(decoder));
	});
var $elm$html$Html$Events$onClick = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'click',
		$elm$json$Json$Decode$succeed(msg));
};
var $author$project$Game$ModelMsg = function (a) {
	return {$: 0, a: a};
};
var $author$project$Models$CellGridMessage = $elm$core$Basics$identity;
var $jxxcarlson$elm_cell_grid$CellGrid$Position = F2(
	function (row, column) {
		return {bU: column, cB: row};
	});
var $jxxcarlson$elm_cell_grid$CellGrid$foldr = F3(
	function (reducer, initialValue, _v0) {
		var cells = _v0.b;
		return A3($elm$core$Array$foldr, reducer, initialValue, cells);
	});
var $elm$svg$Svg$trustedNode = _VirtualDom_nodeNS('http://www.w3.org/2000/svg');
var $elm$svg$Svg$g = $elm$svg$Svg$trustedNode('g');
var $jxxcarlson$elm_cell_grid$CellGrid$CellGrid = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$core$Elm$JsArray$foldl = _JsArray_foldl;
var $elm$core$Elm$JsArray$indexedMap = _JsArray_indexedMap;
var $elm$core$Array$indexedMap = F2(
	function (func, _v0) {
		var len = _v0.a;
		var tree = _v0.c;
		var tail = _v0.d;
		var initialBuilder = {
			j: _List_Nil,
			f: 0,
			i: A3(
				$elm$core$Elm$JsArray$indexedMap,
				func,
				$elm$core$Array$tailIndex(len),
				tail)
		};
		var helper = F2(
			function (node, builder) {
				if (!node.$) {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldl, helper, builder, subTree);
				} else {
					var leaf = node.a;
					var offset = builder.f * $elm$core$Array$branchFactor;
					var mappedLeaf = $elm$core$Array$Leaf(
						A3($elm$core$Elm$JsArray$indexedMap, func, offset, leaf));
					return {
						j: A2($elm$core$List$cons, mappedLeaf, builder.j),
						f: builder.f + 1,
						i: builder.i
					};
				}
			});
		return A2(
			$elm$core$Array$builderToArray,
			true,
			A3($elm$core$Elm$JsArray$foldl, helper, initialBuilder, tree));
	});
var $jxxcarlson$elm_cell_grid$CellGrid$matrixIndex = F2(
	function (dimensions, n) {
		return A2(
			$jxxcarlson$elm_cell_grid$CellGrid$Position,
			(n / dimensions.m) | 0,
			A2($elm$core$Basics$modBy, dimensions.m, n));
	});
var $jxxcarlson$elm_cell_grid$CellGrid$indexedMap = F2(
	function (f, _v0) {
		var dimensions = _v0.a;
		var cells = _v0.b;
		var indexedCellTransformer = F2(
			function (index, value) {
				var position = A2(
					$jxxcarlson$elm_cell_grid$CellGrid$matrixIndex,
					{m: dimensions.m, ah: dimensions.ah},
					index);
				return A3(f, position.cB, position.bU, value);
			});
		return A2(
			$jxxcarlson$elm_cell_grid$CellGrid$CellGrid,
			dimensions,
			A2($elm$core$Array$indexedMap, indexedCellTransformer, cells));
	});
var $elm$svg$Svg$Attributes$class = _VirtualDom_attribute('class');
var $elm$svg$Svg$Attributes$fill = _VirtualDom_attribute('fill');
var $elm$svg$Svg$Attributes$fillOpacity = _VirtualDom_attribute('fill-opacity');
var $elm$core$String$fromFloat = _String_fromNumber;
var $elm$svg$Svg$Attributes$height = _VirtualDom_attribute('height');
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$defaultOptions = {bH: true, bM: false};
var $elm$virtual_dom$VirtualDom$Custom = function (a) {
	return {$: 3, a: a};
};
var $elm$html$Html$Events$custom = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$Custom(decoder));
	});
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$Event = F6(
	function (keys, button, clientPos, offsetPos, pagePos, screenPos) {
		return {c_: button, bT: clientPos, du: keys, dB: offsetPos, dH: pagePos, dQ: screenPos};
	});
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$BackButton = 4;
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$ErrorButton = 0;
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$ForwardButton = 5;
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$MainButton = 1;
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$MiddleButton = 2;
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$SecondButton = 3;
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$buttonFromId = function (id) {
	switch (id) {
		case 0:
			return 1;
		case 1:
			return 2;
		case 2:
			return 3;
		case 3:
			return 4;
		case 4:
			return 5;
		default:
			return 0;
	}
};
var $elm$json$Json$Decode$field = _Json_decodeField;
var $elm$json$Json$Decode$int = _Json_decodeInt;
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$buttonDecoder = A2(
	$elm$json$Json$Decode$map,
	$mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$buttonFromId,
	A2($elm$json$Json$Decode$field, 'button', $elm$json$Json$Decode$int));
var $elm$json$Json$Decode$float = _Json_decodeFloat;
var $mpizenberg$elm_pointer_events$Internal$Decode$clientPos = A3(
	$elm$json$Json$Decode$map2,
	F2(
		function (a, b) {
			return _Utils_Tuple2(a, b);
		}),
	A2($elm$json$Json$Decode$field, 'clientX', $elm$json$Json$Decode$float),
	A2($elm$json$Json$Decode$field, 'clientY', $elm$json$Json$Decode$float));
var $mpizenberg$elm_pointer_events$Internal$Decode$Keys = F3(
	function (alt, ctrl, shift) {
		return {cV: alt, c6: ctrl, dR: shift};
	});
var $elm$json$Json$Decode$bool = _Json_decodeBool;
var $elm$json$Json$Decode$map3 = _Json_map3;
var $mpizenberg$elm_pointer_events$Internal$Decode$keys = A4(
	$elm$json$Json$Decode$map3,
	$mpizenberg$elm_pointer_events$Internal$Decode$Keys,
	A2($elm$json$Json$Decode$field, 'altKey', $elm$json$Json$Decode$bool),
	A2($elm$json$Json$Decode$field, 'ctrlKey', $elm$json$Json$Decode$bool),
	A2($elm$json$Json$Decode$field, 'shiftKey', $elm$json$Json$Decode$bool));
var $elm$json$Json$Decode$map6 = _Json_map6;
var $mpizenberg$elm_pointer_events$Internal$Decode$offsetPos = A3(
	$elm$json$Json$Decode$map2,
	F2(
		function (a, b) {
			return _Utils_Tuple2(a, b);
		}),
	A2($elm$json$Json$Decode$field, 'offsetX', $elm$json$Json$Decode$float),
	A2($elm$json$Json$Decode$field, 'offsetY', $elm$json$Json$Decode$float));
var $mpizenberg$elm_pointer_events$Internal$Decode$pagePos = A3(
	$elm$json$Json$Decode$map2,
	F2(
		function (a, b) {
			return _Utils_Tuple2(a, b);
		}),
	A2($elm$json$Json$Decode$field, 'pageX', $elm$json$Json$Decode$float),
	A2($elm$json$Json$Decode$field, 'pageY', $elm$json$Json$Decode$float));
var $mpizenberg$elm_pointer_events$Internal$Decode$screenPos = A3(
	$elm$json$Json$Decode$map2,
	F2(
		function (a, b) {
			return _Utils_Tuple2(a, b);
		}),
	A2($elm$json$Json$Decode$field, 'screenX', $elm$json$Json$Decode$float),
	A2($elm$json$Json$Decode$field, 'screenY', $elm$json$Json$Decode$float));
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$eventDecoder = A7($elm$json$Json$Decode$map6, $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$Event, $mpizenberg$elm_pointer_events$Internal$Decode$keys, $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$buttonDecoder, $mpizenberg$elm_pointer_events$Internal$Decode$clientPos, $mpizenberg$elm_pointer_events$Internal$Decode$offsetPos, $mpizenberg$elm_pointer_events$Internal$Decode$pagePos, $mpizenberg$elm_pointer_events$Internal$Decode$screenPos);
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onWithOptions = F3(
	function (event, options, tag) {
		return A2(
			$elm$html$Html$Events$custom,
			event,
			A2(
				$elm$json$Json$Decode$map,
				function (ev) {
					return {
						ae: tag(ev),
						bH: options.bH,
						bM: options.bM
					};
				},
				$mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$eventDecoder));
	});
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onDown = A2($mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onWithOptions, 'mousedown', $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$defaultOptions);
var $author$project$BoardCellGrid$Click = 0;
var $author$project$BoardCellGrid$onMouseDown = function (position) {
	return function (r) {
		var _v0 = r.bT;
		var x = _v0.a;
		var y = _v0.b;
		return {
			bq: position,
			br: {cP: x, cQ: y},
			bB: 0
		};
	};
};
var $author$project$BoardCellGrid$Hover = 1;
var $author$project$BoardCellGrid$onMouseHover = function (position) {
	return function (r) {
		var _v0 = r.bT;
		var x = _v0.a;
		var y = _v0.b;
		return {
			bq: position,
			br: {cP: x, cQ: y},
			bB: 1
		};
	};
};
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onOver = A2($mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onWithOptions, 'mouseover', $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$defaultOptions);
var $elm$svg$Svg$rect = $elm$svg$Svg$trustedNode('rect');
var $elm$svg$Svg$Attributes$stroke = _VirtualDom_attribute('stroke');
var $elm$svg$Svg$Attributes$strokeWidth = _VirtualDom_attribute('stroke-width');
var $avh4$elm_color$Color$toRgba = function (_v0) {
	var r = _v0.a;
	var g = _v0.b;
	var b = _v0.c;
	var a = _v0.d;
	return {cU: a, cY: b, dm: g, dN: r};
};
var $author$project$BoardCellGrid$toCssString = function (color) {
	var roundTo = function (x) {
		return $elm$core$Basics$round(x * 1000) / 1000;
	};
	var rgba = $avh4$elm_color$Color$toRgba(color);
	var r = rgba.dN;
	var pct = function (x) {
		return $elm$core$Basics$round(x * 10000) / 100;
	};
	var g = rgba.dm;
	var b = rgba.cY;
	var a = rgba.cU;
	return 'rgba(' + ($elm$core$String$fromFloat(
		pct(r)) + ('%,' + ($elm$core$String$fromFloat(
		pct(g)) + ('%,' + ($elm$core$String$fromFloat(
		pct(b)) + ('%,' + ($elm$core$String$fromFloat(
		roundTo(a)) + ')')))))));
};
var $elm$svg$Svg$Attributes$width = _VirtualDom_attribute('width');
var $elm$svg$Svg$Attributes$x = _VirtualDom_attribute('x');
var $elm$svg$Svg$Attributes$y = _VirtualDom_attribute('y');
var $author$project$BoardCellGrid$renderCell = F3(
	function (style, position, value) {
		return A2(
			$elm$svg$Svg$rect,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$class('cell'),
					$elm$svg$Svg$Attributes$width(
					$elm$core$String$fromFloat(style.w)),
					$elm$svg$Svg$Attributes$height(
					$elm$core$String$fromFloat(style.v)),
					$elm$svg$Svg$Attributes$x(
					$elm$core$String$fromFloat(style.w * position.bU)),
					$elm$svg$Svg$Attributes$y(
					$elm$core$String$fromFloat(style.v * position.cB)),
					$elm$svg$Svg$Attributes$strokeWidth(
					$elm$core$String$fromFloat(style.b5)),
					$elm$svg$Svg$Attributes$fill(
					$author$project$BoardCellGrid$toCssString(
						style.cJ(value))),
					$elm$svg$Svg$Attributes$stroke(
					$author$project$BoardCellGrid$toCssString(style.b4)),
					$elm$svg$Svg$Attributes$fillOpacity('1'),
					$mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onDown(
					$author$project$BoardCellGrid$onMouseDown(position)),
					$mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onOver(
					$author$project$BoardCellGrid$onMouseHover(position))
				]),
			_List_Nil);
	});
var $elm$svg$Svg$circle = $elm$svg$Svg$trustedNode('circle');
var $elm$svg$Svg$Attributes$cx = _VirtualDom_attribute('cx');
var $elm$svg$Svg$Attributes$cy = _VirtualDom_attribute('cy');
var $elm$svg$Svg$Attributes$r = _VirtualDom_attribute('r');
var $elm$svg$Svg$Attributes$points = _VirtualDom_attribute('points');
var $elm$svg$Svg$polyline = $elm$svg$Svg$trustedNode('polyline');
var $elm$svg$Svg$Attributes$z = _VirtualDom_attribute('z');
var $author$project$BoardCellGrid$renderMinus = F3(
	function (style, position, value) {
		var length = style.w * style.bl(value);
		var borders = (style.w - length) / 2;
		return _List_fromArray(
			[
				A2(
				$elm$svg$Svg$polyline,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$points(
						A2(
							$elm$core$String$join,
							' ',
							A2(
								$elm$core$List$map,
								function (_v0) {
									var x = _v0.a;
									var y = _v0.b;
									return $elm$core$String$fromFloat(x) + (',' + $elm$core$String$fromFloat(y));
								},
								_List_fromArray(
									[
										_Utils_Tuple2(style.v + borders, style.v * 1.5),
										_Utils_Tuple2((style.v + borders) + length, style.v * 1.5)
									])))),
						$elm$svg$Svg$Attributes$class(
						style.aQ(value) + '-text'),
						$elm$svg$Svg$Attributes$stroke(
						$author$project$BoardCellGrid$toCssString(
							style.aC(value))),
						$elm$svg$Svg$Attributes$strokeWidth(
						$elm$core$String$fromFloat(style.aM * 2.5)),
						$elm$svg$Svg$Attributes$z('600'),
						$mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onDown(
						$author$project$BoardCellGrid$onMouseDown(position)),
						$mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onOver(
						$author$project$BoardCellGrid$onMouseHover(position))
					]),
				_List_Nil)
			]);
	});
var $author$project$BoardCellGrid$renderPlus = F3(
	function (style, position, value) {
		var length = style.w * style.bl(value);
		var borders = (style.w - length) / 2;
		return _List_fromArray(
			[
				A2(
				$elm$svg$Svg$polyline,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$points(
						A2(
							$elm$core$String$join,
							' ',
							A2(
								$elm$core$List$map,
								function (_v0) {
									var x = _v0.a;
									var y = _v0.b;
									return $elm$core$String$fromFloat(x) + (',' + $elm$core$String$fromFloat(y));
								},
								_List_fromArray(
									[
										_Utils_Tuple2(style.w * 1.5, style.w + borders),
										_Utils_Tuple2(style.w * 1.5, (style.w + borders) + length)
									])))),
						$elm$svg$Svg$Attributes$class(
						style.aQ(value) + '-text'),
						$elm$svg$Svg$Attributes$stroke(
						$author$project$BoardCellGrid$toCssString(
							style.aC(value))),
						$elm$svg$Svg$Attributes$strokeWidth(
						$elm$core$String$fromFloat(style.aM * 2.5)),
						$elm$svg$Svg$Attributes$z('600'),
						$mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onDown(
						$author$project$BoardCellGrid$onMouseDown(position)),
						$mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onOver(
						$author$project$BoardCellGrid$onMouseHover(position))
					]),
				_List_Nil),
				A2(
				$elm$svg$Svg$polyline,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$points(
						A2(
							$elm$core$String$join,
							' ',
							A2(
								$elm$core$List$map,
								function (_v1) {
									var x = _v1.a;
									var y = _v1.b;
									return $elm$core$String$fromFloat(x) + (',' + $elm$core$String$fromFloat(y));
								},
								_List_fromArray(
									[
										_Utils_Tuple2(style.v + borders, style.v * 1.5),
										_Utils_Tuple2((style.v + borders) + length, style.v * 1.5)
									])))),
						$elm$svg$Svg$Attributes$class(
						style.aQ(value)),
						$elm$svg$Svg$Attributes$stroke(
						$author$project$BoardCellGrid$toCssString(
							style.aC(value))),
						$elm$svg$Svg$Attributes$strokeWidth(
						$elm$core$String$fromFloat(style.aM * 2)),
						$elm$svg$Svg$Attributes$z('600'),
						$mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onDown(
						$author$project$BoardCellGrid$onMouseDown(position)),
						$mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onOver(
						$author$project$BoardCellGrid$onMouseHover(position))
					]),
				_List_Nil)
			]);
	});
var $elm$svg$Svg$svg = $elm$svg$Svg$trustedNode('svg');
var $avh4$elm_color$Color$RgbaSpace = F4(
	function (a, b, c, d) {
		return {$: 0, a: a, b: b, c: c, d: d};
	});
var $avh4$elm_color$Color$white = A4($avh4$elm_color$Color$RgbaSpace, 255 / 255, 255 / 255, 255 / 255, 1.0);
var $author$project$BoardCellGrid$renderPiece = F3(
	function (style, position, value) {
		return style.cF(value) ? _List_fromArray(
			[
				A2(
				$elm$svg$Svg$svg,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$width(
						$elm$core$String$fromFloat(style.w * 3)),
						$elm$svg$Svg$Attributes$height(
						$elm$core$String$fromFloat(style.v * 3)),
						$elm$svg$Svg$Attributes$x(
						$elm$core$String$fromFloat(style.w * (position.bU - 1))),
						$elm$svg$Svg$Attributes$y(
						$elm$core$String$fromFloat(style.v * (position.cB - 1))),
						$elm$svg$Svg$Attributes$strokeWidth('0')
					]),
				_Utils_ap(
					_List_fromArray(
						[
							A2(
							$elm$svg$Svg$circle,
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$class(
									style.aQ(value)),
									$elm$svg$Svg$Attributes$cx('50%'),
									$elm$svg$Svg$Attributes$cy('50%'),
									$elm$svg$Svg$Attributes$r('0%'),
									$elm$svg$Svg$Attributes$strokeWidth('0'),
									$elm$svg$Svg$Attributes$fill(
									$author$project$BoardCellGrid$toCssString($avh4$elm_color$Color$white)),
									$elm$svg$Svg$Attributes$stroke(
									$author$project$BoardCellGrid$toCssString(
										style.aC(value))),
									$elm$svg$Svg$Attributes$fillOpacity('0.5'),
									$elm$svg$Svg$Attributes$z('300'),
									$mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onDown(
									$author$project$BoardCellGrid$onMouseDown(position)),
									$mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onOver(
									$author$project$BoardCellGrid$onMouseHover(position))
								]),
							_List_Nil),
							A2(
							$elm$svg$Svg$circle,
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$class('piece'),
									$elm$svg$Svg$Attributes$cx('50%'),
									$elm$svg$Svg$Attributes$cy('50%'),
									$elm$svg$Svg$Attributes$r(
									$elm$core$String$fromFloat(
										style.bl(value) * 33) + '%'),
									$elm$svg$Svg$Attributes$strokeWidth(
									$elm$core$String$fromFloat(style.aM)),
									$elm$svg$Svg$Attributes$fill(
									$author$project$BoardCellGrid$toCssString(
										style.cL(value))),
									$elm$svg$Svg$Attributes$stroke(
									$author$project$BoardCellGrid$toCssString(
										style.aC(value))),
									$elm$svg$Svg$Attributes$fillOpacity('1'),
									$elm$svg$Svg$Attributes$z('500'),
									$mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onDown(
									$author$project$BoardCellGrid$onMouseDown(position)),
									$mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onOver(
									$author$project$BoardCellGrid$onMouseHover(position))
								]),
							_List_Nil)
						]),
					(style.cN(value) === '+') ? A3($author$project$BoardCellGrid$renderPlus, style, position, value) : A3($author$project$BoardCellGrid$renderMinus, style, position, value)))
			]) : _List_Nil;
	});
var $author$project$BoardCellGrid$asSvg = F2(
	function (style, cellGrid) {
		var pieces = A3(
			$jxxcarlson$elm_cell_grid$CellGrid$foldr,
			$elm$core$Basics$append,
			_List_Nil,
			A2(
				$jxxcarlson$elm_cell_grid$CellGrid$indexedMap,
				F2(
					function (i, j) {
						return A2(
							$author$project$BoardCellGrid$renderPiece,
							style,
							A2($jxxcarlson$elm_cell_grid$CellGrid$Position, i, j));
					}),
				cellGrid));
		var boxes = A3(
			$jxxcarlson$elm_cell_grid$CellGrid$foldr,
			$elm$core$List$cons,
			_List_Nil,
			A2(
				$jxxcarlson$elm_cell_grid$CellGrid$indexedMap,
				F2(
					function (i, j) {
						return A2(
							$author$project$BoardCellGrid$renderCell,
							style,
							A2($jxxcarlson$elm_cell_grid$CellGrid$Position, i, j));
					}),
				cellGrid));
		return A2(
			$elm$svg$Svg$g,
			_List_Nil,
			_Utils_ap(boxes, pieces));
	});
var $elm$svg$Svg$Attributes$viewBox = _VirtualDom_attribute('viewBox');
var $author$project$BoardCellGrid$asHtml = F3(
	function (_v0, cr, cellGrid) {
		var width = _v0.d3;
		var height = _v0.dn;
		return A2(
			$elm$svg$Svg$svg,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$height(
					$elm$core$String$fromInt(height)),
					$elm$svg$Svg$Attributes$width(
					$elm$core$String$fromInt(width)),
					$elm$svg$Svg$Attributes$viewBox(
					'0 0 ' + ($elm$core$String$fromInt(width) + (' ' + $elm$core$String$fromInt(height))))
				]),
			_List_fromArray(
				[
					A2($author$project$BoardCellGrid$asSvg, cr, cellGrid)
				]));
	});
var $avh4$elm_color$Color$darkGrey = A4($avh4$elm_color$Color$RgbaSpace, 186 / 255, 189 / 255, 182 / 255, 1.0);
var $avh4$elm_color$Color$fromRgba = function (components) {
	return A4($avh4$elm_color$Color$RgbaSpace, components.dN, components.dm, components.cY, components.cU);
};
var $avh4$elm_color$Color$hsla = F4(
	function (hue, sat, light, alpha) {
		var _v0 = _Utils_Tuple3(hue, sat, light);
		var h = _v0.a;
		var s = _v0.b;
		var l = _v0.c;
		var m2 = (l <= 0.5) ? (l * (s + 1)) : ((l + s) - (l * s));
		var m1 = (l * 2) - m2;
		var hueToRgb = function (h__) {
			var h_ = (h__ < 0) ? (h__ + 1) : ((h__ > 1) ? (h__ - 1) : h__);
			return ((h_ * 6) < 1) ? (m1 + (((m2 - m1) * h_) * 6)) : (((h_ * 2) < 1) ? m2 : (((h_ * 3) < 2) ? (m1 + (((m2 - m1) * ((2 / 3) - h_)) * 6)) : m1));
		};
		var b = hueToRgb(h - (1 / 3));
		var g = hueToRgb(h);
		var r = hueToRgb(h + (1 / 3));
		return A4($avh4$elm_color$Color$RgbaSpace, r, g, b, alpha);
	});
var $avh4$elm_color$Color$fromHsla = function (_v0) {
	var hue = _v0.aw;
	var saturation = _v0.az;
	var lightness = _v0.ao;
	var alpha = _v0.cU;
	return A4($avh4$elm_color$Color$hsla, hue, saturation, lightness, alpha);
};
var $author$project$Models$Blue = 1;
var $author$project$Models$Green = 2;
var $author$project$Models$Red = 0;
var $author$project$Models$White = 4;
var $author$project$Models$Yellow = 3;
var $author$project$Models$getPlayerColor = function (number) {
	switch (number) {
		case 0:
			return 0;
		case 1:
			return 1;
		case 2:
			return 2;
		case 3:
			return 3;
		case 4:
			return 4;
		default:
			return 0;
	}
};
var $author$project$Utils$ColorUtils$addHslaVectors = F2(
	function (hsla1, hsla2) {
		return {
			V: A2($elm$core$Basics$max, hsla1.V, hsla2.V),
			cP: hsla1.cP + hsla2.cP,
			cQ: hsla1.cQ + hsla2.cQ,
			aa: hsla1.aa + hsla2.aa
		};
	});
var $elm$core$Basics$cos = _Basics_cos;
var $elm$core$Basics$pi = _Basics_pi;
var $author$project$Utils$ColorUtils$radiansToHue = function (radians) {
	return radians * 360;
};
var $elm$core$Basics$sin = _Basics_sin;
var $author$project$Utils$ColorUtils$hslaToVector = F2(
	function (hsla, strength) {
		return {
			V: hsla.cU,
			cP: ($elm$core$Basics$cos(
				($author$project$Utils$ColorUtils$radiansToHue(hsla.aw) / 180) * $elm$core$Basics$pi) * hsla.az) * strength,
			cQ: ($elm$core$Basics$sin(
				($author$project$Utils$ColorUtils$radiansToHue(hsla.aw) / 180) * $elm$core$Basics$pi) * hsla.az) * strength,
			aa: hsla.ao * strength
		};
	});
var $elm$core$Basics$atan2 = _Basics_atan2;
var $author$project$Utils$ColorUtils$hueToRadians = function (hue) {
	return hue / 360;
};
var $author$project$Utils$ColorUtils$hslaVectorToHsla = function (hslaVector) {
	return {
		cU: hslaVector.V,
		aw: $author$project$Utils$ColorUtils$hueToRadians(
			((A2($elm$core$Basics$atan2, hslaVector.cQ, hslaVector.cP) * 180) / $elm$core$Basics$pi) + 360),
		ao: hslaVector.aa,
		az: $elm$core$Basics$sqrt((hslaVector.cP * hslaVector.cP) + (hslaVector.cQ * hslaVector.cQ))
	};
};
var $elm$core$List$sum = function (numbers) {
	return A3($elm$core$List$foldl, $elm$core$Basics$add, 0, numbers);
};
var $author$project$Utils$Utils$meanSquare = function (list) {
	var exps = A2(
		$elm$core$List$map,
		function (x) {
			return A2($elm$core$Basics$pow, x, 1.5);
		},
		list);
	var sum = $elm$core$List$sum(exps);
	return A2(
		$elm$core$List$map,
		function (x) {
			return x / sum;
		},
		exps);
};
var $elm$core$Tuple$second = function (_v0) {
	var y = _v0.b;
	return y;
};
var $author$project$Utils$ColorUtils$zeroHslaVector = {V: 0, cP: 0, cQ: 0, aa: 0};
var $author$project$Utils$ColorUtils$mergeHslas = function (hslaList) {
	var softmaxStrengths = A3(
		$elm$core$List$map2,
		F2(
			function (_v1, softmaxStrength) {
				var hsla = _v1.a;
				return _Utils_Tuple2(hsla, softmaxStrength);
			}),
		hslaList,
		$author$project$Utils$Utils$meanSquare(
			A2($elm$core$List$map, $elm$core$Tuple$second, hslaList)));
	return $author$project$Utils$ColorUtils$hslaVectorToHsla(
		A3(
			$elm$core$List$foldl,
			F2(
				function (_v0, accum) {
					var hsla = _v0.a;
					var strength = _v0.b;
					return A2(
						$author$project$Utils$ColorUtils$addHslaVectors,
						A2($author$project$Utils$ColorUtils$hslaToVector, hsla, strength),
						accum);
				}),
			$author$project$Utils$ColorUtils$zeroHslaVector,
			softmaxStrengths));
};
var $author$project$Models$playerColorToHslaBoard = F4(
	function (totalPieces, playerColor, strength, gameMagnetism) {
		switch (playerColor) {
			case 0:
				return {
					cU: 0.9,
					aw: $author$project$Utils$ColorUtils$hueToRadians(0),
					ao: 0.65 - (0.5 * $elm$core$Basics$sqrt((strength / totalPieces) / gameMagnetism)),
					az: 1
				};
			case 1:
				return {
					cU: 0.9,
					aw: $author$project$Utils$ColorUtils$hueToRadians(240),
					ao: 0.65 - (0.5 * $elm$core$Basics$sqrt((strength / totalPieces) / gameMagnetism)),
					az: 1
				};
			case 2:
				return {
					cU: 0.9,
					aw: $author$project$Utils$ColorUtils$hueToRadians(120),
					ao: 0.65 - (0.5 * ((strength / totalPieces) / gameMagnetism)),
					az: 1
				};
			case 3:
				return {
					cU: 0.9,
					aw: $author$project$Utils$ColorUtils$hueToRadians(60),
					ao: 0.65 - (0.5 * ((strength / totalPieces) / gameMagnetism)),
					az: 1
				};
			default:
				return {
					cU: 0,
					aw: $author$project$Utils$ColorUtils$hueToRadians(0),
					ao: 1,
					az: 1
				};
		}
	});
var $author$project$Models$getMagneticFieldColorMixed = F3(
	function (totalPieces, magnetism, field) {
		var totalStrength = A3(
			$elm$core$Dict$foldl,
			F3(
				function (player, strength, total) {
					return total + strength;
				}),
			0,
			field.p);
		return (totalStrength > 0) ? $avh4$elm_color$Color$fromHsla(
			$author$project$Utils$ColorUtils$mergeHslas(
				$elm$core$Dict$values(
					A2(
						$elm$core$Dict$map,
						F2(
							function (player, strength) {
								return _Utils_Tuple2(
									A4(
										$author$project$Models$playerColorToHslaBoard,
										totalPieces,
										$author$project$Models$getPlayerColor(player),
										strength,
										magnetism),
									strength / totalStrength);
							}),
						field.p)))) : $avh4$elm_color$Color$darkGrey;
	});
var $author$project$Models$hslaToColor = function (hsla) {
	return $avh4$elm_color$Color$fromHsla(hsla);
};
var $author$project$Models$getPieceColor = function (piece) {
	var lightness = function () {
		var _v0 = piece.y;
		switch (_v0) {
			case 0:
				return 0.75;
			case 1:
				return 0.25;
			default:
				return 0.5;
		}
	}();
	return $author$project$Models$hslaToColor(
		function (hsla) {
			return _Utils_update(
				hsla,
				{cU: 1, ao: lightness});
		}(
			A4(
				$author$project$Models$playerColorToHslaBoard,
				1,
				$author$project$Models$getPlayerColor(piece.bf),
				1,
				1)));
};
var $author$project$Models$getCellColorFromContent = F3(
	function (totalPieces, magnetism, content) {
		switch (content.$) {
			case 0:
				var piece = content.a;
				return $avh4$elm_color$Color$darkGrey;
			case 1:
				return $avh4$elm_color$Color$darkGrey;
			case 2:
				var field = content.a;
				return A3($author$project$Models$getMagneticFieldColorMixed, totalPieces, magnetism, field);
			case 3:
				var piece = content.a;
				var field = content.b;
				return $author$project$Models$getPieceColor(piece);
			default:
				switch (content.b) {
					case 1:
						return $avh4$elm_color$Color$fromRgba(
							{cU: 0.3, cY: 0, dm: 0, dN: 0});
					case 2:
						return $avh4$elm_color$Color$fromRgba(
							{cU: 0.15, cY: 0, dm: 0, dN: 0});
					default:
						return $avh4$elm_color$Color$fromRgba(
							{cU: 0.05, cY: 0, dm: 0, dN: 0});
				}
		}
	});
var $author$project$Models$getCellOpacityFromContent = F2(
	function (opacity, content) {
		switch (content.$) {
			case 0:
				var piece = content.a;
				return opacity;
			case 1:
				return opacity;
			case 2:
				var field = content.a;
				return 1 - A2(
					$elm$core$Basics$pow,
					opacity,
					$elm$core$Dict$size(field.p));
			case 3:
				var field = content.b;
				return 1 - A2(
					$elm$core$Basics$pow,
					opacity,
					$elm$core$Dict$size(field.p));
			default:
				return 1;
		}
	});
var $author$project$Models$getPieceClassFromContent = function (content) {
	_v0$3:
	while (true) {
		switch (content.$) {
			case 0:
				var piece = content.a;
				return 'live-piece';
			case 3:
				var piece = content.a;
				return 'live-piece';
			case 4:
				if (!content.a.$) {
					var piece = content.a.a;
					return 'dead-piece';
				} else {
					break _v0$3;
				}
			default:
				break _v0$3;
		}
	}
	return '';
};
var $author$project$Models$getPieceColorFromContent = function (content) {
	_v0$3:
	while (true) {
		switch (content.$) {
			case 0:
				var piece = content.a;
				return $author$project$Models$getPieceColor(piece);
			case 3:
				var piece = content.a;
				return $author$project$Models$getPieceColor(piece);
			case 4:
				if (!content.a.$) {
					var piece = content.a.a;
					return $author$project$Models$getPieceColor(piece);
				} else {
					break _v0$3;
				}
			default:
				break _v0$3;
		}
	}
	return $avh4$elm_color$Color$white;
};
var $author$project$Models$getPieceScaleFromContent = function (content) {
	_v0$3:
	while (true) {
		switch (content.$) {
			case 0:
				var piece = content.a;
				return 1.0;
			case 3:
				var piece = content.a;
				return 1.0;
			case 4:
				if (!content.a.$) {
					var piece = content.a.a;
					return 0.5;
				} else {
					break _v0$3;
				}
			default:
				break _v0$3;
		}
	}
	return 1.0;
};
var $avh4$elm_color$Color$black = A4($avh4$elm_color$Color$RgbaSpace, 0 / 255, 0 / 255, 0 / 255, 1.0);
var $avh4$elm_color$Color$darkCharcoal = A4($avh4$elm_color$Color$RgbaSpace, 46 / 255, 52 / 255, 54 / 255, 1.0);
var $avh4$elm_color$Color$darkGray = A4($avh4$elm_color$Color$RgbaSpace, 186 / 255, 189 / 255, 182 / 255, 1.0);
var $author$project$Models$getTextColorFromContent = function (content) {
	var textColorFromPiece = function (piece) {
		var _v2 = piece.y;
		switch (_v2) {
			case 0:
				return $avh4$elm_color$Color$darkCharcoal;
			case 1:
				return $avh4$elm_color$Color$darkGray;
			default:
				return $avh4$elm_color$Color$darkCharcoal;
		}
	};
	switch (content.$) {
		case 0:
			var piece = content.a;
			return textColorFromPiece(piece);
		case 1:
			return $avh4$elm_color$Color$black;
		case 2:
			return $avh4$elm_color$Color$black;
		case 3:
			var piece = content.a;
			return textColorFromPiece(piece);
		default:
			if (!content.a.$) {
				var p = content.a.a;
				return textColorFromPiece(p);
			} else {
				var _v1 = content.a;
				return $avh4$elm_color$Color$black;
			}
	}
};
var $author$project$Models$toPolarityIcon = function (polarity) {
	switch (polarity) {
		case 0:
			return '+';
		case 1:
			return '−';
		default:
			return '';
	}
};
var $author$project$Models$getTextFromContent = function (content) {
	switch (content.$) {
		case 0:
			var piece = content.a;
			return $author$project$Models$toPolarityIcon(piece.y);
		case 1:
			return '';
		case 2:
			var field = content.a;
			return '';
		case 3:
			var piece = content.a;
			var field = content.b;
			return $author$project$Models$toPolarityIcon(piece.y);
		default:
			if (!content.a.$) {
				var p = content.a.a;
				return $author$project$Models$toPolarityIcon(p.y);
			} else {
				var _v1 = content.a;
				return '';
			}
	}
};
var $avh4$elm_color$Color$rgb = F3(
	function (r, g, b) {
		return A4($avh4$elm_color$Color$RgbaSpace, r, g, b, 1.0);
	});
var $author$project$Models$cellStyle = F3(
	function (padding, magnetism, board) {
		return {
			v: (board.bW.dd / (board.bW.bz + (2 * padding))) | 0,
			w: (board.bW.dd / (board.bW.bz + (2 * padding))) | 0,
			b4: A3($avh4$elm_color$Color$rgb, 0, 0, 0),
			b5: 0,
			aM: ((board.bW.dd / board.bW.bz) | 0) / 10,
			cF: function (content) {
				_v0$3:
				while (true) {
					switch (content.$) {
						case 0:
							return true;
						case 3:
							return true;
						case 4:
							if (!content.a.$) {
								var p = content.a.a;
								return true;
							} else {
								break _v0$3;
							}
						default:
							break _v0$3;
					}
				}
				return false;
			},
			cJ: function (z) {
				return A3(
					$author$project$Models$getCellColorFromContent,
					$elm$core$Dict$size(board.E) + $elm$core$Dict$size(board.ai),
					magnetism,
					z);
			},
			d_: function (z) {
				return A2($author$project$Models$getCellOpacityFromContent, 0.7, z);
			},
			aQ: function (z) {
				return $author$project$Models$getPieceClassFromContent(z);
			},
			cL: function (z) {
				return $author$project$Models$getPieceColorFromContent(z);
			},
			bl: function (z) {
				return $author$project$Models$getPieceScaleFromContent(z);
			},
			aC: function (content) {
				return $author$project$Models$getTextColorFromContent(content);
			},
			cN: function (content) {
				return $author$project$Models$getTextFromContent(content);
			}
		};
	});
var $jxxcarlson$elm_cell_grid$CellGrid$Dimensions = F2(
	function (rows, columns) {
		return {m: columns, ah: rows};
	});
var $author$project$Models$DarkZone = F2(
	function (a, b) {
		return {$: 4, a: a, b: b};
	});
var $author$project$Models$GridMagneticField = function (a) {
	return {$: 2, a: a};
};
var $author$project$Models$GridPiece = function (a) {
	return {$: 0, a: a};
};
var $author$project$Models$NoContent = {$: 1};
var $author$project$Models$PieceOnField = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var $author$project$Models$getDarkZoneDegree = F3(
	function (padding, board, coordinate) {
		var yDegree = (_Utils_cmp(coordinate.cQ, padding) < 0) ? $elm$core$Basics$abs(padding - coordinate.cQ) : ((_Utils_cmp(coordinate.cQ, board.bW.bz + padding) > -1) ? $elm$core$Basics$abs(coordinate.cQ - ((board.bW.bz + padding) - 1)) : 0);
		var xDegree = (_Utils_cmp(coordinate.cP, padding) < 0) ? $elm$core$Basics$abs(padding - coordinate.cP) : ((_Utils_cmp(coordinate.cP, board.bW.bz + padding) > -1) ? $elm$core$Basics$abs(coordinate.cP - ((board.bW.bz + padding) - 1)) : 0);
		return A2($elm$core$Basics$max, xDegree, yDegree);
	});
var $author$project$Models$getTentativePieceFromCoordinate = F2(
	function (board, coordinate) {
		var pieceIndex = A2(
			$elm$core$Dict$get,
			$author$project$Utils$Utils$coordinateToTuple(coordinate),
			board.aB);
		return A2(
			$elm$core$Maybe$andThen,
			function (index) {
				return A2($elm$core$Dict$get, index, board.ai);
			},
			pieceIndex);
	});
var $author$project$Models$determineCellContent = F4(
	function (padding, magneticField, board, coordinate) {
		var boardCoordinates = A3($author$project$Models$mapViewCoordinateToBoard, padding, board.bW.bz, coordinate);
		if (!boardCoordinates.$) {
			var boardCoord = boardCoordinates.a;
			var tentativePiece = A2(
				$author$project$Models$getTentativePieceFromCoordinate,
				board,
				$author$project$Utils$Utils$intCoordinateToFloat(boardCoord));
			var piece = A2(
				$author$project$Models$getPieceFromCoordinate,
				board,
				$author$project$Utils$Utils$intCoordinateToFloat(boardCoord));
			var field = A2(
				$elm$core$Dict$get,
				$author$project$Utils$Utils$intCoordinateToTuple(boardCoord),
				magneticField);
			if (!piece.$) {
				var p = piece.a;
				if (!field.$) {
					var f = field.a;
					return A2($author$project$Models$PieceOnField, p, f);
				} else {
					return $author$project$Models$GridPiece(p);
				}
			} else {
				if (!tentativePiece.$) {
					var p = tentativePiece.a;
					if (!field.$) {
						var f = field.a;
						return A2($author$project$Models$PieceOnField, p, f);
					} else {
						return $author$project$Models$GridPiece(p);
					}
				} else {
					if (!field.$) {
						var f = field.a;
						return $author$project$Models$GridMagneticField(f);
					} else {
						return $author$project$Models$NoContent;
					}
				}
			}
		} else {
			var _v6 = A2($author$project$Models$getDeadPieceFromCoordinate, board, coordinate);
			if (!_v6.$) {
				var p = _v6.a;
				return A2(
					$author$project$Models$DarkZone,
					$elm$core$Maybe$Just(p),
					A3($author$project$Models$getDarkZoneDegree, padding, board, coordinate));
			} else {
				return A2(
					$author$project$Models$DarkZone,
					$elm$core$Maybe$Nothing,
					A3($author$project$Models$getDarkZoneDegree, padding, board, coordinate));
			}
		}
	});
var $jxxcarlson$elm_cell_grid$CellGrid$initialize = F2(
	function (dimensions, temperatureMap) {
		var helper = function (index) {
			var row = (index / dimensions.m) | 0;
			var column = index % dimensions.m;
			return A2(temperatureMap, row, column);
		};
		return A2(
			$jxxcarlson$elm_cell_grid$CellGrid$CellGrid,
			dimensions,
			A2($elm$core$Array$initialize, dimensions.ah * dimensions.m, helper));
	});
var $author$project$Models$getCellGrid = F2(
	function (padding, board) {
		var gridDimensions = board.bW.bz + (padding * 2);
		return A2(
			$jxxcarlson$elm_cell_grid$CellGrid$initialize,
			A2($jxxcarlson$elm_cell_grid$CellGrid$Dimensions, gridDimensions, gridDimensions),
			F2(
				function (i, j) {
					return A4(
						$author$project$Models$determineCellContent,
						padding,
						board.aJ,
						board,
						{cP: j, cQ: i});
				}));
	});
var $author$project$Models$boardHtml = F3(
	function (padding, magnetism, board) {
		return A2(
			$elm$html$Html$map,
			$elm$core$Basics$identity,
			A3(
				$author$project$BoardCellGrid$asHtml,
				{dn: board.bW.dd, d3: board.bW.dd},
				A3($author$project$Models$cellStyle, padding, magnetism, board),
				A2($author$project$Models$getCellGrid, padding, board)));
	});
var $author$project$Game$getBoardView = function (game) {
	return A2(
		$elm$html$Html$map,
		$author$project$Game$ModelMsg,
		A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$id('board-container'),
					$elm$html$Html$Attributes$class('game-board')
				]),
			_List_fromArray(
				[
					A3($author$project$Models$boardHtml, game.af, game.X, game.b)
				])));
};
var $author$project$Game$getGameWinner = function (game) {
	var playerScores = $author$project$Game$getGameScore(game);
	return A3(
		$elm$core$Dict$foldl,
		F3(
			function (player, score, _v0) {
				var aPlayer = _v0.a;
				var aScore = _v0.b;
				return (_Utils_cmp(score, aScore) > 0) ? _Utils_Tuple2(player, score) : _Utils_Tuple2(aPlayer, aScore);
			}),
		_Utils_Tuple2(-1, -1),
		playerScores).a;
};
var $author$project$Models$None = 2;
var $author$project$Utils$ColorUtils$px = function (x) {
	return $elm$core$String$fromInt(x) + 'px';
};
var $elm$virtual_dom$VirtualDom$style = _VirtualDom_style;
var $elm$html$Html$Attributes$style = $elm$virtual_dom$VirtualDom$style;
var $author$project$Utils$ColorUtils$toCssString = function (color) {
	var roundTo = function (x) {
		return $elm$core$Basics$round(x * 1000) / 1000;
	};
	var rgba = $avh4$elm_color$Color$toRgba(color);
	var r = rgba.dN;
	var pct = function (x) {
		return $elm$core$Basics$round(x * 10000) / 100;
	};
	var g = rgba.dm;
	var b = rgba.cY;
	var a = rgba.cU;
	return 'rgba(' + ($elm$core$String$fromFloat(
		pct(r)) + ('%,' + ($elm$core$String$fromFloat(
		pct(g)) + ('%,' + ($elm$core$String$fromFloat(
		pct(b)) + ('%,' + ($elm$core$String$fromFloat(
		roundTo(a)) + ')')))))));
};
var $author$project$Game$playerNumContainer = F3(
	function (isHeader, game, playerNum) {
		var textSize = isHeader ? $author$project$Utils$ColorUtils$px(24) : $author$project$Utils$ColorUtils$px(
			24 - (2 * $elm$core$Dict$size(game.c)));
		var size = isHeader ? $author$project$Utils$ColorUtils$px(30) : $author$project$Utils$ColorUtils$px(
			55 - (10 * $elm$core$Dict$size(game.c)));
		var playerAgent = function () {
			var _v0 = A2($author$project$Game$getPlayerAgency, playerNum, game);
			switch (_v0) {
				case 0:
					return '';
				case 1:
					return '(AI)';
				default:
					return '(AI)';
			}
		}();
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$id('num-container'),
					$elm$html$Html$Attributes$class('player-number-container')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$id('player-color'),
							$elm$html$Html$Attributes$class('player-color-indicator'),
							$elm$svg$Svg$Attributes$width(size)
						]),
					_List_fromArray(
						[
							A2(
							$elm$svg$Svg$svg,
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$viewBox('0 0 100 100'),
									$elm$svg$Svg$Attributes$width(size),
									$elm$svg$Svg$Attributes$height(size)
								]),
							_List_fromArray(
								[
									A2(
									$elm$svg$Svg$circle,
									_List_fromArray(
										[
											$elm$svg$Svg$Attributes$cx('50%'),
											$elm$svg$Svg$Attributes$cy('50%'),
											$elm$svg$Svg$Attributes$r('45%'),
											$elm$svg$Svg$Attributes$fill(
											$author$project$Utils$ColorUtils$toCssString(
												$author$project$Models$getPieceColor(
													{bf: playerNum, y: 2}))),
											$elm$svg$Svg$Attributes$stroke('#777'),
											$elm$svg$Svg$Attributes$strokeWidth('5')
										]),
									_List_Nil)
								]))
						])),
					A2(
					$elm$html$Html$h1,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$id('player-num'),
							$elm$html$Html$Attributes$class('player-number'),
							A2($elm$html$Html$Attributes$style, 'font-size', textSize)
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(
							'Player ' + ($elm$core$String$fromInt(playerNum + 1) + playerAgent))
						]))
				]));
	});
var $elm$core$List$any = F2(
	function (isOkay, list) {
		any:
		while (true) {
			if (!list.b) {
				return false;
			} else {
				var x = list.a;
				var xs = list.b;
				if (isOkay(x)) {
					return true;
				} else {
					var $temp$isOkay = isOkay,
						$temp$list = xs;
					isOkay = $temp$isOkay;
					list = $temp$list;
					continue any;
				}
			}
		}
	});
var $elm$core$String$foldr = _String_foldr;
var $elm$core$String$toList = function (string) {
	return A3($elm$core$String$foldr, $elm$core$List$cons, _List_Nil, string);
};
var $myrho$elm_round$Round$addSign = F2(
	function (signed, str) {
		var isNotZero = A2(
			$elm$core$List$any,
			function (c) {
				return (c !== '0') && (c !== '.');
			},
			$elm$core$String$toList(str));
		return _Utils_ap(
			(signed && isNotZero) ? '-' : '',
			str);
	});
var $elm$core$String$cons = _String_cons;
var $elm$core$Char$fromCode = _Char_fromCode;
var $myrho$elm_round$Round$increaseNum = function (_v0) {
	var head = _v0.a;
	var tail = _v0.b;
	if (head === '9') {
		var _v1 = $elm$core$String$uncons(tail);
		if (_v1.$ === 1) {
			return '01';
		} else {
			var headtail = _v1.a;
			return A2(
				$elm$core$String$cons,
				'0',
				$myrho$elm_round$Round$increaseNum(headtail));
		}
	} else {
		var c = $elm$core$Char$toCode(head);
		return ((c >= 48) && (c < 57)) ? A2(
			$elm$core$String$cons,
			$elm$core$Char$fromCode(c + 1),
			tail) : '0';
	}
};
var $elm$core$Basics$isInfinite = _Basics_isInfinite;
var $elm$core$Basics$isNaN = _Basics_isNaN;
var $elm$core$String$fromChar = function (_char) {
	return A2($elm$core$String$cons, _char, '');
};
var $elm$core$Bitwise$shiftRightBy = _Bitwise_shiftRightBy;
var $elm$core$String$repeatHelp = F3(
	function (n, chunk, result) {
		return (n <= 0) ? result : A3(
			$elm$core$String$repeatHelp,
			n >> 1,
			_Utils_ap(chunk, chunk),
			(!(n & 1)) ? result : _Utils_ap(result, chunk));
	});
var $elm$core$String$repeat = F2(
	function (n, chunk) {
		return A3($elm$core$String$repeatHelp, n, chunk, '');
	});
var $elm$core$String$padRight = F3(
	function (n, _char, string) {
		return _Utils_ap(
			string,
			A2(
				$elm$core$String$repeat,
				n - $elm$core$String$length(string),
				$elm$core$String$fromChar(_char)));
	});
var $elm$core$String$reverse = _String_reverse;
var $myrho$elm_round$Round$splitComma = function (str) {
	var _v0 = A2($elm$core$String$split, '.', str);
	if (_v0.b) {
		if (_v0.b.b) {
			var before = _v0.a;
			var _v1 = _v0.b;
			var after = _v1.a;
			return _Utils_Tuple2(before, after);
		} else {
			var before = _v0.a;
			return _Utils_Tuple2(before, '0');
		}
	} else {
		return _Utils_Tuple2('0', '0');
	}
};
var $elm$core$Tuple$mapFirst = F2(
	function (func, _v0) {
		var x = _v0.a;
		var y = _v0.b;
		return _Utils_Tuple2(
			func(x),
			y);
	});
var $myrho$elm_round$Round$toDecimal = function (fl) {
	var _v0 = A2(
		$elm$core$String$split,
		'e',
		$elm$core$String$fromFloat(
			$elm$core$Basics$abs(fl)));
	if (_v0.b) {
		if (_v0.b.b) {
			var num = _v0.a;
			var _v1 = _v0.b;
			var exp = _v1.a;
			var e = A2(
				$elm$core$Maybe$withDefault,
				0,
				$elm$core$String$toInt(
					A2($elm$core$String$startsWith, '+', exp) ? A2($elm$core$String$dropLeft, 1, exp) : exp));
			var _v2 = $myrho$elm_round$Round$splitComma(num);
			var before = _v2.a;
			var after = _v2.b;
			var total = _Utils_ap(before, after);
			var zeroed = (e < 0) ? A2(
				$elm$core$Maybe$withDefault,
				'0',
				A2(
					$elm$core$Maybe$map,
					function (_v3) {
						var a = _v3.a;
						var b = _v3.b;
						return a + ('.' + b);
					},
					A2(
						$elm$core$Maybe$map,
						$elm$core$Tuple$mapFirst($elm$core$String$fromChar),
						$elm$core$String$uncons(
							_Utils_ap(
								A2(
									$elm$core$String$repeat,
									$elm$core$Basics$abs(e),
									'0'),
								total))))) : A3($elm$core$String$padRight, e + 1, '0', total);
			return _Utils_ap(
				(fl < 0) ? '-' : '',
				zeroed);
		} else {
			var num = _v0.a;
			return _Utils_ap(
				(fl < 0) ? '-' : '',
				num);
		}
	} else {
		return '';
	}
};
var $myrho$elm_round$Round$roundFun = F3(
	function (functor, s, fl) {
		if ($elm$core$Basics$isInfinite(fl) || $elm$core$Basics$isNaN(fl)) {
			return $elm$core$String$fromFloat(fl);
		} else {
			var signed = fl < 0;
			var _v0 = $myrho$elm_round$Round$splitComma(
				$myrho$elm_round$Round$toDecimal(
					$elm$core$Basics$abs(fl)));
			var before = _v0.a;
			var after = _v0.b;
			var r = $elm$core$String$length(before) + s;
			var normalized = _Utils_ap(
				A2($elm$core$String$repeat, (-r) + 1, '0'),
				A3(
					$elm$core$String$padRight,
					r,
					'0',
					_Utils_ap(before, after)));
			var totalLen = $elm$core$String$length(normalized);
			var roundDigitIndex = A2($elm$core$Basics$max, 1, r);
			var increase = A2(
				functor,
				signed,
				A3($elm$core$String$slice, roundDigitIndex, totalLen, normalized));
			var remains = A3($elm$core$String$slice, 0, roundDigitIndex, normalized);
			var num = increase ? $elm$core$String$reverse(
				A2(
					$elm$core$Maybe$withDefault,
					'1',
					A2(
						$elm$core$Maybe$map,
						$myrho$elm_round$Round$increaseNum,
						$elm$core$String$uncons(
							$elm$core$String$reverse(remains))))) : remains;
			var numLen = $elm$core$String$length(num);
			var numZeroed = (num === '0') ? num : ((s <= 0) ? _Utils_ap(
				num,
				A2(
					$elm$core$String$repeat,
					$elm$core$Basics$abs(s),
					'0')) : ((_Utils_cmp(
				s,
				$elm$core$String$length(after)) < 0) ? (A3($elm$core$String$slice, 0, numLen - s, num) + ('.' + A3($elm$core$String$slice, numLen - s, numLen, num))) : _Utils_ap(
				before + '.',
				A3($elm$core$String$padRight, s, '0', after))));
			return A2($myrho$elm_round$Round$addSign, signed, numZeroed);
		}
	});
var $myrho$elm_round$Round$round = $myrho$elm_round$Round$roundFun(
	F2(
		function (signed, str) {
			var _v0 = $elm$core$String$uncons(str);
			if (_v0.$ === 1) {
				return false;
			} else {
				if ('5' === _v0.a.a) {
					if (_v0.a.b === '') {
						var _v1 = _v0.a;
						return !signed;
					} else {
						var _v2 = _v0.a;
						return true;
					}
				} else {
					var _v3 = _v0.a;
					var _int = _v3.a;
					return function (i) {
						return ((i > 53) && signed) || ((i >= 53) && (!signed));
					}(
						$elm$core$Char$toCode(_int));
				}
			}
		}));
var $author$project$Game$playerScoreContainer = F3(
	function (game, playerNum, player) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$id('player-score'),
					$elm$html$Html$Attributes$class('player-score-container')
				]),
			_List_fromArray(
				[
					A3($author$project$Game$playerNumContainer, false, game, playerNum),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('player-score-container')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$h2,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$id('score-box')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(
									'Score: ' + A2($myrho$elm_round$Round$round, 3, player.z))
								]))
						]))
				]));
	});
var $author$project$Game$getPlayerScoreContainers = function (game) {
	return $elm$core$Dict$values(
		A2(
			$elm$core$Dict$map,
			F2(
				function (index, playerData) {
					return A3($author$project$Game$playerScoreContainer, game, index, playerData);
				}),
			game.c));
};
var $author$project$Game$getGameOverContainer = function (game) {
	return _Utils_eq(game.d, $author$project$Game$GameOver) ? A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$id('game-over'),
				$elm$html$Html$Attributes$class('game-over-container')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$id('game-over-headers'),
						$elm$html$Html$Attributes$class('game-over-header-container')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$h1,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$id('game-over-subheader')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Winner: ')
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$id('player-numbers-row'),
								$elm$html$Html$Attributes$class('player-number-row')
							]),
						_List_fromArray(
							[
								A3(
								$author$project$Game$playerNumContainer,
								false,
								game,
								$author$project$Game$getGameWinner(game))
							]))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$id('game-over-scores'),
						$elm$html$Html$Attributes$class('game-over-scores-container')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$h1,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$id('game-over-subheader')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Scores: ')
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$id('player-score-container'),
								$elm$html$Html$Attributes$class('player-score-container')
							]),
						$author$project$Game$getPlayerScoreContainers(game))
					]))
			])) : A2($elm$html$Html$div, _List_Nil, _List_Nil);
};
var $author$project$Game$UpdatePlayerPolarity = F2(
	function (a, b) {
		return {$: 4, a: a, b: b};
	});
var $author$project$Game$polarityPickChoiceConfig = F2(
	function (player, game) {
		return {
			bC: 'Polarity',
			dG: _List_fromArray(
				[
					{
					ca: !A2($author$project$Game$getPlayerPolarity, player, game),
					bC: '+',
					cm: A2($author$project$Game$UpdatePlayerPolarity, player, 0)
				},
					{
					ca: A2($author$project$Game$getPlayerPolarity, player, game) === 1,
					bC: '-',
					cm: A2($author$project$Game$UpdatePlayerPolarity, player, 1)
				}
				])
		};
	});
var $author$project$SettingsComponents$PickChoiceButtons = function (a) {
	return {$: 5, a: a};
};
var $elm$html$Html$Attributes$classList = function (classes) {
	return $elm$html$Html$Attributes$class(
		A2(
			$elm$core$String$join,
			' ',
			A2(
				$elm$core$List$map,
				$elm$core$Tuple$first,
				A2($elm$core$List$filter, $elm$core$Tuple$second, classes))));
};
var $elm$core$Basics$composeR = F3(
	function (f, g, x) {
		return g(
			f(x));
	});
var $elm$html$Html$input = _VirtualDom_node('input');
var $elm$html$Html$label = _VirtualDom_node('label');
var $elm$html$Html$Attributes$max = $elm$html$Html$Attributes$stringProperty('max');
var $elm$html$Html$Attributes$min = $elm$html$Html$Attributes$stringProperty('min');
var $elm$html$Html$Events$alwaysStop = function (x) {
	return _Utils_Tuple2(x, true);
};
var $elm$virtual_dom$VirtualDom$MayStopPropagation = function (a) {
	return {$: 1, a: a};
};
var $elm$html$Html$Events$stopPropagationOn = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$MayStopPropagation(decoder));
	});
var $elm$json$Json$Decode$at = F2(
	function (fields, decoder) {
		return A3($elm$core$List$foldr, $elm$json$Json$Decode$field, decoder, fields);
	});
var $elm$json$Json$Decode$string = _Json_decodeString;
var $elm$html$Html$Events$targetValue = A2(
	$elm$json$Json$Decode$at,
	_List_fromArray(
		['target', 'value']),
	$elm$json$Json$Decode$string);
var $elm$html$Html$Events$onInput = function (tagger) {
	return A2(
		$elm$html$Html$Events$stopPropagationOn,
		'input',
		A2(
			$elm$json$Json$Decode$map,
			$elm$html$Html$Events$alwaysStop,
			A2($elm$json$Json$Decode$map, tagger, $elm$html$Html$Events$targetValue)));
};
var $elm$html$Html$option = _VirtualDom_node('option');
var $elm$core$String$replace = F3(
	function (before, after, string) {
		return A2(
			$elm$core$String$join,
			after,
			A2($elm$core$String$split, before, string));
	});
var $elm$html$Html$select = _VirtualDom_node('select');
var $elm$json$Json$Encode$bool = _Json_wrap;
var $elm$html$Html$Attributes$boolProperty = F2(
	function (key, bool) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$bool(bool));
	});
var $elm$html$Html$Attributes$selected = $elm$html$Html$Attributes$boolProperty('selected');
var $elm$html$Html$Attributes$step = function (n) {
	return A2($elm$html$Html$Attributes$stringProperty, 'step', n);
};
var $elm$core$String$toFloat = _String_toFloat;
var $elm$html$Html$Attributes$type_ = $elm$html$Html$Attributes$stringProperty('type');
var $elm$html$Html$Attributes$value = $elm$html$Html$Attributes$stringProperty('value');
var $author$project$SettingsComponents$viewPickerItem = F3(
	function (name, attributes, item) {
		switch (item.$) {
			case 0:
				var data = item.a;
				return A2(
					$elm$html$Html$div,
					A2(
						$elm$core$List$cons,
						$elm$html$Html$Attributes$class('setting-picker-item'),
						attributes),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$label,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('setting-picker-item-label')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(data.bC)
								])),
							A2(
							$elm$html$Html$input,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('setting-picker-item-input setting-picker-item-input-string'),
									$elm$html$Html$Attributes$type_('text'),
									$elm$html$Html$Attributes$value(data.d1),
									$elm$html$Html$Events$onInput(data.dC)
								]),
							_List_Nil)
						]));
			case 1:
				var data = item.a;
				return A2(
					$elm$html$Html$div,
					A2(
						$elm$core$List$cons,
						$elm$html$Html$Attributes$class('setting-picker-item'),
						attributes),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$label,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('setting-picker-item-label')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(data.bC)
								])),
							A2(
							$elm$html$Html$input,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('setting-picker-item-input setting-picker-item-input-float'),
									$elm$html$Html$Attributes$type_('number'),
									$elm$html$Html$Attributes$value(
									$elm$core$String$fromFloat(data.d1)),
									$elm$html$Html$Attributes$min(
									$elm$core$String$fromFloat(data.dx)),
									$elm$html$Html$Attributes$max(
									$elm$core$String$fromFloat(data.dv)),
									$elm$html$Html$Events$onInput(
									A2(
										$elm$core$Basics$composeR,
										$elm$core$String$toFloat,
										A2(
											$elm$core$Basics$composeR,
											$elm$core$Maybe$withDefault(0.0),
											data.dC)))
								]),
							_List_Nil)
						]));
			case 2:
				var data = item.a;
				return A2(
					$elm$html$Html$div,
					A2(
						$elm$core$List$cons,
						$elm$html$Html$Attributes$class('setting-picker-item'),
						attributes),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$label,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('setting-picker-item-label')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(data.bC)
								])),
							A2(
							$elm$html$Html$input,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('setting-picker-item-input setting-picker-item-input-int'),
									$elm$html$Html$Attributes$type_('number'),
									$elm$html$Html$Attributes$value(
									$elm$core$String$fromInt(data.d1)),
									$elm$html$Html$Attributes$min(
									$elm$core$String$fromInt(data.dx)),
									$elm$html$Html$Attributes$max(
									$elm$core$String$fromInt(data.dv)),
									$elm$html$Html$Events$onInput(
									A2(
										$elm$core$Basics$composeR,
										$elm$core$String$toInt,
										A2(
											$elm$core$Basics$composeR,
											$elm$core$Maybe$withDefault(0),
											data.dC)))
								]),
							_List_Nil)
						]));
			case 3:
				var data = item.a;
				return A2(
					$elm$html$Html$div,
					A2(
						$elm$core$List$cons,
						$elm$html$Html$Attributes$class('setting-picker-item'),
						attributes),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$label,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('setting-picker-item-label')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(data.bC)
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('setting-picker-item-input-container')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$input,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('setting-picker-item-input setting-picker-item-input-float-range'),
											$elm$html$Html$Attributes$type_('range'),
											$elm$html$Html$Attributes$value(
											$elm$core$String$fromFloat(data.d1)),
											$elm$html$Html$Attributes$min(
											$elm$core$String$fromFloat(data.dx)),
											$elm$html$Html$Attributes$max(
											$elm$core$String$fromFloat(data.dv)),
											$elm$html$Html$Attributes$step(
											$elm$core$String$fromFloat(data.cG)),
											$elm$html$Html$Events$onInput(
											A2(
												$elm$core$Basics$composeR,
												$elm$core$String$toFloat,
												A2(
													$elm$core$Basics$composeR,
													$elm$core$Maybe$withDefault(0.0),
													data.dC)))
										]),
									_List_Nil),
									A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('setting-picker-item-input-value')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text(
											$elm$core$String$fromFloat(data.d1))
										]))
								]))
						]));
			case 4:
				var data = item.a;
				return A2(
					$elm$html$Html$div,
					A2(
						$elm$core$List$cons,
						$elm$html$Html$Attributes$class('setting-picker-item'),
						attributes),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$label,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('setting-picker-item-label')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(data.bC)
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('setting-picker-item-input-container')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$input,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('setting-picker-item-input-int-range'),
											$elm$html$Html$Attributes$type_('range'),
											$elm$html$Html$Attributes$value(
											$elm$core$String$fromInt(data.d1)),
											$elm$html$Html$Attributes$min(
											$elm$core$String$fromInt(data.dx)),
											$elm$html$Html$Attributes$max(
											$elm$core$String$fromInt(data.dv)),
											$elm$html$Html$Events$onInput(
											A2(
												$elm$core$Basics$composeR,
												$elm$core$String$toInt,
												A2(
													$elm$core$Basics$composeR,
													$elm$core$Maybe$withDefault(0),
													data.dC)))
										]),
									_List_Nil),
									A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('setting-picker-item-input-value')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text(
											$elm$core$String$fromInt(data.d1))
										]))
								]))
						]));
			case 5:
				var data = item.a;
				return A2(
					$elm$html$Html$div,
					A2(
						$elm$core$List$cons,
						$elm$html$Html$Attributes$id('pick-choice-' + name),
						A2(
							$elm$core$List$cons,
							$elm$html$Html$Attributes$class('setting-picker-item'),
							attributes)),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$label,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('setting-picker-item-label')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(data.bC)
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('setting-picker-item-input-buttons')
								]),
							A2(
								$elm$core$List$map,
								function (_v1) {
									var label = _v1.bC;
									var onSelect = _v1.cm;
									var isSelected = _v1.ca;
									return A2(
										$elm$html$Html$button,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('setting-picker-item-button'),
												$elm$html$Html$Attributes$id(
												'setting-picker-item-button-' + A3($elm$core$String$replace, ' ', '-', label)),
												$elm$html$Html$Attributes$classList(
												_List_fromArray(
													[
														_Utils_Tuple2('selected', isSelected)
													])),
												$elm$html$Html$Events$onClick(onSelect)
											]),
										_List_fromArray(
											[
												$elm$html$Html$text(label)
											]));
								},
								data.dG))
						]));
			default:
				var data = item.a;
				return A2(
					$elm$html$Html$div,
					A2(
						$elm$core$List$cons,
						$elm$html$Html$Attributes$class('setting-picker-item'),
						attributes),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$label,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('setting-picker-item-label')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(data.bC)
								])),
							A2(
							$elm$html$Html$select,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('setting-picker-item-input-select'),
									$elm$html$Html$Events$onInput(data.cm)
								]),
							A2(
								$elm$core$List$map,
								function (optionData) {
									return A2(
										$elm$html$Html$option,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$value(optionData.d1),
												$elm$html$Html$Attributes$selected(optionData.ca)
											]),
										_List_fromArray(
											[
												$elm$html$Html$text(optionData.bC)
											]));
								},
								data.dG))
						]));
		}
	});
var $author$project$Game$viewPolaritySelector = F2(
	function (game, data) {
		return A3(
			$author$project$SettingsComponents$viewPickerItem,
			'polarity-selector',
			_List_fromArray(
				[
					A2(
					$elm$html$Html$Attributes$style,
					'font-size',
					$author$project$Utils$ColorUtils$px(
						24 - (2 * $elm$core$Dict$size(game.c)))),
					A2($elm$html$Html$Attributes$style, 'color', '#ccc')
				]),
			$author$project$SettingsComponents$PickChoiceButtons(data));
	});
var $author$project$Game$playerContainer = F3(
	function (playerNum, player, game) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$id('player-info'),
					$elm$html$Html$Attributes$class('player-container')
				]),
			_List_fromArray(
				[
					A3($author$project$Game$playerNumContainer, false, game, playerNum),
					A2(
					$author$project$Game$viewPolaritySelector,
					game,
					A2($author$project$Game$polarityPickChoiceConfig, playerNum, game)),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('player-moves-container'),
							A2(
							$elm$html$Html$Attributes$style,
							'font-size',
							$author$project$Utils$ColorUtils$px(
								24 - (2 * $elm$core$Dict$size(game.c))))
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$id('moves-num')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(
									'Moves: ' + $elm$core$String$fromInt(player.ay))
								]))
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('player-score-box')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$id('score-box'),
									A2(
									$elm$html$Html$Attributes$style,
									'font-size',
									$author$project$Utils$ColorUtils$px(
										24 - (2 * $elm$core$Dict$size(game.c))))
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(
									'Score: ' + A2($myrho$elm_round$Round$round, 3, player.z))
								]))
						]))
				]));
	});
var $author$project$Game$getPlayerContainers = function (game) {
	return $elm$core$Dict$values(
		A2(
			$elm$core$Dict$map,
			F2(
				function (index, playerData) {
					return A3($author$project$Game$playerContainer, index, playerData, game);
				}),
			game.c));
};
var $author$project$Game$getPlayersOrGameOverContainer = function (game) {
	return _Utils_eq(game.d, $author$project$Game$GameOver) ? $author$project$Game$getGameOverContainer(game) : A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$id('game-score-container'),
				$elm$html$Html$Attributes$class('player-display-container')
			]),
		$author$project$Game$getPlayerContainers(game));
};
var $elm$html$Html$span = _VirtualDom_node('span');
var $author$project$Game$getClockLoader = function (game) {
	var progress = ((game.ak * 100) / game.ab) | 0;
	return (progress < 25) ? A2(
		$elm$html$Html$span,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$id('clock-loader'),
				$elm$html$Html$Attributes$class('material-symbols-outlined')
			]),
		_List_fromArray(
			[
				$elm$html$Html$text('clock_loader_10')
			])) : ((progress < 33) ? A2(
		$elm$html$Html$span,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$id('clock-loader'),
				$elm$html$Html$Attributes$class('material-symbols-outlined')
			]),
		_List_fromArray(
			[
				$elm$html$Html$text('clock_loader_20')
			])) : ((progress < 66) ? A2(
		$elm$html$Html$span,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$id('clock-loader'),
				$elm$html$Html$Attributes$class('material-symbols-outlined')
			]),
		_List_fromArray(
			[
				$elm$html$Html$text('clock_loader_40')
			])) : ((progress < 75) ? A2(
		$elm$html$Html$span,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$id('clock-loader'),
				$elm$html$Html$Attributes$class('material-symbols-outlined')
			]),
		_List_fromArray(
			[
				$elm$html$Html$text('clock_loader_60')
			])) : ((progress < 90) ? A2(
		$elm$html$Html$span,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$id('clock-loader'),
				$elm$html$Html$Attributes$class('material-symbols-outlined')
			]),
		_List_fromArray(
			[
				$elm$html$Html$text('clock_loader_80')
			])) : A2(
		$elm$html$Html$span,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$id('clock-loader'),
				$elm$html$Html$Attributes$class('material-symbols-outlined')
			]),
		_List_fromArray(
			[
				$elm$html$Html$text('clock_loader_90')
			]))))));
};
var $author$project$Game$getTurnDisplay = F2(
	function (status, game) {
		switch (status.$) {
			case 0:
				return A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$id('turn-display')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$h3,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$id('turn-text')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Turn:    ')
								])),
							A3($author$project$Game$playerNumContainer, true, game, game.t)
						]));
			case 3:
				return A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$id('turn-display')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$h3,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$id('turn-text')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Turn:    ')
								])),
							A3($author$project$Game$playerNumContainer, true, game, game.t),
							$elm$html$Html$text('Thinking'),
							$author$project$Game$getClockLoader(game)
						]));
			case 1:
				return A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$id('turn-display')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$h3,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$id('turn-text')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Processing   ')
								]))
						]));
			default:
				return A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$id('turn-display')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$h3,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$id('turn-text')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Game Over   ')
								]))
						]));
		}
	});
var $author$project$Game$view = function (game) {
	var backgroundCol = function () {
		var _v0 = game.d;
		if (_v0.$ === 2) {
			return '#333';
		} else {
			return '#333';
		}
	}();
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$id('game-screen-container'),
				A2($elm$html$Html$Attributes$style, 'background-color', backgroundCol),
				A2($elm$html$Html$Attributes$style, 'color', '#ccc')
			]),
		_List_fromArray(
			[
				A2($author$project$Game$getTurnDisplay, game.d, game),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$id('game-board'),
						$elm$html$Html$Attributes$class('grid-container')
					]),
				_List_fromArray(
					[
						$author$project$Game$getBoardView(game),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$id('game-scores-over'),
								$elm$html$Html$Attributes$class('game-score-over-container')
							]),
						_List_fromArray(
							[
								$author$project$Game$getPlayersOrGameOverContainer(game)
							]))
					])),
				A2(
				$elm$html$Html$span,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$id('clock-loader'),
						$elm$html$Html$Attributes$class('material-symbols-outlined'),
						A2($elm$html$Html$Attributes$style, 'font-size', '0px')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('clock_loader_10')
					]))
			]));
};
var $author$project$Settings$SetPlayerAi = F2(
	function (a, b) {
		return {$: 5, a: a, b: b};
	});
var $author$project$SettingsComponents$pickChoiceButtons = function (_v0) {
	var label = _v0.bC;
	var onSelect = _v0.cm;
	var current = _v0.aF;
	var options = _v0.dG;
	return $author$project$SettingsComponents$PickChoiceButtons(
		{
			bC: label,
			dG: A2(
				$elm$core$List$map,
				function (_v1) {
					var optionLabel = _v1.a;
					var value = _v1.b;
					return {
						ca: _Utils_eq(value, current),
						bC: optionLabel,
						cm: onSelect(value)
					};
				},
				options)
		});
};
var $author$project$Settings$aiPickers = function (settings) {
	return A2(
		$elm$core$List$map,
		function (player) {
			return $author$project$SettingsComponents$pickChoiceButtons(
				{
					aF: A2(
						$elm$core$Maybe$withDefault,
						0,
						A2($elm$core$Array$get, player, settings.cs)),
					bC: 'Player ' + $elm$core$String$fromInt(player + 1),
					cm: $author$project$Settings$SetPlayerAi(player),
					dG: _List_fromArray(
						[
							_Utils_Tuple2('Human', 0),
							_Utils_Tuple2('Easy', 1),
							_Utils_Tuple2('Hard', 2)
						])
				});
		},
		A2($elm$core$List$range, 0, settings.c - 1));
};
var $author$project$Settings$SetFriction = function (a) {
	return {$: 2, a: a};
};
var $author$project$Settings$SetGridSize = function (a) {
	return {$: 0, a: a};
};
var $author$project$Settings$SetMagnetism = function (a) {
	return {$: 1, a: a};
};
var $author$project$Settings$SetNumMoves = function (a) {
	return {$: 3, a: a};
};
var $author$project$Settings$SetNumPlayers = function (a) {
	return {$: 4, a: a};
};
var $author$project$SettingsComponents$InputIntRange = function (a) {
	return {$: 4, a: a};
};
var $author$project$SettingsComponents$inputIntRange = function (data) {
	return $author$project$SettingsComponents$InputIntRange(data);
};
var $author$project$Settings$pickers = function (settings) {
	return _List_fromArray(
		[
			$author$project$SettingsComponents$inputIntRange(
			{bC: 'Number of Moves', dv: 30, dx: 1, dC: $author$project$Settings$SetNumMoves, d1: settings.dw}),
			$author$project$SettingsComponents$pickChoiceButtons(
			{
				aF: settings.N,
				bC: 'GridSize',
				cm: $author$project$Settings$SetGridSize,
				dG: _List_fromArray(
					[
						_Utils_Tuple2('Small', 25),
						_Utils_Tuple2('Medium', 50),
						_Utils_Tuple2('Large', 100)
					])
			}),
			$author$project$SettingsComponents$pickChoiceButtons(
			{
				aF: settings.X,
				bC: 'Magnetism',
				cm: $author$project$Settings$SetMagnetism,
				dG: _List_fromArray(
					[
						_Utils_Tuple2('Weak', (settings.N / 2) | 0),
						_Utils_Tuple2('Medium', settings.N),
						_Utils_Tuple2(
						'Strong',
						$elm$core$Basics$round(settings.N * 1.5)),
						_Utils_Tuple2(
						'XtraStrong',
						$elm$core$Basics$round(settings.N * 2))
					])
			}),
			$author$project$SettingsComponents$pickChoiceButtons(
			{
				aF: settings.a2,
				bC: 'Friction',
				cm: $author$project$Settings$SetFriction,
				dG: _List_fromArray(
					[
						_Utils_Tuple2('0.1', 0.1),
						_Utils_Tuple2('0.3', 0.3),
						_Utils_Tuple2('0.5', 0.5),
						_Utils_Tuple2('0.7', 0.7),
						_Utils_Tuple2('0.9', 0.9)
					])
			}),
			$author$project$SettingsComponents$pickChoiceButtons(
			{
				aF: settings.c,
				bC: 'Number of Players',
				cm: $author$project$Settings$SetNumPlayers,
				dG: _List_fromArray(
					[
						_Utils_Tuple2('2', 2),
						_Utils_Tuple2('3', 3),
						_Utils_Tuple2('4', 4)
					])
			})
		]);
};
var $author$project$Settings$viewPicker = F3(
	function (attributes, name, items) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$id('settings-picker-' + name)
				]),
			A2(
				$elm$core$List$map,
				A2($author$project$SettingsComponents$viewPickerItem, name, attributes),
				items));
	});
var $author$project$Settings$view = function (settings) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$id('settings')
			]),
		_List_fromArray(
			[
				A3(
				$author$project$Settings$viewPicker,
				_List_Nil,
				'main',
				$author$project$Settings$pickers(settings)),
				A3(
				$author$project$Settings$viewPicker,
				_List_Nil,
				'ai',
				$author$project$Settings$aiPickers(settings))
			]));
};
var $author$project$Main$view = function (screen) {
	if (!screen.$) {
		var settings = screen.a;
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$id('settings-screen'),
					$elm$html$Html$Attributes$class('screen')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$id('settings-modal')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$id('settings-modal-header')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$h1,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$id('settings-modal-header-title')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Magnet Melee')
										])),
									A2(
									$elm$html$Html$h2,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$id('settings-modal-header-team')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Mingyi Lim')
										]))
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$id('settings-modal-intro')
								]),
							_List_fromArray(
								[$author$project$Main$introText])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$id('settings-modal-body')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$map,
									$author$project$Main$SettingsMsg,
									$author$project$Settings$view(settings))
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$id('settings-modal-footer')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$button,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$id('start-game-button'),
											$elm$html$Html$Events$onClick($author$project$Main$ClickedStartGame)
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Start Game')
										]))
								]))
						]))
				]));
	} else {
		var game = screen.a;
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$id('gameplay-screen'),
					$elm$html$Html$Attributes$class('screen')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$map,
					$author$project$Main$GameplayMsg,
					$author$project$Game$view(game)),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$id('restart-button-container')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$button,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$id('restart-button'),
									$elm$html$Html$Events$onClick($author$project$Main$ClickedRestart)
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Restart')
								]))
						]))
				]));
	}
};
var $author$project$Main$main = $elm$browser$Browser$element(
	{
		ds: function (_v0) {
			return $author$project$Main$init;
		},
		dT: function (_v1) {
			return $elm$core$Platform$Sub$none;
		},
		d0: $author$project$Main$update,
		d2: $author$project$Main$view
	});
_Platform_export({'Main':{'init':$author$project$Main$main(
	$elm$json$Json$Decode$succeed(0))(0)}});}(this));