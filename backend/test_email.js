import { sendEmail } from './mailtrap/nodemailer.config.js';

async function test() {
    console.log("Attempting to send test email...");
    const result = await sendEmail("a.abeselom.t@gmail.com", "SpareXChange Test", "<p>This is a test email sent from Node.js!</p>");
    if (result) {
        console.log("Test email SUCCESS");
    } else {
        console.log("Test email FAILED");
    }
}
test();
