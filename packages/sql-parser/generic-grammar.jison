/* based on @camilojd awesome job! See https://raw.githubusercontent.com/camilojd/sequeljs/master/src/SqlParser.jison
/* description: Parses SQL */
/* :tabSize=2:indentSize=2:noTabs=true: */
%lex

%options case-insensitive

%%

[/][*](.|\n)*?[*][/]                             /* skip comments */
[a-zA-Z_][a-zA-Z0-9_]*\.[a-zA-Z_][a-zA-Z0-9_]*   return 'QUALIFIED_IDENTIFIER'
[a-zA-Z_][a-zA-Z0-9_]*\.\*                       return 'QUALIFIED_STAR'
\s+                                              /* skip whitespace */
'SELECT'                                         return 'SELECT'
'TOP'                                            return 'TOP'
'FROM'                                           return 'FROM'
'WHERE'                                          return 'WHERE'
'DISTINCT'                                       return 'DISTINCT'
'BETWEEN'                                        return 'BETWEEN'
GROUP\s+BY\b                                     return 'GROUP_BY'
'HAVING'                                         return 'HAVING'
ORDER\s+BY\b                                     return 'ORDER_BY'
(UNION\s+ALL|UNION|INTERSECT|EXCEPT)\b           return 'SET_OPERATOR'
','                                              return 'COMMA'
'+'                                              return 'PLUS'
'-'                                              return 'MINUS'
'/'                                              return 'DIVIDE'
'*'                                              return 'STAR'
'%'                                              return 'MODULO'
'='                                              return 'CMP_EQUALS'
'!='                                             return 'CMP_NOTEQUALS'
'<>'                                             return 'CMP_NOTEQUALS_BASIC'
'>='                                             return 'CMP_GREATEROREQUAL'
'>'                                              return 'CMP_GREATER'
'<='                                             return 'CMP_LESSOREQUAL'
'<'                                              return 'CMP_LESS'
'('                                              return 'LPAREN'
')'                                              return 'RPAREN'
'||'                                             return 'CONCAT'
'AS'                                             return 'AS'
'ALL'                                            return 'ALL'
'ANY'                                            return 'ANY'
'SOME'                                           return 'SOME'
'EXISTS'                                         return 'EXISTS'
'IS'                                             return 'IS'
'IN'                                             return 'IN'
'ON'                                             return 'ON'
'AND'                                            return 'LOGICAL_AND'
'OR'                                             return 'LOGICAL_OR'
'NOT'                                            return 'LOGICAL_NOT'
INNER\s+JOIN\b                                   return 'INNER_JOIN'
LEFT\s+OUTER\s+JOIN\b                            return 'LEFT_OUTER_JOIN'
RIGHT\s+OUTER\s+JOIN\b                           return 'RIGHT_OUTER_JOIN'
JOIN\b                                           return 'JOIN'
LEFT\s+JOIN\b                                    return 'LEFT_JOIN'
RIGHT\s+JOIN\b                                   return 'RIGHT_JOIN'
FULL\s+JOIN\b                                    return 'FULL_JOIN'
NATURAL\s+JOIN\b                                 return 'NATURAL_JOIN'
CROSS\s+JOIN\b                                   return 'CROSS_JOIN'
'CASE'                                           return 'CASE'
'WHEN'                                           return 'WHEN'
'THEN'                                           return 'THEN'
'ELSE'                                           return 'ELSE'
'END'                                            return 'END'
'LIKE'                                           return 'LIKE'
'ASC'                                            return 'ASC'
'DESC'                                           return 'DESC'
'NULLS'                                          return 'NULLS'
'FIRST'                                          return 'FIRST'
'LAST'                                           return 'LAST'
'OPTION'                                         return 'OPTION'
'WITH'                                           return 'WITH'
'CAST'                                           return 'CAST'
N?['](\\.|[^'])*[']                              return 'STRING'
'NULL'                                           return 'NULL'
(true|false)\b                                   return 'BOOLEAN'
[0-9]+(\.[0-9]+)?                                return 'NUMERIC'
[a-zA-Z_][a-zA-Z0-9_]*                           return 'IDENTIFIER'
["][a-zA-Z_][a-zA-Z0-9_]*["]                     return 'QUOTED_IDENTIFIER'
[?]                                              return 'BIND'
<<EOF>>                                          return 'EOF'
.                                                return 'INVALID'

/lex

%start main

%% /* language grammar */

main
    : selectClause EOF { return {nodeType: 'Main', value: $1}; }
  ;

selectClause
    : expressionPlus { $$ = $1; }
  ;

selectClauseItem
    : SELECT optDistinctClause optTopClause selectExprList
      optTableExprList
      optWhereClause optGroupByClause optHavingClause optOrderByClause optQueryHintsClause
      { $$ = {nodeType: 'Select', distinct: $2, top: $3, columns: $4, from: $5, where:$6, groupBy:$7, having:$8, orderBy:$9, queryHints:$10}; }
  ;

optDistinctClause
    : { $$ = false; }
  | DISTINCT { $$ = true; }
  ;

optTopClause
    : { $$ = null; }
  | TOP NUMERIC { $$ = $2; }
  ;

optWhereClause
    : { $$ = null; }
  | WHERE expression { $$ = $2; }
  ;

optGroupByClause
    : { $$ = null; }
  | GROUP_BY commaSepExpressionList { $$ = $2; }
  ;

optHavingClause
    : { $$ = null; }
  | HAVING expression { $$ = $2; }
  ;

optOrderByClause
    : { $$ = null; }
  | ORDER_BY orderByList { $$ = $2; }
  ;

orderByList
    : orderByList COMMA orderByListItem { $$ = $1; $1.push($3); }
  | orderByListItem { $$ = [$1]; }
  ;

orderByListItem
    : expression optOrderByOrder optOrderByNulls { $$ = {expression:$1, orderByOrder: $2, orderByNulls: $3}; }
  ;

optOrderByOrder
    : { $$ = ''; }
  | ASC { $$ = $1; }
  | DESC { $$ = $1; }
  ;

optOrderByNulls
    : { $$ = '';}
  | NULLS FIRST { $$ = 'NULLS FIRST'; }
  | NULLS LAST { $$ = 'NULLS LAST'; }
  ;

optQueryHintsClause
    : { $$ = null; }
  | OPTION LPAREN queryHintList RPAREN { $$ = $3; }
  ;

queryHintList
    : queryHintList COMMA queryHint { $$ = $1; $1.push($3); }
  | queryHint { $$ = [$1]; }
  ;

queryHint
    : queryHint IDENTIFIER { $$ = $1; $1.push($2); }
  | queryHint CMP_EQUALS { $$ = $1; $1.push($2); }
  | queryHint NUMERIC { $$ = $1; $1.push($2); }
  | queryHint STRING { $$ = $1; $1.push($2); }
  | IDENTIFIER { $$ = [$1]; }
  ;

selectExprList
    : selectExpr { $$ = [$1]; }
  | selectExprList COMMA selectExpr { $$ = $1; $1.push($3); }
  ;

selectExpr
    : STAR { $$ = {nodeType: 'Column', value:'*'}; }
  | QUALIFIED_STAR  { $$ = {nodeType: 'Column', value:$1}; }
  | expression optTableExprAlias  { $$ = {nodeType: 'Column', value:$1, alias:$2}; }
  ;

optTableExprList
    : { $$ = []; }
  | FROM tableExprList { $$ = $2; }
  ;

tableExprList
    : tableExpr { $$ = [$1]; }
  | tableExprList COMMA tableExpr { $$ = $1; $1.push($3); }
  ;

tableExpr
    : joinComponent { $$ = {nodeType:'TableExpr', value: [$1]}; }
  | tableExpr optJoinModifier joinComponent { $$ = $1; $1.value.push({nodeType:'TableExpr', value: $3, modifier:$2}); }
  | tableExpr optJoinModifier joinComponent ON expression { $$ = $1; $1.value.push({nodeType:'TableExpr', value: $3, modifier:$2, expression:$5}); }
  ;

joinComponent
    : tableExprPart optTableExprAlias optTableHintsClause { $$ = {exprName: $1, alias: $2, tableHints: $3}; }
  ;

tableExprPart
    : IDENTIFIER { $$ = $1; }
  | QUALIFIED_IDENTIFIER { $$ = $1; }
  | LPAREN selectClause RPAREN { $$ = $2; }
  ;

optTableExprAlias
    : { $$ = null; }
  | IDENTIFIER { $$ = {value: $1 }; }
  | AS IDENTIFIER { $$ = {value: $2, includeAs: 1}; }
  ;

optTableHintsClause
    : { $$ = null; }
  | WITH LPAREN tableHintList RPAREN { $$ = $3; }
  ;

tableHintList
    : tableHintList COMMA IDENTIFIER { $$ = $1; $1.push($3); }
  | IDENTIFIER { $$ = [$1]; }
  ;

optJoinModifier
    : JOIN             { $$ = ''; }
  | LEFT_JOIN        { $$ = 'LEFT'; }
  | LEFT_OUTER_JOIN  { $$ = 'LEFT OUTER'; }
  | RIGHT_JOIN       { $$ = 'RIGHT'; }
  | RIGHT_OUTER_JOIN { $$ = 'RIGHT OUTER'; }
  | FULL_JOIN        { $$ = 'FULL'; }
  | INNER_JOIN       { $$ = 'INNER'; }
  | CROSS_JOIN       { $$ = 'CROSS'; }
  | NATURAL_JOIN     { $$ = 'NATURAL'; }
  ;

expressionPlus
    : expressionPlus SET_OPERATOR selectClauseItem { $$ = $1; $1.push({nodeType:'SetOperator', value:$2}); $1.push($3); }
  | expressionPlus SET_OPERATOR expression { $$ = $1; $1.push({nodeType:'SetOperator', value:$2}); $1.push($3); }
  | selectClauseItem { $$ = [$1] }
  | expression { $$ = [$1] }
  ;

expression
    : andCondition { $$ = {nodeType:'AndCondition', value: $1}; }
  | expression LOGICAL_OR andCondition { $$ = {nodeType:'OrCondition', left: $1, right: $3}; }
  ;

andCondition
    : condition { $$ = [$1]; }
  | andCondition LOGICAL_AND condition { $$ = $1; $1.push($3); }
  ;

condition
    : operand { $$ = {nodeType: 'Condition', value: $1}; }
  | operand conditionRightHandSide { $$ = {nodeType: 'BinaryCondition', left: $1, right: $2}; }
  | EXISTS LPAREN selectClause RPAREN { $$ = {nodeType: 'ExistsCondition', value: $3}; }
  | LOGICAL_NOT condition { $$ = {nodeType: 'NotCondition', value: $2}; }
  ;

compare
    : CMP_EQUALS { $$ = $1; }
  | CMP_NOTEQUALS { $$ = $1; }
  | CMP_NOTEQUALS_BASIC { $$ = $1; }
  | CMP_GREATER { $$ = $1; }
  | CMP_GREATEROREQUAL { $$ = $1; }
  | CMP_LESS { $$ = $1; }
  | CMP_LESSOREQUAL { $$ = $1; }
  ;

conditionRightHandSide
    : rhsCompareTest { $$ = $1; }
  | rhsIsTest { $$ = $1; }
  | rhsInTest { $$ = $1; }
  | rhsLikeTest { $$ = $1; }
  | rhsBetweenTest { $$ = $1; }
  ;

rhsCompareTest
    : compare operand { $$ = {nodeType: 'RhsCompare', op: $1, value: $2 }; }
  | compare ALL LPAREN selectClause RPAREN { $$ = {nodeType: 'RhsCompareSub', op:$1, kind: $2, value: $4 }; }
  | compare ANY LPAREN selectClause RPAREN { $$ = {nodeType: 'RhsCompareSub', op:$1, kind: $2, value: $4 }; }
  | compare SOME LPAREN selectClause RPAREN { $$ = {nodeType: 'RhsCompareSub', op:$1, kind: $2, value: $4 }; }
  ;

rhsIsTest
    : IS operand { $$ = {nodeType: 'RhsIs', value: $2}; }
  | IS LOGICAL_NOT operand { $$ = {nodeType: 'RhsIs', value: $3, not:1}; }
  | IS DISTINCT FROM operand { $$ = {nodeType: 'RhsIs', value: $4, distinctFrom:1}; }
  | IS LOGICAL_NOT DISTINCT FROM operand { $$ = {nodeType: 'RhsIs', value: $5, not:1, distinctFrom:1}; }
  ;

rhsInTest
    : IN LPAREN rhsInClause RPAREN { $$ = $3; }
  | LOGICAL_NOT IN LPAREN rhsInClause RPAREN { $$ = $4; $4.not = 1; }
  ;

rhsInClause
    : selectClause { $$ = { nodeType: 'RhsInSelect', value: $1}; }
  | expression COMMA commaSepExpressionList { $$ = { nodeType: 'RhsInExpressionList', value: $3}; $3.unshift($1); }
  ;

commaSepExpressionList
    : commaSepExpressionList COMMA expression { $$ = $1; $1.push($3); }
  | expression { $$ = [$1]; }
  ;

functionParam
    : expression { $$ = $1; }
  | DISTINCT expression { $$ = { nodeType: 'DistinctFunctionParam', value: $2}; }
  | STAR { $$ = $1; }
  | QUALIFIED_STAR { $$ = $1; }
  ;

functionExpressionList
    : functionExpressionList COMMA functionParam { $$ = $1; $1.push($3); }
  | functionParam { $$ = [$1]; }
  ;

/*
 * Function params are defined by an optional list of functionParam elements,
 * because you may call functions of with STAR/QUALIFIED_STAR parameters (Like COUNT(*)),
 * which aren't `Term`(s) because they cant't have an alias
 */
optFunctionExpressionList
    : { $$ = null; }
  | functionExpressionList { $$ = $1; }
  ;

rhsLikeTest
    : LIKE operand { $$ = {nodeType: 'RhsLike', value: $2}; }
  | LOGICAL_NOT LIKE operand { $$ = {nodeType: 'RhsLike', value: $3, not:1}; }
  ;

rhsBetweenTest
    : BETWEEN operand LOGICAL_AND operand { $$ = {nodeType: 'RhsBetween', left: $2, right: $4}; }
  | LOGICAL_NOT BETWEEN operand LOGICAL_AND operand { $$ = {nodeType: 'RhsBetween', left: $3, right: $5, not:1}; }
  ;

operand
    : summand { $$ = $1; }
  | operand CONCAT summand { $$ = {nodeType:'Operand', left:$1, right:$3, op:$2}; }
  ;


summand
    : factor { $$ = $1; }
  | summand PLUS factor { $$ = {nodeType:'Summand', left:$1, right:$3, op:$2}; }
  | summand MINUS factor { $$ = {nodeType:'Summand', left:$1, right:$3, op:$2}; }
  ;

factor
    : term { $$ = $1; }
  | factor DIVIDE term { $$ = {nodeType:'Factor', left:$1, right:$3, op:$2}; }
  | factor STAR term { $$ = {nodeType:'Factor', left:$1, right:$3, op:$2}; }
  | factor MODULO term { $$ = {nodeType:'Factor', left:$1, right:$3, op:$2}; }
  ;

term
    : value { $$ = {nodeType: 'Term', value: $1}; }
  | IDENTIFIER { $$ = {nodeType: 'Term', value: $1}; }
  | QUOTED_IDENTIFIER { $$ = {nodeType: 'Term', value: $1}; }
  | QUALIFIED_IDENTIFIER { $$ = {nodeType: 'Term', value: $1}; }
  | caseWhen { $$ = $1; }
  | LPAREN expressionPlus RPAREN { $$ = {nodeType: 'Term', value: $2}; }
  | IDENTIFIER LPAREN optFunctionExpressionList RPAREN { $$ = {nodeType: 'FunctionCall', name: $1, args: $3}; }
  | QUALIFIED_IDENTIFIER LPAREN optFunctionExpressionList RPAREN { $$ = {nodeType: 'FunctionCall', name: $1, args: $3}; }
  | CAST LPAREN expression AS dataType RPAREN { $$ = {nodeType: 'Cast', expression:$3, dataType:$5}; }
  ;

dataType
    : IDENTIFIER optDataTypeLength { $$ = {name: $1, len: $2}; }
  | QUOTED_IDENTIFIER optDataTypeLength { $$ = {name: $1, len: $2}; }
  ;

optDataTypeLength
    : { $$ = null; }
  | LPAREN NUMERIC RPAREN { $$ = $2; }
  ;

caseWhen
    : CASE caseWhenList optCaseWhenElse END { $$ = {nodeType:'Case', clauses: $2, else: $3}; }
  ;

caseWhenList
    : caseWhenList WHEN expression THEN expression { $$ = $1; $1.push({nodeType: 'CaseItem', when: $3, then: $5}); }
  | WHEN expression THEN expression { $$ = [{nodeType: 'CaseItem', when: $2, then: $4}]; }
  ;

optCaseWhenElse
    : { $$ = null; }
  | ELSE expression { $$ = $2; }
  ;

value
    : STRING { $$ = $1; }
  | NUMERIC { $$ = $1; }
  | BOOLEAN { $$ = $1; }
  | NULL { $$ = $1; }
  | BIND { $$ = $1; }
  ;
