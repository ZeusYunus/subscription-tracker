import nodemailer from 'nodemailer';

import { EMAIL_USER, EMAIL_PASSWORD } from './env.js';

export const accountEmail = EMAIL_USER;

const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: accountEmail,
        pass: EMAIL_PASSWORD
    }
});

export default transport;