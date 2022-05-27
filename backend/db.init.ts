import postgres from 'https://cdn.jsdelivr.net/gh/porsager/postgres@master/deno/mod.js';

const sql = postgres('postgres://username:password@host/database');

export default sql;