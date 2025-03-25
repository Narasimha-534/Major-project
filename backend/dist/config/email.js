import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail', // Use your email provider
  auth: {
    user: 'aarettinarasimha@gmail.com',
    pass: 'awjecelptvwtyknx', // Use an app password if using Gmail
  },
});

export default transporter;
