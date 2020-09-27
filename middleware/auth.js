const jwt = require("jsonwebtoken");

function auth(req, res, next) {
    const token = req.header("token");

    try {
        const decoded = jwt.verify(token, process.env.JWT_PRIVATE);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(400).send("invalid token");
    }
}

module.exports = auth