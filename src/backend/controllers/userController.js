const userService = require("../services/userService");


// =========================
// GET ALL USERS
// =========================
exports.getUsers = (req, res) => {

  try {

    const users =
      userService.getAll();

    res.json(users);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Erro ao carregar utilizadores"
    });

  }

};


// =========================
// GET USER BY ID
// =========================
exports.getUserById = (req, res) => {

  try {

    const user =
      userService.getById(req.params.id);

    if (!user) {

      return res.status(404).json({
        error: "Utilizador não encontrado"
      });

    }

    res.json(user);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Erro ao carregar utilizador"
    });

  }

};


// =========================
// CREATE USER
// =========================
exports.createUser = (req, res) => {

  try {

    const user =
      userService.create(req.body);

    res.status(201).json(user);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Erro ao criar utilizador"
    });

  }

};


// =========================
// UPDATE USER
// =========================
exports.updateUser = (req, res) => {

  try {

    const user =
      userService.update(
        req.params.id,
        req.body
      );

    res.json(user);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Erro ao atualizar utilizador"
    });

  }

};


// =========================
// DELETE USER
// =========================
exports.deleteUser = (req, res) => {

  try {

    userService.delete(req.params.id);

    res.json({
      success: true
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Erro ao eliminar utilizador"
    });

  }

};