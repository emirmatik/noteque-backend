const router = require("express").Router();
const { User, validateUser } = require("../schema/user");
const bcrypt = require("bcrypt-nodejs");
const jwt = require("jsonwebtoken")
const auth = require("../middleware/auth")

// get all users
router.get("/", async (req, res) => {
    const users = await User.find();
    res.json(users.map(user => ({
        username: user.username
    })))
})

// get the current user with the given token
router.get("/me", auth, async (req, res) => {
    const userID = req.user._id;
    const user = await User.findOne({ _id: userID })
    res.json(user);
})

router.post("/", async (req, res) => {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message })

    // check if there is a user with same email / username
    let sameUser = await User.find({ username: req.body.username })
    if (sameUser.length > 0) return res.status(400).json({ error: "There is a user with same username :/" })

    sameUser = await User.find({ email: req.body.email })
    if (sameUser.length > 0) return res.status(400).json({ error: "There is a user with same email :/" })

    // create new user
    const user = new User(req.body);
    bcrypt.hash(user.password, null, null, (err, hash) => {
        if (err) return err;
        else user.password = hash
    })
    // save it
    await user.save();
    const token = jwt.sign({ _id: user._id }, process.env.JWT_PRIVATE)

    res.json(token)
})

// add new note
router.post("/newnote", async (req, res) => {
    const user = await User.findById(req.body.id);
    user.notes.unshift(req.body.note)
    await user.save()
    res.json(user.notes)
})

// delete the note
router.delete("/deletenote", async (req, res) => {
    let user = await User.findById(req.body.userID);
    user.notes = user.notes.filter(note => note._id != req.body.noteID);
    await user.save()
    res.json(user.notes)
})

// update the note
router.put("/updatenote", async (req, res) => {
    const user = await User.findById(req.body.userID);
    const note = user.notes.find(note => note._id == req.body.noteID);
    note.title = req.body.title;
    note.desc = req.body.desc;
    await user.save()
    res.json(user.notes)
})

// pin the note
router.put("/pinnote", async (req, res) => {
    const user = await User.findById(req.body.userID);
    const note = user.notes.find(note => note._id == req.body.noteID);
    note.isPinned = !note.isPinned;
    await user.save()
    res.json(user.notes)
})

module.exports = router;