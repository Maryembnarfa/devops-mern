const express=require('express');
const passport=require('passport')

const { Login, Test, Admin } = require('../controllers/login.controllers');
const { inRole,ROLES } = require('../security/RoleMiddleware');
const router=express.Router();


router.post('/login',Login)
router.get('/test',passport.authenticate('jwt',{session:false}),inRole(ROLES.USER),Test);
router.get('/admin',passport.authenticate('jwt',{session:false}),inRole(ROLES.ADMIN),Admin);




module.exports=router;