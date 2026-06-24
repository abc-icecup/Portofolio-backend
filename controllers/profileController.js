import fs from "fs";

import { User, Profile, SocialLink } from "../models/index.js";


// ======================================
// GET PROFILE
// ======================================

export const getProfile = async (req, res) => {

  try {

    const user = await User.findByPk(req.user.id, {
      attributes: ["id", "username", "email"],

      include: {
        model: Profile,
        attributes: ["bio", "profile_image"],

        include: {
          model: SocialLink,
          attributes: ["id", "url"],
        },
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User tidak ditemukan",
      });
    }

    res.status(200).json(user);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};


// ======================================
// UPDATE PROFILE
// ======================================

export const updateProfile = async (req, res) => {

  try {

    const { username, email, bio, socialLinks } = req.body;

    // ==========================
    // CEK USER
    // ==========================

    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User tidak ditemukan",
      });
    }

    // ==========================
    // CEK EMAIL DUPLIKAT
    // ==========================

    const existingEmail = await User.findOne({
      where: { email },
    });

    if (
      existingEmail &&
      existingEmail.id !== user.id
    ) {
      return res.status(400).json({
        message: "Email sudah digunakan",
      });
    }

    // ==========================
    // UPDATE USER
    // ==========================

    user.username = username;
    user.email = email;

    await user.save();

    // ==========================
    // CARI PROFILE
    // ==========================

    let profile = await Profile.findOne({
      where: {
        user_id: user.id,
      },
    });

    // ==========================
    // JIKA PROFILE BELUM ADA
    // ==========================

    if (!profile) {

      profile = await Profile.create({
        user_id: user.id,
        bio,
      });

    } else {

      profile.bio = bio;
    }

    // ==========================
    // HANDLE IMAGE
    // ==========================

    if (req.file) {

      // hapus foto lama
      if (profile.profile_image) {

        const oldPath = profile.profile_image;

        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      // simpan path baru
      profile.profile_image =
        req.file.path;
    }

    await profile.save();

    // ======================================
    // UPDATE SOCIAL LINKS
    // ======================================

    if (socialLinks) {

      // hapus link lama
      await SocialLink.destroy({
        where: {
          profile_id: profile.id,
        },
      });

      // parse data jika dikirim string JSON
      const parsedLinks =
        typeof socialLinks === "string"
          ? JSON.parse(socialLinks)
          : socialLinks;

      // simpan link baru
      for (const url of parsedLinks) {

        if (url.trim() !== "") {

          await SocialLink.create({
            profile_id: profile.id,
            url,
          });
        }
      }
    }

    res.status(200).json({
      message: "Profile berhasil diupdate",
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};