/**
 * The supported @type {Expression} operators.
 */
export const enum ExpressionOperator {
    And = "and",
    Contains = "contains",
    EndsWith = "endsWith",
    Equals = "equals",
    FieldReference = "fieldReference",
    GetByKey = "getByKey",
    GetWithCount = "getWithCount",
    GreaterThan = "greaterThan",
    GreaterThanOrEqualTo = "greaterThanOrEqualTo",
    LessThan = "lessThan",
    LessThanOrEqualTo = "lessThanOrEqualTo",
    Literal = "literal",
    Not = "not",
    NotEquals = "notEquals",
    Or = "or",
    OrderBy = "orderBy",
    OrderByDescending = "orderByDescending",
    Predicate = "predicate",
    Select = "select",    
    Skip = "skip",
    StartsWith = "startsWith",
    Top = "top",
}