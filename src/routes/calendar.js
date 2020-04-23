const router = require("express").Router();
const { saveCalendarData, createOuthUrlToken, getToken, saveTokenUserData } = require("../services/calendar");

router.get("/", async (req, res) => {
    let url = createOuthUrlToken()
    res.redirect(url);
})
// ROUTES oauth2
router.get("/auth/", async (req, res) => {
    try {
        if (!req.query.code) {
	    res.statusMessage = "no code,no access!"
            return res.status(500).end();
        }
        const token = await getToken(req.query.code)
        if (!token) {
            res.statusMessage = "failed to connect"
            return res.status(500).end();
        }
        
        let user_id = saveTokenUserData(token);
        saveCalendarData(token, user_id);
	res.statusMessage = "Thanks for signing up to DUX AI!"
        return res.sendFile(__dirname + '/views/doneSignUp.html').status(200).end();
        

    } catch (error) {
        console.log("ERROR:", error);
        res.status(500).end();
    }
}
);

module.exports = router;
