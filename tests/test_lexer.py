import pytest
from algebra_solver.lang import lexer


def test_token_types():
    text = "+-*/()hello23.4="
    expected = [
        lexer.TokenType.PLUS,
        lexer.TokenType.MINUS,
        lexer.TokenType.MULTIPLE,
        lexer.TokenType.DIVIDE,
        lexer.TokenType.L_PAREN,
        lexer.TokenType.R_PAREN,
        lexer.TokenType.IDENTIFIER,
        lexer.TokenType.NUMBER,
        lexer.TokenType.EQUATION
    ]

    assert [token.type for token in lexer.tokenize(text)] == expected


def test_token_values():
    text = "+-*/()hello23.4="
    expected = [
        "+",
        "-",
        "*",
        "/",
        "(",
        ")",
        "hello",
        23.4,
        "="
    ]

    assert [token.value for token in lexer.tokenize(text)] == expected


def test_eat_whites():
    text = "1 + x = 10"
    expected = [
        lexer.Token(lexer.TokenType.NUMBER, 1., 0),
        lexer.Token(lexer.TokenType.PLUS, "+", 2),
        lexer.Token(lexer.TokenType.IDENTIFIER, "x", 4),
        lexer.Token(lexer.TokenType.EQUATION, "=", 6),
        lexer.Token(lexer.TokenType.NUMBER, 10., 8)
    ]

    assert list(lexer.tokenize(text)) == expected


def test_unknown_tokens():
    for unknown in '!"#$%&\',.:;<>?@[\\]^_{}':
        with pytest.raises(lexer.UnknownTokenError):
            list(lexer.tokenize(unknown))

    strange_number = "23.4.5"
    with pytest.raises(lexer.UnknownTokenError):
        list(lexer.tokenize(strange_number))
