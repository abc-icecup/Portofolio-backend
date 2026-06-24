import User from "./User.js";
import Profile from "./profile.js";
import SocialLink from "./SocialLink.js";
import Certificate from "./certificates.js";
import Skill from "./Skills.js"
import Project from "./Project.js";
import ProjectImage from "./ProjectImage.js";
import ProjectLink from "./ProjectLink.js";
import ProjectSkill from "./ProjectSkill.js";

// RELATION

User.hasOne(Profile, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
});

Profile.belongsTo(User, {
  foreignKey: "user_id",
});

Profile.hasMany(SocialLink, {
  foreignKey: "profile_id",
  onDelete: "CASCADE",
});

SocialLink.belongsTo(Profile, {
  foreignKey: "profile_id",
});

User.hasMany(Certificate, {
  foreignKey: "user_id",
});

Certificate.belongsTo(User, {
  foreignKey: "user_id",
});

User.hasMany(Skill, {
  foreignKey: "user_id",
});

Skill.belongsTo(User, {
  foreignKey: "user_id",
});

User.hasMany(Project, {
  foreignKey: "user_id",
});

Project.belongsTo(User, {
  foreignKey: "user_id",
});

Project.hasMany(ProjectImage, {
  foreignKey: "project_id",
  as: "images",
  onDelete: "CASCADE",
});

ProjectImage.belongsTo(Project, {
  foreignKey: "project_id",
});

Project.hasMany(ProjectLink, {
  foreignKey: "project_id",
  onDelete: "CASCADE",
});

ProjectLink.belongsTo(Project, {
  foreignKey: "project_id",
});

Project.belongsToMany(Skill, {
  through: ProjectSkill,
  foreignKey: "project_id",
});

Skill.belongsToMany(Project, {
  through: ProjectSkill,
  foreignKey: "skill_id",
});

export {
  User,
  Profile,
  SocialLink,
  Certificate,
  Skill,

  Project,
  ProjectImage,
  ProjectLink,
  ProjectSkill,
};