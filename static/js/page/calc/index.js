/**
 *角度与弧度互转
 */
function RadTranslate(element) {
	element.innerHTML = element.innerHTML === 'Rad' ? 'Deg' : 'Rad';
}

/**
 *将点击的按键进行简单验证后输入到显示屏
 *@param 按键符号
 */
function input(element) {
	var screen = document.getElementById('screen');
	var input = screen.innerHTML;
	var ch = element.innerHTML;

	if (ch === 'CE') {
		CE(screen, input);
		return;
	}

	if (ch === 'C') {
		screen.innerHTML = '0';
		return;
	}

	//输入长度限制
	if (input.length >= 25)
		return;

	if (isNaN(ch)) {
		if (ch === '-' && input.length === 1 && input === '0') {
			screen.innerHTML = '-';
			return;
		}
		//对非数字进行简单分析验证
		addOperator(screen, input, ch);
	} else {
		var last = input.charAt(input.length - 1);
		if (last === ')' || last === 'e' || last === 'π')
			screen.innerHTML += '×' + ch;
		else if (input === '0' || (last === '0' && isNaN(input.charAt(input.length - 2))))
			screen.innerHTML = input.substring(0, input.length - 1) + ch;
		else
			screen.innerHTML += ch;
	}
}

function CE(screen, input) {
	if (input === '无效的表达式') {
		screen.innerHTML = '0';
		return;
	}
	if (input.length == 1) {
		screen.innerHTML = 0;
	}
	else if (input.charAt(input.length - 1) === '(') {
		var wordList = 'abcdefghijklmnopqrstuvwxyz^√';
		for (var i = input.length - 2; i >= 0; i--) {
			var ch = input.charAt(i);
			if (wordList.indexOf(ch) === -1) {
				screen.innerHTML = input.substring(0, i + 1);
				break;
			}
			if (i === 0 && wordList.indexOf(input.charAt(0)) != -1)
				screen.innerHTML = '0';
		}
	} else {
		screen.innerHTML = input.substring(0, input.length - 1);
	}
}

function addOperator(screen, input, operand) {
	var last = input.charAt(input.length - 1);
	switch (operand) {
		case '1/x':
			if (last === '0' && input.length === 1) {
				screen.innerHTML = '1÷';
				break;
			}
			if (!isNaN(last) || last === ')') {
				screen.innerHTML += '×1÷';
			}
			else if (last != '.')
				screen.innerHTML += '(1÷';
			break;
		case 'x²':
			if (!isNaN(last) || last === ')')
				screen.innerHTML += '^(2)';
			break;
		case 'x³':
			if (!isNaN(last) || last === ')')
				screen.innerHTML += '^(3)';
			break;
		case 'xⁿ':
			if (!isNaN(last) || last === ')')
				screen.innerHTML += '^(';
			break;

		case 'sin':
			if (last === '0' && input.length === 1) {
				screen.innerHTML = 'sin(';
				break;
			}
			if (!isNaN(last) || last === ')')
				screen.innerHTML += '×sin(';
			else if (last != '.')
				screen.innerHTML += 'sin(';
			break;
		case 'cos':
			if (last === '0' && input.length === 1) {
				screen.innerHTML = 'cos(';
				break;
			}
			if (!isNaN(last) || last === ')')
				screen.innerHTML += '×cos(';
			else if (last != '.')
				screen.innerHTML += 'cos(';
			break;
		case 'tan':
			if (last === '0' && input.length === 1) {
				screen.innerHTML = 'tan(';
				break;
			}
			if (!isNaN(last) || last === ')')
				screen.innerHTML += '×tan(';
			else if (last != '.')
				screen.innerHTML += 'tan(';
			break;
		case 'cot':
			if (last === '0' && input.length === 1) {
				screen.innerHTML = 'cot(';
				break;
			}
			if (!isNaN(last) || last === ')')
				screen.innerHTML += '×cot(';
			else if (last != '.')
				screen.innerHTML += 'cot(';
			break;

		case 'arcsin':
			if (last === '0' && input.length === 1) {
				screen.innerHTML = 'asin(';
				break;
			}
			if (!isNaN(last) || last === ')')
				screen.innerHTML += '×asin(';
			else if (last != '.')
				screen.innerHTML += 'asin(';
			break;
		case 'arccos':
			if (last === '0' && input.length === 1) {
				screen.innerHTML = 'acos(';
				break;
			}
			if (!isNaN(last) || last === ')')
				screen.innerHTML += '×acos(';
			else if (last != '.')
				screen.innerHTML += 'acos(';
			break;
		case 'arctan':
			if (last === '0' && input.length === 1) {
				screen.innerHTML = 'atan(';
				break;
			}
			if (!isNaN(last) || last === ')')
				screen.innerHTML += '×atan(';
			else if (last != '.')
				screen.innerHTML += 'atan(';
			break;
		case 'π':
			if (last === '0' && input.length === 1) {
				screen.innerHTML = 'π';
				break;
			}
			if (!isNaN(last) || last === ')' || last === 'e' || last === 'π')
				screen.innerHTML += '×π';
			else if (last != '.')
				screen.innerHTML += 'π';
			break;

		case 'log':
			if (last === '0' && input.length === 1) {
				screen.innerHTML = 'log(';
				break;
			}
			if (!isNaN(last) || last === ')')
				screen.innerHTML += '×log(';
			else if (last != '.')
				screen.innerHTML += 'log(';
			break;
		case 'ln':
			if (last === '0' && input.length === 1) {
				screen.innerHTML = 'ln(';
				break;
			}
			if (!isNaN(last) || last === ')')
				screen.innerHTML += '×ln(';
			else if (last != '.')
				screen.innerHTML += 'ln(';
			break;
		case 'eⁿ':
			if (last === '0' && input.length === 1) {
				screen.innerHTML = 'e^(';
				break;
			}
			if (!isNaN(last) || last === ')' || last === 'e' || last === 'π')
				screen.innerHTML += '×e^(';
			else if (last != '.')
				screen.innerHTML += 'e^(';
			break;
		case 'e':
			if (last === '0' && input.length === 1) {
				screen.innerHTML = 'e';
				break;
			}
			if (!isNaN(last) || last === ')' || last === 'e' || last === 'π')
				screen.innerHTML += '×e';
			else if (last != '.')
				screen.innerHTML += 'e';
			break;

		case '√':
			if (last === '0' && input.length === 1) {
				screen.innerHTML = '√(';
				break;
			}
			if (!isNaN(last) || last === ')')
				screen.innerHTML += '×√(';
			else if (last != '.')
				screen.innerHTML += '√(';
			break;
		case '|x|':
			if (last === '0' && input.length === 1) {
				screen.innerHTML = 'abs(';
				break;
			}
			if (!isNaN(last) || last === ')')
				screen.innerHTML += '×abs(';
			else if (last != '.')
				screen.innerHTML += 'abs(';
			break;

		case '（）':
			addBracket(screen, input);
			break;
		case '.':
			addDot(screen, input);
			break;
		default:
			if (!isNaN(last) || last === ')')
				screen.innerHTML += operand;
			break;
	}
}

function addBracket(screen, input) {
	var last = input.charAt(input.length - 1);
	if (input.length == 1 && last === '0') {
		screen.innerHTML = '(';
		return;
	}
	if (last != ')' && isNaN(last) && last != 'e' && last != 'π') {
		if (last != '.')
			screen.innerHTML += '(';
	} else {
		//用左右括号相互抵消的方法判断是添加左括号还是右括号
		var leftNum = 0;
		for (var i = 0; i < input.length; i++) {
			if (input.charAt(i) === '(')
				leftNum++;
			else if (input.charAt(i) === ')')
				leftNum--;
		}
		screen.innerHTML += leftNum <= 0 ? '×(' : ')';
	}
}

function addDot(screen, input) {
	if (isNaN(input.charAt(input.length - 1)))
		return;
	
	for (var i = input.length - 2; i >= 0; i--) {
		if (input.charAt(i) === '.')
			return;
		if (isNaN(input.charAt(i)))
			break;
	}
	screen.innerHTML += '.';
}