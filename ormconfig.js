module.exports = [
  {
    "name": "default",
    "type": "postgres",
    "host": process.env.PG_HOST,
    "port": process.env.PG_PORT,
    "username": process.env.PG_USERNAME,
    "password": process.env.PG_PASSWORD,
    "database": process.env.PG_DATABASE,
    "entities": [
      "./src/modules/**/infra/typeorm/entities/*.ts"
    ],
    "migrations": [
      "./src/shared/infra/typeorm/migrations/*.ts"
    ],
    "cli": {
      "migrationsDir": "./src/shared/infra/typeorm/migrations"
    }
  },
  {
    "name": "mongo",
    "type": "mongodb",
    "host": process.env.MONGO_HOST,
    "port": process.env.MONGO_PORT,
    "username": process.env.MONGO_USERNAME,
    "password": process.env.MONGO_PASSWORD,
    "database": process.env.MONGO_DATABASE,
    "useUnifiedTopology": true,
    "entities": [
      "./src/modules/**/infra/typeorm/schemas/*.ts"
    ]
  }
];
