const router = require("express").Router();

const { getDashboardStat } = require("../controllers/dashboard.controller");
const { userAuthentication, isAdmin } = require("../utils/auth");

router.get("/admin", userAuthentication, getDashboardStat);

module.exports = router;
