import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Profile = sequelize.define("Profile", {

  bio: {
    type: DataTypes.TEXT,
  },

  profile_image: {
    type: DataTypes.STRING,
  },

});

export default Profile;