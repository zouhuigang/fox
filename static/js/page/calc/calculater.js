/**
 *@param 左操作数 右操作数 运算符
 *@return 运算结果
 */
function simpleCalculate(leftOPerand, rightOperand, op) {
	switch (op) {
		case '+':
			return leftOPerand + rightOperand;
		case '-' :
			return leftOPerand - rightOperand;
		case '*' :
			return leftOPerand * rightOperand;
		case '/' :
			return leftOPerand / rightOperand;
		case '^' :
			return Math.pow(leftOPerand, rightOperand);
	}
}

/**
 *去掉最内层括号并用其值替换
 *@param 表达式字符串
 *@return 去掉括号后的表达式
 */
 function rmBracket(exp) {
 	var start = -1;
 	var end = -1;
 	for (var i = 0; i < exp.length; i++) {
 		if (exp.charAt(i) === '(') start = i;
 		else if (exp.charAt(i) === ')') {
 			end = i;
 			break;
 		}
 	}
 	var str = exp.substring(start + 1, end);
    return str;
 }

 /**
  *计算只含+-/*的表达式的值
  *@param 表达式字符串
  *@return 运算结果
  */
 function calculate(exp) {
 	var operands = new Array();
 	var operators = new Array();
 	
 	//分解表达式，将运算符与操作数压入对应栈
 	var differ = 0;
 	for (var i = 0; i < exp.length; i++) {
 		var ch = exp.charAt(i);
 		//提取数字
 		if ((differ === 0 && ch === '-') || !isNaN(ch) || ch === '.')
 			differ++;
 		else {
 			if (differ != 0) {
 				var str = exp.substring(i - differ, i);
 				//检查小数点数量是否正确
 				if (str.indexOf('.') != str.lastIndexOf('.'))
 					return null;
 				operands.push(parseFloat(str));
 			}
 			operators.push(exp.charAt(i));
 			differ = 0;
 		}
 	}
 	operands.push(parseFloat(exp.substring(exp.length - differ, exp.length)));

 	//检查运算符与操作数数量是否异常
 	if (operands.length <= operators.length)
 		return null;

 	operators.reverse();
 	operands.reverse();
 	//运算
 	while(operators.length >= 2) {
 		var op1 = operators.pop();
 		var op2 = operators.pop();
 		if (op1 === '^' || op2 === '+' || op2 === '-') {
 			operators.push(op2);
 			var leftOPerand = operands.pop();
 			var rightOperand = operands.pop();
 			var result = simpleCalculate(leftOPerand, rightOperand, op1);
 			operands.push(result);
 		} else if ((op1 === '*'  || op1 === '/') && op2 === '/') {
 			operators.push(op2);
 			var leftOPerand = operands.pop();
 			var rightOperand = operands.pop();
 			var result = simpleCalculate(leftOPerand, rightOperand, op1);
 			operands.push(result);
 		} else {
 			operators.push(op1);
 			var firstOperand = operands.pop();
            var leftOperand = operands.pop();
            var rightOperand = operands.pop();
            var result = simpleCalculate(leftOperand, rightOperand, op2);
            operands.push(result);
            operands.push(firstOperand);
 		}
 	}
 	if (operands.length == 1) {
 		if (operators.length > 0)
 			return -operands.pop();
 		else
 			return operands.pop();
 	}

 	var leftOperand = operands.pop();
 	var rightOperand = operands.pop();
 	var result = simpleCalculate(leftOperand, rightOperand, operators.pop());
 	return result;
 }

 /**
  *函数运算
  *@param 表达式 函数类型
  *@return 运算结果
  */
function funcCalculate(exp, type) {
	var arg = document.getElementById('Rad').innerHTML === 'Rad' ? 1 : 180 / Math.PI;
	var result;
	switch(type) {
		case 'sin':
			result = Math.sin(exp / arg);
			break;
		case 'cos':
			result = Math.cos(exp / arg);
			break;
		case 'tan':
			result = Math.tan(exp / arg);
			break;
		case 'cot':
			result = 1 / Math.tan(exp / arg);
			break;
		case 'asin':
			result = Math.asin(exp) * arg;
			break;
		case 'acos':
			result = Math.acos(exp) * arg;
			break;
		case 'atan':
			result = Math.atan(exp) * arg;
			break;
		case 'ln':
			result = Math.log(exp);
			break;
		case 'log':
			result = Math.log(exp) / Math.log(10);
			break;
		case '√':
			result = Math.sqrt(exp);
			break;
		case 'abs':
			result = Math.abs(exp);
			break;
	}
	return result;
}

/**
 *替换函数运算
 */
 function replaceFunc(exp) {
	var tri = new Array('asin', 'acos', 'atan', 'sin', 'cos', 'tan', 'cot', 'ln', 'log', '√', 'abs');
	for (var i = 0; i < tri.length; i++) {
		//确定做左括号位置
		var leftIndex = exp.indexOf(tri[i]) + tri[i].length + 1;
		if (leftIndex === tri[i].length)
			continue;
		//确定右括号位置
		var rightIndex = matchBracket(exp.substring(leftIndex)) + leftIndex;
		if (rightIndex <= leftIndex)
			return null;
		//计算并替换
		var temp = exp.substring(leftIndex, rightIndex);
		exp = exp.replace(tri[i] + '(' + temp + ')', funcCalculate(getResult(temp), tri[i]));
	}
	return exp;
 }

/**
 *替换+-/*（）以外的特殊符号
 *@param 表达式
 *@return 翻译后的表达式
 */
function translation(exp) {
	//替换特殊符号及字符常量
	exp = exp.replace(/÷/g, '/');
	exp = exp.replace(/×/g, '*');
	exp = exp.replace(/π/g, Math.PI);
	exp = exp.replace(/e/g, Math.E);
	//替换函数运算
	exp = replaceFunc(exp);

	return exp;
}

/**
 *匹配一对括号
 *@param 去掉第一个左括号后的表达式
 *@return 返回右括号的索引，没有则返回-1
 */
 function matchBracket(exp) {
 	var leftNum = 1;
 	for (var i = 0; i < exp.length; i++) {
 		var ch = exp.charAt(i);
 		if (ch === '(')
 			leftNum++;
 		else if (ch === ')')
 			leftNum--;
 		if (leftNum === 0)
 			return i;
 	}
 	return -1;
 }

 /**
  *对结果进行舍入
  */
 function toFixed(num, s) {
 	//将数扩大减小精度丢失
 	var times = Math.pow(10, s);
 	var des = num > 0 ? num * times + 0.5 : num * times - 0.5;
 	des = parseInt(des, 10) / times;
 	return des;
 }

/**
 *返回表达式值
 *@param 表达式字符串
 *@return 运算结果
 */
function getResult(exp) {
	exp = translation(exp);
	if (exp === null) {
		return null;
	}
	while (exp.indexOf('(') >= 0) {
		var temp = rmBracket(exp);
		var result = calculate(temp);
		if (result == null)
			return null;
    	exp = exp.replace('(' + temp + ')', "" + result);
	}
	return toFixed(calculate(exp), 14);
}