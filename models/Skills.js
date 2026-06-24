import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Skill = sequelize.define(
  "Skill",
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

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    icon: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    category: {
      type: DataTypes.ENUM("skill", "tool"),
      allowNull: false,
    },
  },
  {
    tableName: "skills",
    timestamps: true,
  }
);

export default Skill;