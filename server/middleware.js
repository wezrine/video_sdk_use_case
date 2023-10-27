require ('dotenv').config();
const KJUR = require('jsrsasign');

const middleware = {}

middleware.generateToken = (req, res, next) => {
    try {
        let signature = '';
        const iat = Math.round(new Date().getTime() / 1000);
        const exp = iat + 60 * 60 * 2;
        const oHeader = { alg: 'HS256', typ: 'JWT' };

        const { topic, password, userIdentity, sessionKey, roleType } = req.body;

        const sdkKey = process.env.SDK_KEY;
        const sdkSecret = process.env.SDK_SECRET;

        const oPaylod = {
            app_key: sdkKey,
            iat,
            exp,
            tpc: topic,
            pwd: password,
            user_identity: userIdentity,
            session_key: sessionKey,
            role_type: roleType
        }
        const sHeader = JSON.stringify(oHeader);
        const sPayload = JSON.stringify(oPaylod);
        signature = KJUR.jws.JWS.sign('HS256', sHeader, sPayload, sdkSecret);

        res.locals.signature = signature;
        return next()
    } catch(err) {
        return next({err})
    }
}

module.exports = middleware