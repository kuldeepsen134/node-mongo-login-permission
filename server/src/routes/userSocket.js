const { actions, routes } = require("../utils/socketTypes")




module.exports = (io, client, user, message) => {
    if (typeof message !== "object") return

    switch (message.type) {
        case actions.EMAIL_CONFIRMED:

            break;

        default:
            break;
    }

    console.log("user socket route");
}