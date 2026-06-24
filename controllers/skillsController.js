import fs from "fs";

import { Skill } from "../models/index.js";


// ======================================
// GET SKILLS & TOOLS
// ======================================

export const getSkills = async (req, res) => {

  try {

    const skills = await Skill.findAll({
      where: {
        user_id: req.user.id,
      },
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json(skills);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};


// ======================================
// ADD SKILL / TOOL
// ======================================

export const addSkill = async (req, res) => {

  try {

    const { name, category } = req.body;

    if (!name || !category) {
      return res.status(400).json({
        message: "Nama dan kategori wajib diisi",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Icon wajib diupload",
      });
    }

    const skill = await Skill.create({

      user_id: req.user.id,

      name,

      category,

      icon: req.file.path,

    });

    res.status(201).json({

      message: "Data berhasil ditambahkan",

      skill,

    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};


// ======================================
// UPDATE SKILL / TOOL
// ======================================

export const updateSkill = async (req, res) => {

  try {

    const skill = await Skill.findByPk(
      req.params.id
    );

    if (!skill) {
      return res.status(404).json({
        message: "Data tidak ditemukan",
      });
    }

    if (skill.user_id !== req.user.id) {
      return res.status(403).json({
        message: "Akses ditolak",
      });
    }

    const { name, category } = req.body;

    skill.name =
      name || skill.name;

    skill.category =
      category || skill.category;

    // ==========================
    // GANTI ICON
    // ==========================

    if (req.file) {

      if (
        skill.icon &&
        fs.existsSync(skill.icon)
      ) {
        fs.unlinkSync(skill.icon);
      }

      skill.icon =
        req.file.path;
    }

    await skill.save();

    res.status(200).json({
      message: "Data berhasil diperbarui",
      skill,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};


// ======================================
// DELETE SKILL / TOOL
// ======================================

export const deleteSkill = async (req, res) => {

  try {

    const skill = await Skill.findByPk(
      req.params.id
    );

    if (!skill) {
      return res.status(404).json({
        message: "Data tidak ditemukan",
      });
    }

    if (skill.user_id !== req.user.id) {
      return res.status(403).json({
        message: "Akses ditolak",
      });
    }

    if (
      skill.icon &&
      fs.existsSync(skill.icon)
    ) {
      fs.unlinkSync(skill.icon);
    }

    await skill.destroy();

    res.status(200).json({
      message: "Data berhasil dihapus",
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};