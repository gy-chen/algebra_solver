import pytest
from algebra_solver import tf
from algebra_solver.lang import parser, lexer

def test_eval():
    exp = parser.parse(lexer.tokenize('x + 1 = 0'))
    result = tf.eval(exp)

    assert result['_loss'] == pytest.approx(0, abs=1e-3)
    assert result['x'] == pytest.approx(-1, abs=1e-3)

def test_eval_dup_variables():
    exp = parser.parse(lexer.tokenize('x * x - 100 = 0'))
    result = tf.eval(exp)

    assert result['_loss'] == pytest.approx(0, abs=1e-3)
    assert abs(result['x']) == pytest.approx(10, abs=1e-3)

def test_eval_two_variables():
    exp = parser.parse(lexer.tokenize('x / y = 100'))
    result = tf.eval(exp)

    assert result['_loss'] == pytest.approx(0, abs=1e-3)
    assert result['x'] / result['y'] == pytest.approx(100, abs=1e-3)