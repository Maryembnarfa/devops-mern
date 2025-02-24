const express = require('express');
const router = express.Router();
const passport = require('passport')
const { inRole, ROLES } = require('../security/RoleMiddleware');


const { AddUsers, FindSingleUser, UpdateUser, DeleteUser, SearchUsers, FindAllUsers } = require('../controllers/users.controllers');

/*Users*/
router.post('/user', AddUsers)
router.get('/users', passport.authenticate('jwt', { session: false }), inRole(ROLES.ADMIN), FindAllUsers);
router.get('/users/search', passport.authenticate('jwt', { session: false }), SearchUsers)
router.get('/users/:id', passport.authenticate('jwt', { session: false }), FindSingleUser)
router.put('/users/:id', passport.authenticate('jwt', { session: false }), UpdateUser)
router.delete('/users/:id', passport.authenticate('jwt', { session: false }), inRole(ROLES.ADMIN), DeleteUser)









module.exports = router;