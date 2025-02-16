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
        } else {
            // Initialiser un objet errors vide
            let errors = {};
            UsersModel.findOne({ email: req.body.email })
                .then(user => {
                    if (!user) {
                        errors.email = "not found user"
                        res.status(404).json(errors)

                    } else {
                        bcrypt.compare(req.body.password, user.password)
                            .then(isMatch => {
                                if (!isMatch) {
                                    errors.password = "incorrect password"
                                    res.status(404).json(errors)
                                } else {
                                    var token = jwt.sign({
                                        id: user._id,
                                        name: user.name,
                                        email: user.email,
                                        role: user.role
                                    }, process.env.PRIVATEKEY, { expiresIn: '10d' });
                                    res.status(200).json({
                                        message: 'succes',
                                        token: token
                                    })


                                }
                            })
                    }
                })
        }



    } catch (error) {
        console.log(error.message)

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
