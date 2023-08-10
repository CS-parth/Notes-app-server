const express = require('express');
const router = express.Router();
const User = require("../Models/User");
const { validationResult,body } = require('express-validator');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const JWT_SECRET = "jwt#kunwhidhsodi$sdghjld";
const fetchUser = require('../Middleware/fetchuser');
// All routing handlers

// Creating user
const handleCreateUserRoute = async (req,res)=>{
        try{
                const result = validationResult(req);
                if(result.isEmpty()){
                        // console.log(req);
                        var salt = await bcrypt.genSaltSync(10);
                        var hash = bcrypt.hashSync(req.body.password, salt);
                        req.body.password = hash;
                        const newUser = new User(req.body);
                        await newUser.save();
                        // await User.create(req.body);

                        //using jsonwebtoken to create a token-based authentication
                        const data = {
                                user:{
                                     id: newUser._id
                                } 
                        }
                        const authToken = jwt.sign(data,JWT_SECRET);
                        res.json({authToken});
                }else{
                        // Errors related to email validation,sanitaion,modifications will be logged here 
                        // alert(`Error: ${result.array().msg}`);
                        // console.log(result.array());
                        result.array().forEach((error)=>{
                        switch (error.type) {
                                case 'field':
                                        // `error` is a `FieldValidationError`
                                        console.log(error.path, error.location, error.value);
                                        break;
                                
                                case 'alternative':
                                        // `error` is an `AlternativeValidationError`
                                        console.log(error.nestedErrors);
                                        break;
                                
                                case 'alternative_grouped':
                                        // `error` is a `GroupedAlternativeValidationError`
                                        error.nestedErrors.forEach((nestedErrors, i) => {
                                        console.log(`Errors from chain ${i}:`);
                                        console.log(nestedErrors);
                                        });
                                        break;
                                
                                case 'unknown_fields':
                                        // `error` is an `UnknownFieldsError`
                                        console.log(error.fields);
                                        break;
                                
                                default:
                                        // Error is not any of the known types! Do something else.
                                        throw new Error(`Unknown error type ${error.type}`);
                                }
                        });
                }
                // res.status(200).join({Credentials : `${req.body}`});
        }catch(err){
                // Errors related to users schema will be looged here 
                // Duplication of the Email will automatically be cathed here 
                res.status(401).json({Error : `${err.message}`});
        }
} 
// Authentication of the User
const handleAuthuserRoute = async (req,res)=>{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
                return res.status(400).json({errors: errors.array() });
        }

        const {email,password} = req.body;      
        try{
                let user = await User.findOne({email});
                if(!user){
                        return res.status(401).json({error: "Please try to login with correct password"});
                }
                const passwordCompare = await bcrypt.compare(password,user.password);
                if(!passwordCompare){
                        return res.status(401).json({error: "Please try to login with correct password"});
                }
                const data = {
                        user:{
                             id: user._id
                        } 
                }
                const authToken = jwt.sign(data,JWT_SECRET);
                res.json({authToken});
        }catch(err){
                console.log(err.msg);
                res.status(500).send("Internal Server Error Occurred");
        }       
}
// Get User details 
const handleResourseRoute = async (req,res)=>{
        try{
                const userId = req.user.id;
                const user = await User.findById(userId).select("-password");
                res.send(user);
        }catch(err){
                console.log(err.msg);
                res.status(500).send("Internal Server Error");
        }
}
router.post("/createUser",
        body('email')
        .trim()
        .isEmail()
        .escape(),
        body('name')
        .trim()
        .escape(),
        body('password')
        .escape()
        .isStrongPassword({minLength:8,minLowercase:1,minUppercase:1,minSymbols:1})
        .trim()
,handleCreateUserRoute) 

router.post("/login",
        body('email')
        .trim()
        .isEmail(),
        body('password')
        .trim()
        .exists()
,handleAuthuserRoute)

// authentication is done before providing the resources using the middlewares 
router.post("/getResource",fetchUser,handleResourseRoute)
module.exports = router;


// t0ken
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjRkMTNhNzBkZGRlYzllMTM3Y2EwYjVkIn0sImlhdCI6MTY5MTQzMzU4NH0.CHKDrnkG4Y_xpo4wwSLuEHSvSapaYadC5ydeHvTdRD