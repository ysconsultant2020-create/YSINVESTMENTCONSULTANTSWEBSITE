const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

const handleEmailError = (err, recipientType) => {
  console.error(`❌ Error sending ${recipientType} email:`, err.message);
  if (err.code === 'EAUTH' || err.message?.includes('534') || err.message?.includes('Application-specific password')) {
    console.warn(`
⚠️ GMAIL SMTP AUTHENTICATION FAILED!
Google requires a 16-character "App Password" to send emails via Nodemailer.
Your standard account password cannot be used for SMTP.

👉 HOW TO FIX IN 2 MINUTES:
1. Go to https://myaccount.google.com/apppasswords
2. Under "Select app", choose "Mail" or type "YS Website"
3. Click "Create" to generate a 16-character App Password (e.g. "abcd efgh ijkl mnop")
4. Open server/.env and set:
   EMAIL_PASS=your_16_character_app_password
5. Save the file and restart the server!
`);
  }
};

// Send email to manager when appointment is booked
const sendManagerNotification = async (appointmentData) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn('⚠️ Email credentials missing in server/.env. Skipping email sending.');
      return;
    }

    const transporter = createTransporter();
    const mailOptions = {
      from: `"YS Investment Consultants" <${process.env.EMAIL_USER}>`,
      to: process.env.MANAGER_EMAIL || 'ysconsultant2020@gmail.com',
      subject: `New Appointment - ${appointmentData.productType} | ${appointmentData.fullName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { margin: 0; padding: 0; font-family: 'Segoe UI', Arial, sans-serif; background: #f4f4f4; }
            .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
            .header { background: linear-gradient(135deg, #0a1628 0%, #1a2942 100%); padding: 30px; text-align: center; }
            .header h1 { color: #d4af37; margin: 0; font-size: 24px; }
            .header p { color: #ffffff; margin: 5px 0 0; font-size: 14px; }
            .content { padding: 30px; }
            .badge { display: inline-block; background: #d4af37; color: #0a1628; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; margin-bottom: 20px; }
            .detail-row { display: flex; padding: 12px 0; border-bottom: 1px solid #f0f0f0; }
            .detail-label { color: #666; font-size: 13px; width: 140px; font-weight: 600; }
            .detail-value { color: #1a2942; font-size: 14px; font-weight: 500; }
            .footer { background: #0a1628; padding: 20px; text-align: center; }
            .footer p { color: #999; font-size: 12px; margin: 0; }
            .footer a { color: #d4af37; text-decoration: none; }
            table { width: 100%; border-collapse: collapse; }
            td { padding: 10px 0; vertical-align: top; }
            .label-td { color: #666; font-size: 13px; width: 140px; font-weight: 600; }
            .value-td { color: #1a2942; font-size: 14px; font-weight: 500; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>YS Investment Consultants</h1>
              <p>New Appointment Notification</p>
            </div>
            <div class="content">
              <span class="badge">NEW APPOINTMENT</span>
              <table>
                <tr>
                  <td class="label-td">Customer Name</td>
                  <td class="value-td">${appointmentData.fullName}</td>
                </tr>
                <tr>
                  <td class="label-td">Email</td>
                  <td class="value-td">${appointmentData.email}</td>
                </tr>
                <tr>
                  <td class="label-td">Phone</td>
                  <td class="value-td">${appointmentData.phone}</td>
                </tr>
                <tr>
                  <td class="label-td">Product Type</td>
                  <td class="value-td">${appointmentData.productType}</td>
                </tr>
                <tr>
                  <td class="label-td">Product</td>
                  <td class="value-td">${appointmentData.productName || 'N/A'}</td>
                </tr>
                <tr>
                  <td class="label-td">Preferred Date</td>
                  <td class="value-td">${appointmentData.preferredDate}</td>
                </tr>
                <tr>
                  <td class="label-td">Preferred Time</td>
                  <td class="value-td">${appointmentData.preferredTime}</td>
                </tr>
                <tr>
                  <td class="label-td">City</td>
                  <td class="value-td">${appointmentData.city || 'N/A'}</td>
                </tr>
                <tr>
                  <td class="label-td">Message</td>
                  <td class="value-td">${appointmentData.message || 'No message'}</td>
                </tr>
              </table>
            </div>
            <div class="footer">
              <p>YS Investment Consultants</p>
              <p><a href="mailto:ysconsultant2020@gmail.com">ysconsultant2020@gmail.com</a> | 9810062733</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Manager notification email sent successfully');
  } catch (error) {
    handleEmailError(error, 'manager');
  }
};

// Send confirmation email to client
const sendClientConfirmation = async (appointmentData) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return;
    }

    const transporter = createTransporter();
    const mailOptions = {
      from: `"YS Investment Consultants" <${process.env.EMAIL_USER}>`,
      to: appointmentData.email,
      subject: `Appointment Confirmed - YS Investment Consultants`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { margin: 0; padding: 0; font-family: 'Segoe UI', Arial, sans-serif; background: #f4f4f4; }
            .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
            .header { background: linear-gradient(135deg, #0a1628 0%, #1a2942 100%); padding: 30px; text-align: center; }
            .header h1 { color: #d4af37; margin: 0; font-size: 24px; }
            .content { padding: 30px; }
            .greeting { font-size: 18px; color: #1a2942; font-weight: 600; margin-bottom: 15px; }
            .message { color: #555; font-size: 14px; line-height: 1.6; }
            .details-box { background: #f8f9fa; border-left: 4px solid #d4af37; padding: 20px; margin: 20px 0; border-radius: 0 8px 8px 0; }
            .details-box p { margin: 8px 0; color: #333; font-size: 14px; }
            .details-box strong { color: #1a2942; }
            .cta { text-align: center; margin: 25px 0; }
            .cta-text { color: #666; font-size: 13px; margin-top: 15px; }
            .footer { background: #0a1628; padding: 20px; text-align: center; }
            .footer p { color: #999; font-size: 12px; margin: 3px 0; }
            .footer a { color: #d4af37; text-decoration: none; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>YS Investment Consultants</h1>
            </div>
            <div class="content">
              <p class="greeting">Dear ${appointmentData.fullName},</p>
              <p class="message">
                Thank you for booking an appointment with YS Investment Consultants. 
                We have received your request and our team will get back to you shortly.
              </p>
              <div class="details-box">
                <p><strong>Product:</strong> ${appointmentData.productType} - ${appointmentData.productName || ''}</p>
                <p><strong>Preferred Date:</strong> ${appointmentData.preferredDate}</p>
                <p><strong>Preferred Time:</strong> ${appointmentData.preferredTime}</p>
                <p><strong>Status:</strong> Pending Review</p>
              </div>
              <p class="message">
                Our financial advisor will contact you within 24 hours to confirm your appointment.
                If you have any urgent queries, please call us at <strong>9810062733</strong>.
              </p>
              <p class="cta-text">This is an automated confirmation email from YS Investment Consultants.</p>
            </div>
            <div class="footer">
              <p>YS Investment Consultants</p>
              <p><a href="mailto:ysconsultant2020@gmail.com">ysconsultant2020@gmail.com</a></p>
              <p>Phone: 9810062733</p>
              <p><a href="https://www.instagram.com/ysinvestmentconsultants/">@ysinvestmentconsultant</a></p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Client confirmation email sent successfully');
  } catch (error) {
    handleEmailError(error, 'client');
  }
};

module.exports = { sendManagerNotification, sendClientConfirmation };
