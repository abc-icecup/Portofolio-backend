import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Certificate = sequelize.define(
  "Certificate",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "certificates",
    timestamps: true,
    updatedAt: false,
  }
);

export default Certificate;