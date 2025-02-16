const UsersModel = require('../models/users.models');
const { validateUser } = require('../validation/users.validation');
const bcrypt = require('bcryptjs');

/* AddUser */
const AddUsers = async (req, res) => {
  try {
    // Valider les données de la requête
    const { error } = validateUser(req.body);
    if (error) {
      return res.status(400).json({ errors: error.message });
    }

    // Vérifier si l'email existe déjà
    const exist = await UsersModel.findOne({ email: req.body.email });
    if (exist) {
      return res.status(400).json({ error: 'User Exist' });
    } else {
      const hash = bcrypt.hashSync(req.body.password, 10)//hashed password
      req.body.password = hash;

      await UsersModel.create(req.body)

      res.status(201).json({ message: 'User added with succes' });
    }

  } catch (error) {
    console.log(error.message)

  }
};

/* FindAllUsers */
const FindAllUsers = async (req, res) => {
  try {
    const users = await UsersModel.find().select('-password');; // Exclure les mots de passe pour des raisons de sécurité
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs', error: error.message });
  }
};
/* SearchUser */
const SearchUsers = async (req, res) => {
  try {
    const searchTerm = req.query.search;
    if (!searchTerm) {
      return res.status(400).json({ message: 'Search term is required' });
    }

    const users = await UsersModel.find({
      name: { $regex: searchTerm, $options: 'i' }
    });

    res.status(201).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error searching users', error: error.message });
  }
};


/* FindUser */
const FindSingleUser = async (req, res) => {

  try {
    const data = await UsersModel.findOne({ _id: req.params.id }).select('-password');
    res.status(201).json(data)

  } catch (error) {
    console.log(error.message)

  }
}

/* UpdateUser */
const UpdateUser = async (req, res) => {
  try {
    const { error } = validateUser(req.body);
    if (error) {
      return res.status(400).json({ errors: error.details });
    }

    // Vérifier si le mot de passe est présent dans la requête
    if (req.body.password) {
      req.body.password = bcrypt.hashSync(req.body.password, 10);
    }
    const data = await UsersModel.findOneAndUpdate(

      { _id: req.params.id },
      req.body,
      { new: true }
    ).select('-password');
    res.status(201).json(data);

  }



  catch (error) {
    console.log(error.message)

  }
}


/* DeleteUser */
const DeleteUser = async (req, res) => {
  try {

    await UsersModel.deleteOne({ _id: req.params.id })
    res.status(201).json({ message: "user deleted with success" })

  } catch (error) {
    console.log(error.message)

  }

}








module.exports = {
  AddUsers,
  FindSingleUser,
  FindAllUsers,
  UpdateUser,
  DeleteUser,
  SearchUsers
};
