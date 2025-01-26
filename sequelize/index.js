const { Sequelize } = require('sequelize')
const { Umzug, SequelizeStorage } = require('umzug')
require('dotenv').config({ path: '../.env' });

const sequelize = new Sequelize('drive',process.env.PG_USER, process.env.PG_PASSWORD, {
    host: 'localhost',
    dialect: 'postgres',
    port: 26257,
    ssl:false,
    pool: {
        max: 10
    }
});

async function exec(){
    const umzug = new Umzug({
        migrations: { glob: 'migrations/*.js',
        resolve: ({name, path, context}) => {
            const migration = require(path)
            return {
              name,
              up: async () => migration.up(context, Sequelize),
              down: async () => migration.down(context, Sequelize),
            }
          },
     },
        context: sequelize.getQueryInterface(),
        storage: new SequelizeStorage({ sequelize }),
        logger: console,
    })
    
    await umzug.up()
}
exec()