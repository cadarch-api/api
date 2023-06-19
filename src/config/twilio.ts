import { Twilio } from "twilio"
// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
import dotenv from 'dotenv'
dotenv.config();
//live
// const accountSid = 'ACa37c39b8cd17005d404e0faa32b85cb2';
// const authToken = 'ef57e34c885747b620d717d5bf4b1503';
//const fromNumber = '+12025178039`';
//testing cadarch
// const accountSid = 'AC835d25f9c98bc11274a5f90c5b52d085';
// const authToken = '76467fbf87774218c15352a938f023a2';

//testing mohsin
const accountSid = 'ACee9ae052d10d22bfad1de2f76b80ada5';
const authToken = '4d92061b441b1166d7c5fd676a197b7f';
const fromNumber = '+16693483586`';

//initialize twilio client
const client = new Twilio(accountSid, authToken);
// console.log(client);

export const sendOtp = async (phoneNumber: string, otp: string) => {
    try {
        // console.log(phoneNumber,"---",otp);
        if (phoneNumber && otp) {
            const message = await client.messages
                .create({
                    body: `This is your verification code for Cadarch App ${otp}`,
                    // from: `+13855263821`,
                    from: `${fromNumber}`,
                    to: `${phoneNumber}`
                });
            // console.log("this is mesage ---",message);
            if (!message.errorCode) {
                return true
            }
            else {
                return false
            }
        }
        else {
            console.log('phoneNumber or otp missing')
        }
    }
    catch (e: any) {
        console.log(e, "error")
        return false
    }
}
