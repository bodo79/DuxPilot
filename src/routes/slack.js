const router = require("express").Router();
const {UserToken, Msg} = require("../models")
const {getSlackConnector ,getSlackAccessToken, saveUsersFromSlack, saveChannelAndMsgsFromSlack } = require("../services/slack");


router.get("/", async (req, res) => {
    res.sendFile(__dirname + '/views/index.html')
})
// ROUTES oauth2
router.get("/auth", async (req, res) => {
    try {
        if (!req.query.code) {
            return res.status(500).statusMessage('no code, no access!').end();
        }

        const token = await getSlackAccessToken(req.query.code);
        if (!token) {
            return res.status(500).statusMessage('failed to connect').end();
        }

        const slackConnector = await getSlackConnector();
        res.status(200).redirect('/calender')

        saveUsersFromSlack(slackConnector);
        saveChannelAndMsgsFromSlack(slackConnector);

    } catch (error) {
        console.log("ERROR:", error);
        res.status(500).end();
    }
}
);

router.get("/test", async(req, res) => {
   let team_id = "T01081GCW4E" // TODO; getTeamByUser, for each user/team?
   let counter = 0;
   let result = Msg.find({'team': team_id, 'ts': { $gt: "1585100800" } , 'channel_id': {$regex:/^D/}}, function (err, person) {
    if (err) console.log(err);})
    for await (const msg of result){
        counter++;
    }
    console.log(counter)
})
router.get("/pull", async (req, res) => {
    try {
        // for await (const usertoken of UserToken.find()) {
        //      const token = usertoken.token;
        //      saveChannelAndMsgsFromSlack(token);
        //     (token);

        // }

        const slackConnector = await getSlackConnector("xoxp-9981337701-11960614679-1089990022544-8d8fa078f4c4d3546b496c700099eb76");
        if (!slackConnector) {
            return res.status(500).statusMessage('failed to connect')
        }

        res.status(200).redirect('/calender')

        saveChannelAndMsgsFromSlack(slackConnector)
    }
    catch (error) {
        console.log("ERROR:", error);
        res.status(500).end();
    }
});


module.exports = router;