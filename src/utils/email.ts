import nodemailer from 'nodemailer';

// Transporter SMTP cấu hình từ các biến môi trường
const getTransporter = () => {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '465', 10);
  const secure = port === 465; // true cho 465, false cho 587
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  });
};

const getSiteUrl = (): string => {
  const rawSiteUrl = process.env.SITE_URL || 
                     (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://heli-smart-massage-chair-web.vercel.app/');
  if (rawSiteUrl.includes('localhost') && process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return rawSiteUrl;
};

// Kiểu dữ liệu cho Booking
export interface BookingEmailData {
  fullName: string;
  companyName: string;
  email: string;
  phone: string;
  employeeCount: string;
  preferredDate: string;
  location: string;
  details?: string;
}

// Kiểu dữ liệu cho Contact
export interface ContactEmailData {
  fullName: string;
  email: string;
  message: string;
}

/**
 * Gửi email thông báo khi có Đăng ký báo giá (Booking) mới.
 * Gửi 2 email:
 * 1. Thư xác nhận gửi cho khách hàng (Customer Confirmation).
 * 2. Thư thông báo gửi cho Admin (Admin Alert).
 */
export async function sendBookingEmails(data: BookingEmailData): Promise<void> {
  const transporter = getTransporter();
  if (!transporter) {
    console.warn('[Email Utility] SMTP_USER or SMTP_PASS is missing. Skipping booking emails.');
    return;
  }

  const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;
  const fromName = process.env.SMTP_FROM_NAME || 'Heli Smart Massage Chair Team';
  const fromEmail = process.env.SMTP_USER;
  const siteUrl = getSiteUrl();

  // 1. HTML Template gửi cho KHÁCH HÀNG (Customer Confirmation)
  const customerHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Quote Request Received</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7f6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 30px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
          .header { background: linear-gradient(135deg, #065f46, #047857); padding: 40px 30px; text-align: center; color: #ffffff; }
          .header h1 { margin: 0; font-size: 26px; font-weight: 700; letter-spacing: -0.5px; }
          .header p { margin: 10px 0 0 0; opacity: 0.9; font-size: 16px; }
          .content { padding: 40px 30px; line-height: 1.6; }
          .content h2 { color: #065f46; font-size: 18px; margin-top: 0; border-bottom: 2px solid #f0fdf4; padding-bottom: 10px; }
          .details-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          .details-table td { padding: 12px 8px; border-bottom: 1px solid #f3f4f6; font-size: 14px; vertical-align: top; }
          .details-table td.label { font-weight: bold; color: #4b5563; width: 35%; }
          .details-table td.value { color: #1f2937; }
          .badge { display: inline-block; background-color: #ecfdf5; color: #047857; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 600; }
          .next-steps { background-color: #f0fdf4; border-left: 4px solid #10b981; padding: 20px; border-radius: 8px; margin: 25px 0; }
          .next-steps h3 { margin: 0 0 8px 0; font-size: 15px; color: #065f46; }
          .next-steps p { margin: 0; font-size: 14px; color: #047857; }
          .footer { background-color: #f9fafb; padding: 25px 30px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #f3f4f6; }
          .footer a { color: #047857; text-decoration: none; font-weight: 500; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Heli Smart Massage Chair</h1>
            <p>Thank you for your booking request</p>
          </div>
          <div class="content">
            <h2>Booking Submitted Successfully!</h2>
            <p>Hi <strong>${data.fullName}</strong>,</p>
            <p>We have successfully received your booking request. Below is a summary of the details you submitted:</p>
            
            <table class="details-table">
              <tr>
                <td class="label">Full Name</td>
                <td class="value">${data.fullName}</td>
              </tr>
              <tr>
                <td class="label">Company Name</td>
                <td class="value">${data.companyName}</td>
              </tr>
              <tr>
                <td class="label">Work Email</td>
                <td class="value">${data.email}</td>
              </tr>
              <tr>
                <td class="label">Phone Number</td>
                <td class="value">${data.phone}</td>
              </tr>
              <tr>
                <td class="label">Employee Count</td>
                <td class="value"><span class="badge">${data.employeeCount}</span></td>
              </tr>
              <tr>
                <td class="label">Preferred Date</td>
                <td class="value">${new Date(data.preferredDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</td>
              </tr>
              <tr>
                <td class="label">Event Location</td>
                <td class="value">${data.location}</td>
              </tr>
              ${data.details ? `
              <tr>
                <td class="label">Additional Details</td>
                <td class="value">${data.details.replace(/\n/g, '<br>')}</td>
              </tr>
              ` : ''}
            </table>

            <div class="next-steps">
              <h3>What happens next?</h3>
              <p>Our wellness coordinator will review your details and contact you to confirm within <strong>2 business hours</strong>.</p>
            </div>

            <p>If you need to make any changes to these details, please reply directly to this email.</p>
            
            <p style="margin-top: 30px; border-top: 1px dashed #e5e7eb; padding-top: 15px; font-size: 14px; color: #4b5563;">
            For more information, please visit our website: <a href="${siteUrl}" style="color: #047857; text-decoration: underline; font-weight: bold;">Heli</a>
            </p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Heli Smart Massage Chair. All rights reserved.</p>
            <p>Chi tiết tại: <a href="${siteUrl}" style="color: #047857; text-decoration: underline; font-weight: bold;">Heli Smart Chair</a></p>
            <p style="margin-top: 8px; font-size: 13px; color: #4b5563;">
              Email: <a href="mailto:Heli%20%3Csupport@helicorp.vn%3E" style="color: #047857; text-decoration: underline; font-weight: 600;">support@helicorp.vn</a>
            </p>
          </div>
        </div>
      </body>
    </html>
  `;

  // 2. HTML Template gửi cho ADMIN (Admin Alert)
  const adminHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>New Quote Request</title>
        <style>
          body { font-family: sans-serif; color: #333; line-height: 1.5; padding: 20px; background-color: #f9fafb; }
          .box { max-width: 600px; margin: 0 auto; background: #fff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 30px; }
          h2 { color: #b91c1c; font-size: 20px; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px; margin-top: 0; }
          .field { margin-bottom: 15px; }
          .label { font-weight: bold; color: #4b5563; font-size: 13px; text-transform: uppercase; }
          .val { margin-top: 4px; font-size: 15px; color: #111827; background-color: #f3f4f6; padding: 8px 12px; border-radius: 6px; }
        </style>
      </head>
      <body>
        <div class="box">
          <h2>🚨 New Quote Booking Request</h2>
          <p>A new corporate quote request has been submitted on the website. Here are the details:</p>
          
          <div class="field">
            <div class="label">Full Name</div>
            <div class="val">${data.fullName}</div>
          </div>
          <div class="field">
            <div class="label">Company Name</div>
            <div class="val">${data.companyName}</div>
          </div>
          <div class="field">
            <div class="label">Email Address</div>
            <div class="val">${data.email}</div>
          </div>
          <div class="field">
            <div class="label">Phone Number</div>
            <div class="val">${data.phone}</div>
          </div>
          <div class="field">
            <div class="label">Employee Count</div>
            <div class="val">${data.employeeCount}</div>
          </div>
          <div class="field">
            <div class="label">Preferred Date</div>
            <div class="val">${data.preferredDate}</div>
          </div>
          <div class="field">
            <div class="label">Location</div>
            <div class="val">${data.location}</div>
          </div>
          ${data.details ? `
          <div class="field">
            <div class="label">Additional Details</div>
            <div class="val">${data.details.replace(/\n/g, '<br>')}</div>
          </div>
          ` : ''}
        </div>
      </body>
    </html>
  `;

  // Gửi cho Khách hàng
  await transporter.sendMail({
    from: `"${fromName}" <${fromEmail}>`,
    to: data.email,
    subject: 'We have received your Quote Request | Heli Smart Massage Chair',
    html: customerHtml,
  });

  // Gửi cho Admin
  await transporter.sendMail({
    from: `"${fromName} System" <${fromEmail}>`,
    to: adminEmail,
    subject: `🚨 [New Quote Request] ${data.fullName} - ${data.companyName}`,
    html: adminHtml,
  });
}

/**
 * Gửi email thông báo cho ADMIN và xác nhận gửi thành công cho KHÁCH HÀNG khi có tin nhắn liên hệ (Contact Us) mới.
 */
export async function sendContactEmail(data: ContactEmailData): Promise<void> {
  const transporter = getTransporter();
  if (!transporter) {
    console.warn('[Email Utility] SMTP_USER or SMTP_PASS is missing. Skipping contact emails.');
    return;
  }

  const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;
  const fromName = process.env.SMTP_FROM_NAME || 'Heli Smart Massage Chair Team';
  const fromEmail = process.env.SMTP_USER;
  const siteUrl = getSiteUrl();

  // 1. HTML Template gửi cho KHÁCH HÀNG (Customer Confirmation)
  const customerHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Message Received</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7f6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 30px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
          .header { background: linear-gradient(135deg, #065f46, #047857); padding: 40px 30px; text-align: center; color: #ffffff; }
          .header h1 { margin: 0; font-size: 26px; font-weight: 700; letter-spacing: -0.5px; }
          .header p { margin: 10px 0 0 0; opacity: 0.9; font-size: 16px; }
          .content { padding: 40px 30px; line-height: 1.6; }
          .content h2 { color: #065f46; font-size: 18px; margin-top: 0; border-bottom: 2px solid #f0fdf4; padding-bottom: 10px; }
          .message-box { background-color: #f9fafb; border-left: 4px solid #10b981; padding: 15px; border-radius: 6px; font-size: 14px; color: #374151; white-space: pre-wrap; margin: 20px 0; }
          .next-steps { background-color: #f0fdf4; border-left: 4px solid #10b981; padding: 20px; border-radius: 8px; margin: 25px 0; }
          .next-steps h3 { margin: 0 0 8px 0; font-size: 15px; color: #065f46; }
          .next-steps p { margin: 0; font-size: 14px; color: #047857; }
          .footer { background-color: #f9fafb; padding: 25px 30px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #f3f4f6; }
          .footer a { color: #047857; text-decoration: none; font-weight: 500; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Heli Smart Massage Chair</h1>
            <p>We have received your message</p>
          </div>
          <div class="content">
            <h2>Thank you for contacting us!</h2>
            <p>Hi <strong>${data.fullName}</strong>,</p>
            <p>This is to confirm that we have successfully received the message you sent through our contact form. Here is a copy of your message:</p>
            
            <div class="message-box">${data.message}</div>

            <div class="next-steps">
              <h3>What's next?</h3>
              <p>Our team will review your inquiry and get back to you within <strong>1 business day</strong>.</p>
            </div>

            <p>If you have any other questions, please feel free to reply directly to this email.</p>
            
            <p style="margin-top: 30px; border-top: 1px dashed #e5e7eb; padding-top: 15px; font-size: 14px; color: #4b5563;">
            For more information, please visit our website:  <a href="${siteUrl}" style="color: #047857; text-decoration: underline; font-weight: bold;">Heli</a>
            </p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Heli Smart Massage Chair. All rights reserved.</p>
            <p>Chi tiết tại: <a href="${siteUrl}" style="color: #047857; text-decoration: underline; font-weight: bold;">Heli Smart Chair</a></p>
            <p style="margin-top: 8px; font-size: 13px; color: #4b5563;">
              Email: <a href="mailto:Heli%20%3Csupport@helicorp.vn%3E" style="color: #047857; text-decoration: underline; font-weight: 600;">support@helicorp.vn</a>
            </p>
          </div>
        </div>
      </body>
    </html>
  `;

  // 2. HTML Template gửi cho ADMIN (Admin Alert)
  const adminHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>New Contact Message</title>
        <style>
          body { font-family: sans-serif; color: #333; line-height: 1.5; padding: 20px; background-color: #f9fafb; }
          .box { max-width: 600px; margin: 0 auto; background: #fff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 30px; }
          h2 { color: #2563eb; font-size: 20px; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px; margin-top: 0; }
          .field { margin-bottom: 15px; }
          .label { font-weight: bold; color: #4b5563; font-size: 13px; text-transform: uppercase; }
          .val { margin-top: 4px; font-size: 15px; color: #111827; background-color: #f3f4f6; padding: 8px 12px; border-radius: 6px; }
          .message-box { background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 15px; border-radius: 4px; font-size: 14px; color: #1e3a8a; white-space: pre-wrap; }
        </style>
      </head>
      <body>
        <div class="box">
          <h2>✉️ New Message from Contact Form</h2>
          <p>A visitor has sent a message through the contact form on your website:</p>
          
          <div class="field">
            <div class="label">Full Name</div>
            <div class="val">${data.fullName}</div>
          </div>
          <div class="field">
            <div class="label">Email Address</div>
            <div class="val">${data.email}</div>
          </div>
          <div class="field">
            <div class="label">Message</div>
            <div class="message-box">${data.message}</div>
          </div>
        </div>
      </body>
    </html>
  `;

  // Gửi cho Khách hàng
  await transporter.sendMail({
    from: `"${fromName}" <${fromEmail}>`,
    to: data.email,
    subject: 'We have received your message | Heli Smart Massage Chair',
    html: customerHtml,
  });

  // Gửi cho Admin
  await transporter.sendMail({
    from: `"${fromName} System" <${fromEmail}>`,
    to: adminEmail,
    subject: `✉️ [New Message] ${data.fullName} - Heli Smart Massage Chair`,
    html: adminHtml,
  });
}

/**
 * Gửi email xác nhận đăng ký bản tin (Newsletter) thành công.
 */
export async function sendNewsletterConfirmationEmail(email: string): Promise<void> {
  const transporter = getTransporter();
  if (!transporter) {
    console.warn('[Email Utility] SMTP_USER or SMTP_PASS is missing. Skipping newsletter confirmation email.');
    return;
  }

  const fromName = process.env.SMTP_FROM_NAME || 'Heli Smart Massage Chair Team';
  const fromEmail = process.env.SMTP_USER;

  const siteUrl = getSiteUrl();
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Đăng ký bản tin thành công</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7f6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 30px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
          .header { background: linear-gradient(135deg, #065f46, #047857); padding: 40px 30px; text-align: center; color: #ffffff; }
          .header h1 { margin: 0; font-size: 24px; font-weight: 700; }
          .content { padding: 40px 30px; line-height: 1.6; font-size: 15px; }
          .footer { background-color: #f9fafb; padding: 25px 30px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #f3f4f6; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Heli Smart Massage Chair</h1>
          </div>
          <div class="content">
            <p>Chào bạn,</p>
            <p>Chúng tôi đã nhận được thông tin gmail của bạn. Chúng tôi sẽ thông báo cho bạn những tin tức mới nhất của Heli. Heli xin cảm ơn!</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Heli Smart Massage Chair. All rights reserved.</p>
            <p>Chi tiết tại: <a href="${siteUrl}" style="color: #047857; text-decoration: underline; font-weight: bold;">Heli Smart Chair</a></p>
          </div>
        </div>
      </body>
    </html>
  `;

  await transporter.sendMail({
    from: `"${fromName}" <${fromEmail}>`,
    to: email,
    subject: 'Xác nhận đăng ký nhận bản tin thành công | Heli Smart Massage Chair',
    html: htmlContent,
  });
}
