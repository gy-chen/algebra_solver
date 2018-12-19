"""provide tools for tokenize algebra equation

tokenize(text)
  main function to tokenize albebra equation. it's a generator that generate tokens.

TokenType
  enum that records recognized token types.

Token
  nametuple that keep token's value and it's type
"""
import string
import io
from itertools import chain
from enum import Enum
from collections import namedtuple


class TokenType(Enum):
    IDENTIFIER = 'IDENTIFIER'
    NUMBER = 'NUMBER'
    PLUS = 'PLUS'
    MINUS = 'MINUS'
    MULTIPLE = 'MULTIPLE'
    DIVIDE = 'DIVIDE'
    L_PAREN = 'L_PAREN'
    R_PAREN = 'R_PAREN'
    EQUATION = 'EQUATION'


CHAR_TO_TYPES = {
    '+': TokenType.PLUS,
    '-': TokenType.MINUS,
    '*': TokenType.MULTIPLE,
    '/': TokenType.DIVIDE,
    '(': TokenType.L_PAREN,
    ')': TokenType.R_PAREN,
    '=': TokenType.EQUATION
}


Token = namedtuple('Token', 'type value position')


class UnknownTokenError(Exception):

    def __init__(self, position, message=None):
        super(message)
        self.position = position


def tokenize(text):
    gen = enumerate(text)
    for p, c in gen:
        if c.isspace():
            continue
        if c in CHAR_TO_TYPES:
            yield Token(CHAR_TO_TYPES[c], c, p)
        elif c.isnumeric():
            token, gen = _read_number(c, p, gen)
            yield token
        elif c.isalpha():
            token, gen = _read_identifier(c, p, gen)
            yield token
        else:
            raise UnknownTokenError(p)


def _read_number(c, p, gen):
    "return (token, gen)"
    expected = set(string.digits) | set('.')
    fp = p
    value = io.StringIO()
    while c in expected:
        value.write(c)
        if c == '.':
            expected.remove('.')
        try:
            c, p = next(gen)
        except StopIteration:
            break
    else:
        gen = chain([(p, c)], gen)
    return Token(TokenType.NUMBER, float(value.getvalue()), fp), gen


def _read_identifier(c, p, gen):
    "return (token, gen)"
    expected = string.ascii_letters
    fp = p
    value = io.StringIO()
    while c in expected:
        value.write(c)
        try:
            c, p = next(gen)
        except StopIteration:
            break
    else:
        gen = chain([(p, c)], gen)
    return Token(TokenType.IDENTIFIER, value.getvalue(), fp), gen
