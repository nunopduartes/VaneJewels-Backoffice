const sgMail = require('@sendgrid/mail');

const sendgridAPIKey = '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';
sgMail.setApiKey(sendgridAPIKey);

const sendWelcomeMail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'thevanejewels@gmail.com',
        subject: 'Welcome to VaneJewels',
        text: `Hi, ${name}. Congratulations for joining the family! Here's a code for you: VJ2021`,
        html: `<h1>Hi, ${name}. Congratulations for joining the family! Here's a code for you: VJ2021</h1>`
    })
}

const sendBuyMail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'thevanejewels@gmail.com',
        subject: 'Thank you for your order at VaneJewels!',
        text: `Hi, ${name}. Congratulations for you order at VaneJewels, soon you will get a new email with your order updates. Have a nice one!`,
        html: `<h1>Hi, ${name}. Congratulations for you order at VaneJewels, soon you will get a new email with your order updates. Have a nice one!</h1>`
    })
}


module.exports = {sendWelcomeMail, sendBuyMail};