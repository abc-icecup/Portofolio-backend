import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const ProjectLink = sequelize.define(
  "ProjectLink",
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

    url: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    tableName: "project_links",
    timestamps: true,
  }
);

export default ProjectLink;