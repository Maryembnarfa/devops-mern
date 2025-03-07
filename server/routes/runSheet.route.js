const express = require('express');
const router = express.Router();
const passport = require('passport')
const { inRole, ROLES } = require('../security/RoleMiddleware');

const { AddRunSheet, FindAllRunSheet, FindRunSheetById, DeleteRunSheet, UpdateRunSheetStatus } = require('../controllers/runSheet.controllers')
router.post('/runSheet', passport.authenticate('jwt', { session: false }), inRole(ROLES.ADMIN), AddRunSheet)
router.get('/runSheet', passport.authenticate('jwt', { session: false }), inRole(ROLES.ADMIN), FindAllRunSheet)
router.get('/runSheet/:id', passport.authenticate('jwt', { session: false }), inRole(ROLES.ADMIN), FindRunSheetById)
router.delete('/runSheet/:id', passport.authenticate('jwt', { session: false }), inRole(ROLES.ADMIN), DeleteRunSheet)
router.put('/runSheet/:id/updateStatus', passport.authenticate('jwt', { session: false }), inRole(ROLES.ADMIN), UpdateRunSheetStatus);

module.exports = router;