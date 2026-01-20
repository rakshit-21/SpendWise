const express = require("express")
const jwt = require("jsonwebtoken")
const cors = require("cors")

const app = express()
app.use(cors())
app.use(express.json())

const SECRET = "super_secret_key" // move to .env later


