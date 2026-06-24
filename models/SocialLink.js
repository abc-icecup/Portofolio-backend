import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const SocialLink = sequelize.define(
  "SocialLink",
  {
    url: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    tableName: "social_links",
  }
);

export default SocialLink;