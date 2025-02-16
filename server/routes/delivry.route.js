const express = require('express');
const router = express.Router();
const { AddDelivry, FindAllDelivry, FindDelivryById, UpdateDelivry, DeleteDelivry, FindMyDelivry, UpdateDelivryStatus } = require('../controllers/delivry.controllers')
const passport = require('passport')
const { inRole, ROLES } = require('../security/RoleMiddleware');



/*Delivry*/
router.post('/delivry', passport.authenticate('jwt', { session: false }), inRole(ROLES.ADMIN), AddDelivry)
router.get('/delivry', passport.authenticate('jwt', { session: false }), inRole(ROLES.ADMIN), FindAllDelivry)
router.get('/delivry/:id', passport.authenticate('jwt', { session: false }), inRole(ROLES.ADMIN), FindDelivryById)
router.get('/mydelivry', passport.authenticate('jwt', { session: false }), inRole(ROLES.ADMIN), FindMyDelivry)
router.patch('/delivry/:id/status', passport.authenticate('jwt', { session: false }), inRole(ROLES.ADMIN), UpdateDelivryStatus)
router.put('/delivry/:id', passport.authenticate('jwt', { session: false }), inRole(ROLES.ADMIN), UpdateDelivry)
router.delete('/delivry/:id', passport.authenticate('jwt', { session: false }), inRole(ROLES.ADMIN), DeleteDelivry)









module.exports = router;