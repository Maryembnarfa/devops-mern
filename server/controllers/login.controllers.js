const UsersModel = require('../models/users.models');
const { validateLogin } = require('../validation/login.validation');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Login = async (req, res) => {
    try {
        // Valider les données de la requête
        const { error } = validateLogin(req.body);
        if (error) {
            return res.status(400).json({ errors: error.message });
        }
        const { username, password } = req.body;
        // Rechercher l'utilisateur dans la base de données
        const user = await UsersModel.findOne({ username });

        if (!user) {
            return res.status(404).json({ errors: "Utilisateur non trouvé." });
        }

        // Vérifier le mot de passe
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ errors: "Mot de passe incorrect." });
        }

        // Générer un token JWT
        const token = jwt.sign(
            {
                id: user._id,
                name: user.name,
                username: user.username,
                role: user.role,
            },
            process.env.PRIVATEKEY,
            { expiresIn: '10d' }
        );

        res.status(200).json({
            message: 'Connexion réussie',
            token: token,
        });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: "Erreur interne du serveur." });
    }
};

const Test = async (req, res) => {
    res.send("welcome user")
}

const Admin = async (req, res) => {
    res.send("welcome admin")

}





module.exports = {
    Login,
    Test,
    Admin
};
