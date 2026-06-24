import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const ProjectSkill = sequelize.define(
  "ProjectSkill",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    project_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    skill_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "project_skills",
    timestamps: true,
  }
);

export default ProjectSkill;