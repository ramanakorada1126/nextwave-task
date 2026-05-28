const { sequelize } = require("./sequelize");

const connectDB = async()=>{
    try {
        await sequelize.authenticate();
        await sequelize.sync({force:false}) 
//         - force: true → Drops existing tables and recreates them fresh.
//         - alter: true → Alters existing tables to match your models (safer than force).
        console.log('Database connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        process.exit(1)
    }
}

module.exports = {connectDB};