const express = require('express');
const fetchUsers = require('../Middleware/fetchuser');
const Notes = require('../Models/Notes');
const router = express.Router();
const {body,validationResult} = require('express-validator');



const handleFetchNotes = async (req,res)=>{
    const notes = await Notes.find({user: req.user.id});
    res.json(notes);
};

const handleAddNote = async (req,res)=>{   
    try{
        const errors = validationResult(req);
        const {title, description, tag} = req.body;
        if(!errors.isEmpty()){
            res.status(400).json({errors: errors.array()});
        }

        const note = new Notes({
            title, description, tag, user: req.user.id
        })
        const savednote = await note.save();
        res.json(savednote);
    }catch(err){
        
    }
}
// featching all the notes associated with the user 
// Route For featching alll the notes associated with the procided token
router.get("/featchallnotes",fetchUsers,handleFetchNotes)
// Route For Adding a particular notes with the associated user
router.post('/addnote',fetchUsers,
        body('title','Enter a valid title').isLength({min: 3}),
        body('description','Description must be atleast 5 characters').isLength({min: 5})
,handleAddNote)
module.exports = router;
 