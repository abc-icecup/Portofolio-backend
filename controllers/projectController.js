import fs from "fs";
import path from "path";

import sequelize from "../config/database.js";

import {
  Project,
  ProjectImage,
  ProjectLink,
  ProjectSkill,
  Skill,
} from "../models/index.js";

export const addProject = async (
  req,
  res
) => {

  const transaction =
    await sequelize.transaction();

  try {

    const {
      name,
      description,
      links,
      skills,
    } = req.body;

    if (!name) {
      return res.status(400).json({
        message:
          "Nama project wajib diisi",
      });
    }

    const project =
      await Project.create(
        {
            user_id: req.user.id,
            name,
            description,
        },
        {
            transaction,
        }
      );

    // =====================
    // IMAGES
    // =====================

    if (
      req.files &&
      req.files.length > 0
    ) {

      const images =
        req.files.map((file) => ({
          project_id: project.id,
          image: file.filename,
        }));
    
      console.log(images);
      await ProjectImage.bulkCreate(
        images,
        {
            transaction,
        }
      );
    }

    // =====================
    // LINKS
    // =====================

    if (links) {

      const parsedLinks =
        JSON.parse(links);

      const linkData =
        parsedLinks.map((link) => ({
          project_id: project.id,
          url: link,
        }));

      await ProjectLink.bulkCreate(
        linkData,
        {
            transaction,
        }
      );
    }

    // =====================
    // SKILLS
    // =====================

    if (skills) {

      const parsedSkills =
        JSON.parse(skills);

      const skillData =
        parsedSkills.map(
          (skillId) => ({

            project_id: project.id,

            skill_id: skillId,
          })
        );

      await ProjectSkill.bulkCreate(
        skillData,
        {
            transaction,
        }
      );
    }

    await transaction.commit();

    return res.status(201).json({
      message: "Project berhasil dibuat",
      project,
    });

  } catch (error) {

    await transaction.rollback();

    return res.status(500).json({
      message: error.message,
    });

  }
};

export const getProjects = async (
  req,
  res
) => {
  try {

    const projects =
      await Project.findAll({

        where: {
          user_id: req.user.id,
        },

        include: [
          {
            model: ProjectImage,
            as: "images",

            attributes: [
              "image",
            ],
          },
        ],

        order: [
          ["createdAt", "DESC"],
        ],
      });

    const formattedProjects =
      projects.map((project) => ({

        id: project.id,

        name: project.name,

        thumbnail:
          project.images.length > 0
            ? `${req.protocol}://${req.get(
                "host"
              )}/uploads/projects/${
                project.images[0].image
              }`
            : null,
      }));

    return res.status(200).json(
      formattedProjects
    );

  } catch (error) {

    return res.status(500).json({
      message: error.message,
    });

  }
};

export const getProjectDetail = async (
  req,
  res
) => {

  try {

    const project =
      await Project.findOne({

        where: {
          id: req.params.id,
          user_id: req.user.id,
        },

        include: [

          {
            model: ProjectImage,
            as: "images",
            attributes: ["image"],
          },

          {
            model: ProjectLink,
            attributes: ["url"],
          },

          {
            model: Skill,
            through: {
              attributes: [],
            },
            attributes: [
              "id",
              "name",
              "category",
            ],
          },
        ],
      });

    if (!project) {

      return res.status(404).json({
        message:
          "Project tidak ditemukan",
      });

    }

    return res.status(200).json({

      id: project.id,

      name: project.name,

      description:
        project.description,

      images:
        project.images.map(
          (img) =>
            `${req.protocol}://${req.get(
              "host"
            )}/uploads/projects/${
              img.image
            }`
        ),

      links:
        project.ProjectLinks.map(
          (link) => link.url
        ),

      skills:
        project.Skills.map(
          (skill) => ({
            id: skill.id,
            name: skill.name,
            category:
              skill.category,
          })
        ),
    });

  } catch (error) {

    return res.status(500).json({
      message: error.message,
    });

  }
};

export const deleteProject = async (
  req,
  res
) => {

  const transaction =
    await sequelize.transaction();

  try {

    const project =
      await Project.findOne({
        where: {
          id: req.params.id,
          user_id: req.user.id,
        },
      });

    if (!project) {

      await transaction.rollback();

      return res.status(404).json({
        message: "Project tidak ditemukan",
      });

    }

    // =====================
    // AMBIL SEMUA GAMBAR
    // =====================

    const images =
      await ProjectImage.findAll({
        where: {
          project_id: project.id,
        },
      });

    // =====================
    // HAPUS FILE FISIK
    // =====================

    for (const image of images) {

      const imagePath =
        path.join(
          "uploads",
          "projects",
          image.image
        );

      if (
        fs.existsSync(imagePath)
      ) {

        fs.unlinkSync(imagePath);

      }
    }

    // =====================
    // HAPUS RELASI SKILL
    // =====================

    await ProjectSkill.destroy({
      where: {
        project_id: project.id,
      },
      transaction,
    });

    // =====================
    // HAPUS LINK
    // =====================

    await ProjectLink.destroy({
      where: {
        project_id: project.id,
      },
      transaction,
    });

    // =====================
    // HAPUS IMAGE RECORD
    // =====================

    await ProjectImage.destroy({
      where: {
        project_id: project.id,
      },
      transaction,
    });

    // =====================
    // HAPUS PROJECT
    // =====================

    await project.destroy({
      transaction,
    });

    await transaction.commit();

    return res.status(200).json({
      message:
        "Project berhasil dihapus",
    });

  } catch (error) {

    await transaction.rollback();

    return res.status(500).json({
      message: error.message,
    });

  }
};

export const updateProject = async (
  req,
  res
) => {

  const transaction =
    await sequelize.transaction();

  try {

    const project =
      await Project.findOne({

        where: {
          id: req.params.id,
          user_id: req.user.id,
        },

      });

    if (!project) {

      await transaction.rollback();

      return res.status(404).json({
        message:
          "Project tidak ditemukan",
      });

    }

    const {
      name,
      description,
      links,
      skills,
      existingImages,
    } = req.body;

    // =====================
    // UPDATE PROJECT
    // =====================

    await project.update(
      {
        name,
        description,
      },
      {
        transaction,
      }
    );

    // =====================
    // UPDATE LINKS
    // =====================

    await ProjectLink.destroy({
      where: {
        project_id: project.id,
      },
      transaction,
    });

    if (links) {

      const parsedLinks =
        JSON.parse(links);

      await ProjectLink.bulkCreate(

        parsedLinks.map(
          (link) => ({
            project_id:
              project.id,
            url: link,
          })
        ),

        {
          transaction,
        }

      );

    }

    // =====================
    // UPDATE SKILLS
    // =====================

    await ProjectSkill.destroy({
      where: {
        project_id: project.id,
      },
      transaction,
    });

    if (skills) {

      const parsedSkills =
        JSON.parse(skills);

      await ProjectSkill.bulkCreate(

        parsedSkills.map(
          (skillId) => ({
            project_id:
              project.id,
            skill_id:
              skillId,
          })
        ),

        {
          transaction,
        }

      );

    }

    // =====================
    // UPDATE GAMBAR
    // =====================

    const keepImages =
      existingImages
        ? JSON.parse(existingImages)
        : [];

    const oldImages =
      await ProjectImage.findAll({

        where: {
          project_id: project.id,
        },

      });

    for (const image of oldImages) {

      const imageUrl =
        `${req.protocol}://${req.get(
          "host"
        )}/uploads/projects/${image.image}`;

      const shouldKeep =
        keepImages.includes(
          imageUrl
        );

      if (!shouldKeep) {

        const imagePath =
          path.join(
            "uploads",
            "projects",
            image.image
          );

        if (
          fs.existsSync(imagePath)
        ) {

          fs.unlinkSync(imagePath);

        }

        await image.destroy({
          transaction,
        });

      }

    }

    if (
      req.files &&
      req.files.length > 0
    ) {

      await ProjectImage.bulkCreate(

        req.files.map(
          (file) => ({

            project_id:
              project.id,

            image:
              file.filename,

          })
        ),

        {
          transaction,
        }

      );

    }

    await transaction.commit();

    return res.status(200).json({
      message:
        "Project berhasil diperbarui",
    });

  } catch (error) {

    await transaction.rollback();

    return res.status(500).json({
      message:
        error.message,
    });

  }
};