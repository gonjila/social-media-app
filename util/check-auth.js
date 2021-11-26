const jwt = require("jsonwebtoken");
const { AuthenticationError } = require("apollo-server");
const { SECRET_KEY } = require("../config");

module.exports = (context) => {
    // context = {... headers}
    const authHeader = context.req.headers.authorization;
    if (authHeader) {
        // Bearer ....
        const token = authHeader.split(` `)[1].replace('"', "");
        if (token) {
            try {
                const user = jwt.verify(token, SECRET_KEY);
                return user;
            } catch {
                throw new AuthenticationError("Invalid/Expired token");
            }
        }
        throw new Error("Authentication token must be 'Bearer [token]'");
    }
    throw new Error("Authorization header must be provided");
};
