import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Certificate from "./certificates.js";

const User = sequelize.define("User", {
  username: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
  },
  password: {
    type: DataTypes.STRING,
  },
});

export default User;