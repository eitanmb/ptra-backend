const jwt = require('jsonwebtoken');

const validarJwt = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.sendStatus(401);
    }
    console.log(authHeader);
    // remove Bearer if using Bearer Authorization mechanism
    let token;
    if (authHeader.toLowerCase().startsWith('bearer')) {
        token = authHeader.slice('bearer'.length).trim();
    }
    else {
        token = authHeader;
    }
    jwt.verify(token, process.env.SECRET_SEED, (err, decoded) => {
        if (err) {
            return res.sendStatus(403);
        }

        req.uid = uid;
        req.firstName = firstName;
        next();
    });
};


module.exports = validarJwt;