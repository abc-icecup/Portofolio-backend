import User from "../models/User.js";


// GET semua user
export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll();

    res.status(200).json(users);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// DELETE user
export const deleteUser = async (req, res) => {
  try {

    const { id } = req.params;

    await User.destroy({
      where: { id },
    });

    res.status(200).json({
      message: "User berhasil dihapus",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

//UPDATE/PUT LOGIN USER (SEMENTARA)
export const updateUser = async (req, res) => {
  try {

    const { id } = req.params;

    const { username, email } = req.body;

    await User.update(
      {
        username,
        email,
      },
      {
        where: { id },
      }
    );

    res.status(200).json({
      message: "User berhasil diupdate",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET PROFILE
// {Letak Kode (Tinggal kenangan T-T)}

// UPDATE PROFILE
// {Letak Kode (Tinggal kenangan T-T)}