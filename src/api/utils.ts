let sqlFormatter = require('sql-formatter');
let formatSql  = sqlFormatter.format;

const getHome = () => (process.env.HOME || process.env.USERPROFILE);

export { 
    formatSql,
    getHome
};
