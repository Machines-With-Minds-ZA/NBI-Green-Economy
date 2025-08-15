const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const cors = require('cors');

// Configure CORS to allow specific origins
const corsOptions = {
  origin: ['http://127.0.0.1:5504', 'http://localhost:5504', 'http://your-domain.com'],
  methods: ['POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

const corsMiddleware = cors(corsOptions);

admin.initializeApp();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'nbigreeneconomy@gmail.com',
    pass: functions.config().gmail.app_password
  }
});

exports.sendVerificationEmail = functions.https.onRequest((req, res) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS request for CORS');
    res.set({
      'Access-Control-Allow-Origin': 'http://127.0.0.1:5504',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '3600'
    });
    res.status(204).send('');
    return;
  }

  corsMiddleware(req, res, async () => {
    console.log('Processing sendVerificationEmail request:', req.body);
    const { email, code, link } = req.body.data || {};

    if (!email || !code || !link) {
      console.error('Invalid input:', { email, code, link });
      res.status(400).json({
        error: {
          code: 'invalid-argument',
          message: 'Missing email, code, or link'
        }
      });
      return;
    }

    if (email !== 'nbigreeneconomy@gmail.com') {
      console.error('Unauthorized email:', email);
      res.status(403).json({
        error: {
          code: 'permission-denied',
          message: 'Invalid email address'
        }
      });
      return;
    }

    const mailOptions = {
      from: 'nbigreeneconomy@gmail.com',
      to: email,
      subject: 'Your Admin Verification Code - Aug 15, 2025, 22:55 SAST',
      text: `Your verification code is: ${code}\nClick here to verify and re-enable the login button: ${link}\nThis code expires in 10 minutes.\nGenerated at: 10:55 PM SAST, Friday, August 15, 2025`,
      html: `<p>Your verification code is: <strong>${code}</strong></p><p>Click <a href="${link}">here</a> to verify and re-enable the login button.</p><p>This code expires in 10 minutes.</p><p>Generated at: 10:55 PM SAST, Friday, August 15, 2025</p>`
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log(`Verification email sent to ${email} at 10:55 PM SAST, Aug 15, 2025. Message ID: ${info.messageId}`);
      res.status(200).json({ success: true, messageId: info.messageId });
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({
        error: {
          code: 'internal',
          message: 'Failed to send verification email: ' + error.message
        }
      });
    }
  });
});