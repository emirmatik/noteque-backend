const router = require("express").Router();
const { User } = require("../schema/user");
const bcrypt = require("bcrypt-nodejs");
const jwt = require("jsonwebtoken");

router.post("/", async (req, res) => {
    const user = await User.findOne({ email: req.body.email })
    if (!user) return res.status(400).json({ error: "Wrong email or password" })

    await bcrypt.compare(req.body.password, user.password, (err, result) => {
        console.log(req.body.password)
        console.log(user.password)
        if (err) return res.json({ err });
        console.log(result)
        if (result == false) return res.json({ error: "Wrong email or password" });
        else {
            const token = jwt.sign({ _id: user._id }, process.env.JWT_PRIVATE);
            res.json(token)
        }
    })

})

module.exports = router