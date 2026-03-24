import mysql from  'mysql';
import util from 'util';

let conn = mysql.createConnection({
    host: "bvstvjptxsbfsulfgqqt-mysql.services.clever-cloud.com" || "localhost",
    password: "jaRHsWcofNVxgcz5TNCA" || "",
    user: "uxducnab00oerufx" || "root",
    database: "bvstvjptxsbfsulfgqqt" || "auth" 
});

const exe = util.promisify(conn.query).bind(conn);
export default exe;