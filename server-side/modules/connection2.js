var mysql2 = require('mysql2');
var mysql2_promise = require('mysql2/promise');

module.exports = {
    con2: null,
    con2_promise_inner: null,
    getConnection: () => {
        this.con2 = mysql2.createConnection({
            host: "localhost",
            user: "root",
            password: "",
            database: "vacationsdb"
        });
        return this.con2;
    },
    getConnectionPromise: async () => {
        this.con2_promise_inner = await mysql2_promise.createConnection({
            host: "localhost",
            user: "root",
            password: "",
            database: "vacationsdb"
        });        
        return this.con2_promise_inner;
    },
    select: (sql,fields) => {
        
    }
}