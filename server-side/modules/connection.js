var mysql = require('mysql');

module.exports = {
    con: null,
    getConnection: () => {
        this.con = mysql.createConnection({
            // TODO: change before hosting
            host: "localhost",
            user: "root",
            password: "",
            database: "vacationsdb"
        });
        return this.con;
    },
    select: (sql,fields) => {
        
    }
}