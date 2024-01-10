const express = require("express")
const { registerUser} = require("../controllers/userControllers")
const {authUser ,allUsers} = require("../controllers/userControllers")
const { protect } = require("../middleware/authMiddleware")

const router = express.Router()

router.route('/login').post(authUser)
router.route('/').post(registerUser).get(protect,allUsers)


module.exports = router