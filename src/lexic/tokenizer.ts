import Tokenizr from 'tokenizr';
import { TokenTypes } from './enum/token-types.enum';

const lexer = new Tokenizr();

lexer.rule(/[a-zA-Z_][a-zA-Z0-9_]*/, (ctx) => {
  ctx.accept(TokenTypes.ID);
});

lexer.rule(/[+-]?[0-9]+/, (ctx, match) => {
  ctx.accept(TokenTypes.NUMBER, parseInt(match[0]));
});

lexer.rule(/[0-9]+\.[0-9]+/, (ctx) => {
  ctx.accept(TokenTypes.NUMBER);
});

lexer.rule(/\+/, (ctx) => {
  ctx.accept(TokenTypes.PLUS_SYMBOL);
});

lexer.rule(/-/, (ctx) => {
  ctx.accept(TokenTypes.MINUS_SYMBOL);
});

lexer.rule(/\*/, (ctx) => {
  ctx.accept(TokenTypes.MULTIPLICATION_SYMBOL);
});

lexer.rule(/\//, (ctx) => {
  ctx.accept(TokenTypes.DIVISION_SYMBOL);
});

lexer.rule(/\/\/[^\r\n]*\r?\n/, (ctx) => {
  ctx.ignore();
});

lexer.rule(/[ \t\r\n]+/, (ctx) => {
  ctx.ignore();
});

lexer.debug(false);

export default lexer;
