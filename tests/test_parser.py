import pytest
from algebra_solver.lang import lexer
from algebra_solver.lang import parser


def test_simple_parse():
    tokens = lexer.tokenize('x + 3 = 10')
    equation_expression = parser.parse(tokens)
    assert isinstance(equation_expression, parser.EquationExpression)
    assert isinstance(equation_expression.left, parser.InfixExpression)
    assert isinstance(equation_expression.right, parser.NumberExpression)

    assert equation_expression.left.operator == parser.OperatorType.PLUS
    assert equation_expression.left.left == parser.IdentifierExpression('x')
    assert equation_expression.left.right == parser.NumberExpression(3)

    assert equation_expression.right == parser.NumberExpression(10)


def test_parse_expression():
    plus_expression = parser.parse(lexer.tokenize('1+1=1'))
    assert plus_expression.left.operator == parser.OperatorType.PLUS

    minus_expression = parser.parse(lexer.tokenize('1-1=1'))
    assert minus_expression.left.operator == parser.OperatorType.MINUS

    multiple_expression = parser.parse(lexer.tokenize('1*1=1'))
    assert multiple_expression.left.operator == parser.OperatorType.MULTIPLE

    divide_expression = parser.parse(lexer.tokenize('1/1=1'))
    assert divide_expression.left.operator == parser.OperatorType.DIVIDE


def test_incomplete_equation():
    with pytest.raises(parser.UnexpectEndException):
        parser.parse(lexer.tokenize('x + 3'))

    with pytest.raises(parser.UnexpectEndException):
        parser.parse(lexer.tokenize(''))

    with pytest.raises(parser.UnexpectEndException):
        parser.parse(lexer.tokenize('x * ( 3 + 2'))

    with pytest.raises(parser.UnexpectTokenException):
        parser.parse(lexer.tokenize('= 0'))


def test_surplus_equation():
    with pytest.raises(parser.UnexpectTokenException):
        parser.parse(lexer.tokenize('x + 3 = 10 + 3 = 10'))


def test_disorder_equation():
    with pytest.raises(parser.UnexpectTokenException):
        parser.parse(lexer.tokenize('x x + 3 = 10'))

    with pytest.raises(parser.UnexpectTokenException):
        parser.parse(lexer.tokenize('x + + 3 = 10'))

    with pytest.raises(parser.UnexpectTokenException):
        parser.parse(lexer.tokenize('x + 3 3 = 10'))

    with pytest.raises(parser.UnexpectTokenException):
        parser.parse(lexer.tokenize('x + 3 3 = =  10'))

    with pytest.raises(parser.UnexpectTokenException):
        parser.parse(lexer.tokenize('x + 3 3 = 10 10'))

    with pytest.raises(parser.UnexpectTokenException):
        parser.parse(lexer.tokenize('x * (( 3 + 2 ) = 10'))

    with pytest.raises(parser.UnexpectTokenException):
        parser.parse(lexer.tokenize('x * ( 3 + 2 )) = 10'))

    with pytest.raises(parser.UnexpectTokenException):
        parser.parse(lexer.tokenize('x * ( 3 + 2  = 10'))

    with pytest.raises(parser.UnexpectTokenException):
        parser.parse(lexer.tokenize('x * 3 + 2 ) = 10'))


def test_precedence():
    equation = parser.parse(lexer.tokenize('1 * 2 + x = 10'))

    plus_exp = equation.left
    assert plus_exp.operator == parser.OperatorType.PLUS
    assert plus_exp.left == parser.InfixExpression(
        parser.OperatorType.MULTIPLE, parser.NumberExpression(1), parser.NumberExpression(2))
    assert plus_exp.right == parser.IdentifierExpression('x')


def test_paren_precedence():
    equation = parser.parse(lexer.tokenize('1 * (2 + x) = 10'))

    multiple_exp = equation.left
    assert multiple_exp.operator == parser.OperatorType.MULTIPLE
    assert multiple_exp.left == parser.NumberExpression(1)
    assert multiple_exp.right == parser.InfixExpression(
        parser.OperatorType.PLUS, parser.NumberExpression(2), parser.IdentifierExpression('x'))
