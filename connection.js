import knex from "knex";

export const conn = knex({
    client: "mysql",
    connection: {
        host: "127.0.0.1",
        user: "root",
        database: "db_barbershop",
        password: ""
    },
    pool: {
        min: 2,
        max: 10
    }
})
export const checkConnection = async ()=> {
    try {
        await conn.raw("SELECT 1");
        console.log("Koneksi Knex Berhasil!");
    } catch(err){
        console.error(err.message);
    }
}