const jwt = require("jsonwebtoken")
const { SECRET } = require("../config/jwt")

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.sendStatus(401)
  }

  const token = authHeader.split(" ")[1]

  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.sendStatus(403)

    req.user = user
    next()
  })
}
