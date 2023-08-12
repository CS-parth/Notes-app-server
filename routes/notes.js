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

const handleUpdateRoute = async (req,res)=>{
    const {title,description,tag} = req.body;
    try {
        // creating new note
        const newNote = {};
        if(description){newNote.description = description;}
        if(title){newNote.title = title;}
        if(tag){newNote.tag = tag;}

        // Finding node by ID
        let note = await Notes.findById(req.params.id);
        if(!note){res.status(404).send("Not Found")} 
        if(note.user.toString()  !== req.user.id){
            return res.status(401).send("Not Allowed");
        }
    note = await Notes.findByIdAndUpdate(req.params.id, {$set: newNote}, {new:true});

    res.json(note);   
    } catch (error) {
        console.log(error.message);
        res.send(500).send("Internal Server Error");
    }
}

const handleDeleteRoute = async (req,res)=>{
    // const {title,description,tag} = req.body;
    try{
        // Finding node by ID
        let note = await Notes.findById(req.params.id);
        if(!note){res.status(404).send("Not Found")} 
        if(note.user.toString()  !== req.user.id){
            return res.status(401).send("Not Allowed");
        }
        note = await Notes.findByIdAndDelete(req.params.id);

        res.json({"Success": "Note has been deteled"});
    }catch(err){
        console.log(err.message);
        res.status(500).send("Internal Server errors");
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

// Route for updating an Existing note
router.put("/update/:id",fetchUsers,handleUpdateRoute)

// Router for deleting a note
router.delete("/deletenote/:id",fetchUsers,handleDeleteRoute);
module.exports = router;
 