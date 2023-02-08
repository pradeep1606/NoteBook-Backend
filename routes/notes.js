const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Note = require('../models/Note');
const { body, validationResult } = require('express-validator');

//ROUTE 1: Get all notes: GET "/api/notes/fetchnotes" and Login required
router.get('/fetchnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id });
        res.json(notes);
    } catch (error) {
        console.error(error.massage);
        res.status(500).send("Server error")
    }
})


//ROUTE 2:Add a new note: POST "/api/notes/addnote" and Login required
router.post('/addnote', fetchuser, [
    body('description', 'Enter description').isLength({ min: 3 }),
], async (req, res) => {
    try {
        const { title, description, tag } = req.body;
        // if there are error, return bad request and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
        const note = new Note({
            title, description, tag, user: req.user.id
        })
        const savedNote = await note.save();
        res.json(savedNote);
    } catch (error) {
        console.error(error.massage);
        res.status(500).send("Server error")
    }
})


//ROUTE 3:Update the note: PUT "/api/notes/updatenote" and Login required
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    const { title, description, tag } = req.body;
    try {
        // create a new note object
        const newNote = {};
        if (title) { newNote.title = title };
        if (description) { newNote.description = description };
        if (tag) { newNote.tag = tag };

        // find the note to be updated and update it
        let note = await Note.findById(req.params.id);
        if (!note) { return res.status(404).send("Not Found") };

        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed")
        }

        note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
        res.json(note);
    }
    catch (error) {
        console.error(error.massage);
        res.status(500).send("Server error")
    }
})


//ROUTE 4:Delete existing note: DELETE "/api/notes/deletenote" and Login required
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {
        // find the note to be deleted and delete it
        let note = await Note.findById(req.params.id);
        if (!note) { return res.status(404).send("Not Found") };

        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed")
        }

        note = await Note.findByIdAndDelete(req.params.id);
        res.json({ "Success": "Note has been deleted", note: note });
    } catch (error) {
        console.error(error.massage);
        res.status(500).send("Server error")
    }
})

module.exports = router