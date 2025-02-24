const express = require('express');
const router = express.Router();
const passport = require('passport')
const { inRole, ROLES } = require('../security/RoleMiddleware');
const { AddVehicle, FindAllVehicle, FindVehicleById, UpdateVehicle, DeleteVehicle } = require('../controllers/vehicle.controllers');

router.post('/vehicles', passport.authenticate('jwt', { session: false }), inRole(ROLES.ADMIN), AddVehicle);
router.get('/vehicle', passport.authenticate('jwt', { session: false }), inRole(ROLES.ADMIN), FindAllVehicle);
router.get('/vehicle/:id', passport.authenticate('jwt', { session: false }), FindVehicleById);
router.put('/vehicle/:id', passport.authenticate('jwt', { session: false }), UpdateVehicle);
router.delete('/vehicle/:id', passport.authenticate('jwt', { session: false }), inRole(ROLES.ADMIN), DeleteVehicle)

module.exports = router;