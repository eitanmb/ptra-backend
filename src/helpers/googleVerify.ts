const {OAuth2Client} = require('google-auth-library');

const client = new OAuth2Client( process.env.GOOGLE_CLIENT_ID );

export default async function googleVerify( token:string ) {
  
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const { given_name:firstName , family_name: lastName, email } = ticket.getPayload();

    return {
        firstName,
        lastName,
        email
    }
}

