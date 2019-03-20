"""provide tools for parse syntax of algebra equation

parse
    main function for parsing algebra equation, return EquationExpression

EquationExpression
    namedtuple that represent albegra equation

InfixExpression
    namedtuple that represent expression that have operator and two operands on left and right.

NumberExpression
    namedtuple that represent expression that only have a number as its value.

IdentifierExpression
    namedtuple that represent expression that only have a idenfiier as its value.

OperatorType
    enum that represent types of operator

ParseException
    root exception for paring error

UnexpectTokenException
    exception for unexpect token
"""
from enum import Enum
from collections import namedtuple
from itertools import chain
from . import lexer


class ParseException(Exception):
    pass


class UnexpectEndException(ParseException):
    pass


class UnexpectTokenException(ParseException):

    def __init__(self, token):
        self.token = token


EquationExpression = namedtuple('EquationExpression', 'left right')
InfixExpression = namedtuple('InfixExpression', 'operator left right')
NumberExpression = namedtuple('NumberExpression', 'number')
IdentifierExpression = namedtuple('IdentifierExpression', 'identifier')


class OperatorType(Enum):
    LOWEST = 'LOWEST'
    PLUS = 'PLUS'
    MINUS = 'MINUS'
    MULTIPLE = 'MULTIPLE'
    DIVIDE = 'DIVIDE'
    L_PAREN = 'L_PAREN'


TOKEN_TYPE_TO_OPERATOR_TYPE = {
    lexer.TokenType.PLUS: OperatorType.PLUS,
    lexer.TokenType.MINUS: OperatorType.MINUS,
    lexer.TokenType.MULTIPLE: OperatorType.MULTIPLE,
    lexer.TokenType.DIVIDE: OperatorType.DIVIDE
}

PRECEDENCE = {
    OperatorType.LOWEST: 0,
    OperatorType.L_PAREN: 1,
    OperatorType.PLUS: 2,
    OperatorType.MINUS: 2,
    OperatorType.MULTIPLE: 3,
    OperatorType.DIVIDE: 4
}


def parse(tokens_gen):
    equation_expression, tokens_gen = _parse_equation_expression(tokens_gen)
    try:
        token = next(tokens_gen)
        raise UnexpectTokenException(token)
    except StopIteration:
        pass
    return equation_expression


def _parse_equation_expression(tokens_gen):
    left, tokens_gen = _parse_expression(tokens_gen)
    try:
        token = next(tokens_gen)
        if token.type != lexer.TokenType.EQUATION:
            raise UnexpectTokenException(token)
    except StopIteration:
        raise UnexpectEndException()
    right, tokens_gen = _parse_expression(tokens_gen)
    return EquationExpression(left, right), tokens_gen


def _parse_expression(tokens_gen, precedence=PRECEDENCE[OperatorType.LOWEST]):
    left = _parse_operand(tokens_gen)
    try:
        token = next(tokens_gen)
    except StopIteration:
        return left, tokens_gen
    operator = TOKEN_TYPE_TO_OPERATOR_TYPE.get(token.type, None)
    if operator is None:
        tokens_gen = chain([token], tokens_gen)
        return left, tokens_gen

    while precedence < PRECEDENCE[operator]:
        right, tokens_gen = _parse_expression(tokens_gen, PRECEDENCE[operator])
        left = InfixExpression(operator, left, right)
        try:
            token = next(tokens_gen)
        except StopIteration:
            return left, tokens_gen
        operator = TOKEN_TYPE_TO_OPERATOR_TYPE.get(token.type, None)
        if operator is None:
            tokens_gen = chain([token], tokens_gen)
            return left, tokens_gen

    tokens_gen = chain([token], tokens_gen)
    return left, tokens_gen


def _parse_operand(tokens_gen):
    try:
        token = next(tokens_gen)
    except StopIteration:
        raise UnexpectEndException()
    if token.type == lexer.TokenType.NUMBER:
        return NumberExpression(token.value)
    elif token.type == lexer.TokenType.IDENTIFIER:
        return IdentifierExpression(token.value)
    elif token.type == lexer.TokenType.L_PAREN:
        return _parse_paren_expression(tokens_gen)
    else:
        raise UnexpectTokenException(token)


def _parse_paren_expression(token_gens):
    exp, token_gens = _parse_expression(
        token_gens, PRECEDENCE[OperatorType.L_PAREN])
    try:
        token = next(token_gens)
    except StopIteration:
        raise UnexpectEndException()
    if token.type != lexer.TokenType.R_PAREN:
        raise UnexpectTokenException(token)
    return exp
