import { Sequelize } from "sequelize";

const sequelize = new Sequelize("myporto_db", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

export default sequelize;