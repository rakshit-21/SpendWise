const jwt = require("jsonwebtoken")
const user = require("../data/user")
const { SECRET, EXPIRES_IN } = require("../config/jwt")

exports.login = (req, res) => {
  const { email, password } = req.body

  if (email !== user.email || password !== user.password) {
    return res.status(401).json({ message: "Invalid credentials" })
  }

  const token = jwt.sign(
    { id: user.id, email: user.email },
    SECRET,
    { expiresIn: EXPIRES_IN }
  )

  res.json({ token })
}
