import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const ProjectImage = sequelize.define(
  "ProjectImage",
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

    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "project_images",
    timestamps: true,
  }
);

export default ProjectImage;