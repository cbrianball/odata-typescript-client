"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var ODataQuery_1 = require("../../lib/expressions/ODataQuery");
var ODataV4QueryProvider_1 = require("../../lib/expressions/ODataV4QueryProvider");
describe("ODataQuery", function () {
    var endpoint = "/odata/users";
    var baseQuery = new ODataQuery_1.ODataQuery(new ODataV4QueryProvider_1.ODataV4QueryProvider(endpoint));
    it("should produce base URL with no query", function () {
        chai_1.expect(baseQuery.provider.buildQuery(baseQuery.expression)).to.be.eql(endpoint);
    });
    it("should set select filter", function () {
        var query = baseQuery.select("firstName");
        chai_1.expect(query.provider.buildQuery(query.expression)).to.be.eql(endpoint + "?$select=firstName");
    });
    it("should set select filter with mulitple fields", function () {
        var query = baseQuery.select("firstName", "lastName");
        chai_1.expect(query.provider.buildQuery(query.expression)).to.be.eql(endpoint + "?$select=firstName,lastName");
    });
    it("should set combination select filter", function () {
        var query = baseQuery.select("firstName", "lastName")
            .select("lastName");
        chai_1.expect(query.provider.buildQuery(query.expression)).to.be.eql(endpoint + "?$select=lastName");
    });
    it("should set orderBy", function () {
        var query = baseQuery.orderBy("firstName");
        chai_1.expect(query.provider.buildQuery(query.expression)).to.be.eql(endpoint + "?$orderby=firstName");
    });
    it("should set orderBy with multiple fields", function () {
        var query = baseQuery.orderBy("firstName", "lastName");
        chai_1.expect(query.provider.buildQuery(query.expression)).to.be.eql(endpoint + "?$orderby=firstName,lastName");
    });
    it("should set orderBy multiple times", function () {
        var query = baseQuery.orderBy("firstName", "lastName").orderBy("age");
        chai_1.expect(query.provider.buildQuery(query.expression)).to.be.eql(endpoint + "?$orderby=firstName,lastName,age");
    });
    it("should set orderByDescending", function () {
        var query = baseQuery.orderByDescending("firstName");
        chai_1.expect(query.provider.buildQuery(query.expression)).to.be.eql(endpoint + "?$orderby=firstName desc");
    });
    it("should set orderByDescending with multiple fields", function () {
        var query = baseQuery.orderByDescending("firstName", "lastName");
        chai_1.expect(query.provider.buildQuery(query.expression)).to.be.eql(endpoint + "?$orderby=firstName desc,lastName desc");
    });
    it("should set orderByDescending multiple times", function () {
        var query = baseQuery.orderByDescending("firstName", "lastName").orderByDescending("age");
        chai_1.expect(query.provider.buildQuery(query.expression)).to.be.eql(endpoint + "?$orderby=firstName desc,lastName desc,age desc");
    });
    it("should set orderBy and orderByDescending multiple times", function () {
        var query = baseQuery.orderByDescending("firstName").orderBy("age").orderByDescending("lastName");
        chai_1.expect(query.provider.buildQuery(query.expression)).to.be.eql(endpoint + "?$orderby=firstName desc,age,lastName desc");
    });
    it("should set skip", function () {
        var query = baseQuery.skip(10);
        chai_1.expect(query.provider.buildQuery(query.expression)).to.be.eql(endpoint + "?$skip=10");
    });
    it("should set last skip value provided", function () {
        var query = baseQuery.skip(10).skip(5);
        chai_1.expect(query.provider.buildQuery(query.expression)).to.be.eql(endpoint + "?$skip=5");
    });
    it("should set top", function () {
        var query = baseQuery.top(10);
        chai_1.expect(query.provider.buildQuery(query.expression)).to.be.eql(endpoint + "?$top=10");
    });
    it("should set last skip value provided", function () {
        var query = baseQuery.top(10).top(5);
        chai_1.expect(query.provider.buildQuery(query.expression)).to.be.eql(endpoint + "?$top=5");
    });
    // it("should set simple filter", () => {
    //     const query = baseQuery.filter(p => p.equals("firstName", "john"));
    //     expect(query.provider.buildQuery(query.expression)).to.be.eql(`${endpoint}?$filter=firstName eq 'john'`);
    // });
    // it("should set compound filter", () => {
    //     const query = baseQuery.filter(p => p.equals("firstName", "john").and(p.greaterThanOrEqualTo("age", 30)));
    //     expect(query.provider.buildQuery(query.expression)).to.be.eql(`${endpoint}?$filter=firstName eq 'john' and age ge 30`);
    // });
    it("should set complex filter", function () {
        var query = baseQuery.filter(function (p) { return p.equals("firstName", "john").and(p.greaterThanOrEqualTo("age", 30).or(p.notEquals("lastName", "Jones"))); });
        chai_1.expect(query.provider.buildQuery(query.expression)).to.be.eql(endpoint + "?$filter=firstName eq 'john' and (age ge 30 and lastName ne 'Jones')");
    });
});
