import { ODataResponse } from "../odataResponse";
import { ODataQuery } from "./oDataQuery";
import { Expression } from "./expression";

export abstract class ODataQueryProvider {
    createQuery<T>(expression: Expression) {
        return new ODataQuery<T>(this, expression);
    }

    abstract executeQueryAsync<T extends ODataResponse>(expression: Expression): T;

    generateQuery(expression: Expression) {
        const query = this.buildQuery(expression, {});
        return this.buildODataString(query);
    }

    protected transformExpression(expression: Expression, query: Query) {
        switch (expression.operator) {
            case "select":
                query.select = expression.operands.map(v => v.toString());
                break;
            case "top":
                query.top = expression.operands[0];
                break;
            case "skip":
                query.skip = expression.operands[0];
                break;
            case "count":
                query.count = "true";
                break;
            case "orderBy":
                query.orderBy = (query.orderBy || []).concat(expression.operands.map((v: string) => ({ field: v })));
                break;
            case "orderByDescending":
                query.orderBy = (query.orderBy || []).concat(expression.operands.map<Sort>((v: string) => ({ field: v, direction: "desc" })));
                break;
            case "key":
                query.key = expression.operands[0].toString();
                break;
            case "filter":
                //TODO: filter
                break;
            default: throw new Error(`Oporator '${expression.operator} is not supported`);
        }

        return query;
    }

    protected buildODataString(query: Query) {
        let returnValue = "";
        if ('key' in query) {
            returnValue += `(${this.deriveValue(query.key)})`;
            delete query.key;
        }


        let fragments: string[] = [];
        for (let field in query) {
            fragments.push(`$${field}=${this.deriveValue((query as any)[field])}`);
        }

        if (fragments.length === 0) return returnValue;

        return returnValue + `?${fragments.join("&")}`;
    }

    abstract deriveValue(value: any): string;

    private buildQuery(expression: Expression, query: Query) {
        if (!query) query = {};
        while (expression.previous) {
            query = this.buildQuery(expression.previous, query);
        }

        return this.transformExpression(expression, query);
    }
}

type Sort = { field: string, direction?: 'desc' };

interface Query {
    select?: string[];
    top?: number | undefined;
    skip?: number | undefined;
    count?: string | undefined;
    orderBy?: Sort[];
    key?: any;
    filter?: any;
}

