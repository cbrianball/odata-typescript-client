import { ODataQueryProvider } from "./ODataQueryProvider";
import { FieldReference } from "./FieldReference";
import { Expression } from "./Expression";
import { ODataQueryResponse, ODataQueryResponseWithCount, ODataResponse } from "./ODataResponse";
import { PredicateBuilder } from "./PredicateBuilder";
import { BooleanPredicateBuilder } from "./BooleanPredicateBuilder";
import { ExpressionOperator } from "./ExpressionOperator";

type FieldsFor<T> = Extract<keyof T, string>;

export const resolveQuery = Symbol();

export class ODataQuery<T> {
    /**
     *
     */
    constructor(public readonly provider: ODataQueryProvider, public readonly expression?: Expression) { }

    /**
     * Limits the fields that are returned; the most recent call to select() will be used.
     * @param fields
     */
    public select<U extends FieldsFor<T>>(...fields: U[]) {
        const expression = new Expression(ExpressionOperator.Select, fields.map(v => new FieldReference<T>(v)), this.expression);
        return this.provider.createQuery<Pick<T, U>>(expression);
    }

    /**
     * Returns the top n records; the most recent call to top() will be used.
     * @param n
     */
    public top(n: number) {
        const expression = new Expression(ExpressionOperator.Top, [n], this.expression);
        return this.provider.createQuery<T>(expression);
    }

    /**
     * Omits the first n records from appear in the returned records; the most recent call to skip() will be used.
     * @param n
     */
    public skip(n: number) {
        const expression = new Expression(ExpressionOperator.Skip, [n], this.expression);
        return this.provider.createQuery<T>(expression);
    }

    /**
     * Determines the sort order (ascending) of the records; calls or orderBy() and orderByDescending() are cumulative.
     * @param fields
     */
    public orderBy(...fields: Array<FieldsFor<T>>) {
        const expression = new Expression(ExpressionOperator.OrderBy, fields.map(f => new FieldReference<T>(f)), this.expression);
        return this.provider.createQuery<T>(expression);
    }

    /**
     * Determines the sort order (descending) of the records; calls to orderBy() and orderByDescending() are cumulative.
     * @param fields
     */
    public orderByDescending(...fields: Array<FieldsFor<T>>) {
        const expression = new Expression(ExpressionOperator.OrderByDescending, fields.map(f => new FieldReference<T>(f)), this.expression);
        return this.provider.createQuery<T>(expression);
    }

    /**
     * Filters the records based on the resulting FilterBuilder; calls to filter() and customFilter() are cumulative (as well as UNIONed (AND))
     * @param predicate Either an existing FilterBuilder, or a function that takes in an empty FilterBuilder and returns a FilterBuilder instance.
     */
    public filter(predicate: BooleanPredicateBuilder<T> | ((builder: PredicateBuilder<T>) => BooleanPredicateBuilder<T>)) {
        if (typeof predicate === "function")
            predicate = predicate(new PredicateBuilder<T>());

            const expression = new Expression(ExpressionOperator.Predicate, [predicate], this.expression);
            return this.provider.createQuery<T>(expression);
    }

    /**
     * Returns a single record with the provided key value. Some functions (such as top, skip, filter, etc.) are ignored when this function is invoked.
     * @param key
     */
    public async getAsync(key: any) {
        const expression = new Expression(ExpressionOperator.GetByKey, [key], this.expression);
        return await this.provider.executeQueryAsync<ODataResponse & T>(expression);
    }

    /**
     * Returns a set of records.
     */
    public async getManyAsync() {        
        return await this.provider.executeQueryAsync<ODataQueryResponse<T>>(this.expression);
    }

    /**
     * Returns a set of records, including the total count of records, which may not be the same as the number of records return if the results are paginated.
     */
    public async getManyWithCountAsync() {
        const expression = new Expression(ExpressionOperator.GetWithCount, [], this.expression);
        return await this.provider.executeQueryAsync<ODataQueryResponseWithCount<T>>(expression);
    }

    [resolveQuery]() {
        return this.provider.buildQuery(this.expression);
    }
}