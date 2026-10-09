const BREVO_API_KEY = process.env.BRAVO_API_KEY
const BREVO_SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL
const BREVO_SENDER_NAME = process.env.BREVO_SENDER_NAME ?? "BookMyVenue"
const CLIENT_URL = process.env.FRONTEND_URL ?? "#"

const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email"

function ensureEmailConfig(): void {
    if (!BREVO_API_KEY || !BREVO_SENDER_EMAIL) {
        throw new Error("BREVO_API_KEY and BREVO_SENDER_EMAIL must be configured")
    }
}

interface SendEmailParams {
    to: string
    subject: string
    html: string
}

async function sendBrevoEmail({ to, subject, html }: SendEmailParams): Promise<void> {
    ensureEmailConfig()

    const response = await fetch(BREVO_API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "api-key": BREVO_API_KEY as string,
        },
        body: JSON.stringify({
            sender: { name: BREVO_SENDER_NAME, email: BREVO_SENDER_EMAIL },
            to: [{ email: to }],
            subject,
            htmlContent: html,
        }),
    })

    if (!response.ok) {
        const errorBody = await response.text()
        console.error("Brevo API error:", response.status, errorBody)
        throw new Error(`Brevo API request failed with status ${response.status}`)
    }
}


function layout(content: string): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <link href="https://fonts.googleapis.com/css2?family=EB+Garamond:wght@500;600;700&family=Manrope:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background-color: #faf7f0; font-family: 'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 40px 20px; color: #52524a; -webkit-font-smoothing: antialiased; }
    .card { background-color: #ffffff; border-radius: 12px; max-width: 540px; margin: 0 auto; border: 1px solid #e8dfc4; padding: 40px 32px; box-shadow: 0 4px 6px -1px rgba(201, 168, 76, 0.08); }
    .brand { font-family: 'EB Garamond', Georgia, 'Times New Roman', serif; font-size: 24px; font-weight: 600; color: #1f2937; margin-bottom: 32px; text-align: center; letter-spacing: 0.5px; }
    .brand span { color: #C9A84C; }
    h1 { font-family: 'EB Garamond', Georgia, 'Times New Roman', serif; font-size: 26px; font-weight: 600; color: #1f2937; margin-bottom: 12px; text-align: center; letter-spacing: 0.3px; }
    p { font-size: 15px; line-height: 1.6; color: #52524a; margin-bottom: 20px; text-align: center; }
    .accent { color: #C9A84C; font-weight: 600; }
    .panel { background-color: #fbf8ef; border: 1px solid #ecdfc0; border-radius: 8px; padding: 24px; margin: 28px 0; text-align: center; }
    .otp-container { text-align: center; margin-bottom: 8px; }
    .otp-box { display: inline-block; width: 42px; height: 48px; line-height: 48px; text-align: center; background-color: #ffffff; border: 1px solid #d9c896; border-radius: 6px; font-family: 'EB Garamond', Georgia, serif; font-size: 24px; font-weight: 700; color: #1f2937; margin: 0 4px; }
    .button { display: inline-block; background-color: #C9A84C; color: #1f2937 !important; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-size: 14px; font-weight: 700; letter-spacing: 0.3px; margin: 12px 0; text-align: center; }
    .muted { font-size: 13px; color: #8b8478; margin: 0; text-align: center; }
    .list { margin: 0; padding: 0; list-style: none; text-align: left; max-width: 400px; margin: 0 auto; }
    .list li { font-size: 14px; line-height: 1.6; color: #52524a; margin-bottom: 10px; padding-left: 18px; position: relative; }
    .list li::before { content: "•"; color: #C9A84C; font-weight: bold; position: absolute; left: 0; top: 0; }
    .footer { text-align: center; font-size: 12px; line-height: 1.5; color: #a39b87; margin-top: 24px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="brand">BookMy<span>Venue</span></div>
    <div class="body">
      ${content}
    </div>
  </div>
  <div class="footer">
    BookMyVenue<br/>
    Discover venues • Compare faster • Book smarter
  </div>
</body>
</html>`
}

function buildOtpBoxes(otp: string): string {
    return otp
        .split("")
        .map((digit) => `<span class="otp-box">${digit}</span>`)
        .join("")
}

function buildOtpHtml(otp: string): string {
    return layout(`
        <h1>Verify your email</h1>
        <p>Use this code to finish setting up your account. It stays active for <span class="accent">10 minutes</span> and should only be used by you.</p>

        <div class="panel">
            <div class="otp-container">${buildOtpBoxes(otp)}</div>
        </div>

        <p>If you did not create a BookMyVenue account, you can safely ignore this email.</p>
        <p class="muted">For support, simply reply to this email and our team will assist you.</p>
    `)
}

function buildWelcomeHtml(fullName: string): string {
    return layout(`
        <h1>Welcome to BookMyVenue, ${fullName}!</h1>
        <p>Your account is officially verified. You can now explore, compare, and shortlist premium venues from one simple dashboard.</p>

        <div class="panel">
            <ul class="list">
                <li>Browse spaces for weddings, meetings, parties, and events.</li>
                <li>Review transparent pricing, amenities, and availability.</li>
                <li>Move from planning to booking with confidence.</li>
            </ul>
        </div>

        <div style="text-align: center;">
            <a href="${CLIENT_URL}" class="button">Browse Venues</a>
        </div>

        <p style="margin-top: 24px;">Need any assistance? Reply directly to this email and we'll gladly help you out.</p>
    `)
}

function buildForgotPasswordHtml(otp: string): string {
    return layout(`
        <h1>Reset your password</h1>
        <p>We received a request to reset your password. Use the code below to proceed. This code will expire in <span class="accent">10 minutes</span>.</p>

        <div class="panel">
            <div class="otp-container">${buildOtpBoxes(otp)}</div>
        </div>

        <p>If you did not request a password reset, you can safely ignore this email. Your security settings remain unchanged.</p>
    `)
}

function buildBookingAcceptedHtml(fullName: string, venueName: string): string {
    return layout(`
        <h1>Your Booking is Approved!</h1>
        <p>Great news, ${fullName}! The venue owner has accepted your booking request for <span class="accent">${venueName}</span>.</p>

        <div class="panel">
            <p>Your slot is currently held for you. To confirm your booking and secure the venue, please complete your payment.</p>
        </div>

        <div style="text-align: center;">
            <a href="${CLIENT_URL}/booking" class="button">Pay Now to Confirm</a>
        </div>

        <p style="margin-top: 24px;">If you have any questions, reply to this email and our team will help you out.</p>
    `)
}
function buildBookingRejectedHtml(
  fullName: string,
  venueName: string,
  reason?: string
): string {
  return layout(`
        <h1>Booking Request Declined</h1>
        <p>
          Hello ${fullName}, unfortunately your booking request for
          <span class="accent">${venueName}</span> could not be approved by the venue owner.
        </p>
        <div class="panel">
            <p>
              This venue is currently unavailable for the selected date or does not meet the owner's requirements.
            </p>
            ${
              reason
                ? `<p style="margin-top:16px;">
                    <strong>Reason:</strong> ${reason}
                  </p>`
                : ""
            }
        </div>
        <p>
          Don't worry — there are many other venues available that may suit your event.
        </p>
        <div style="text-align:center;">
            <a href="${CLIENT_URL}/venues" class="button">
                Browse Other Venues
            </a>
        </div>
        <p style="margin-top:24px;">
          If you believe this was a mistake or need assistance, simply reply to this email and our team will help you.
        </p>
    `)
}

export const sendOtpEmail = async (email: string, otp: string): Promise<void> => {
    try {
        await sendBrevoEmail({
            to: email,
            subject: `${otp} is your BookMyVenue verification code`,
            html: buildOtpHtml(otp),
        })
    } catch (error) {
        console.error("Brevo OTP email error:", error)
        throw new Error("Failed to send OTP email")
    }
}

export const sendWelcomeEmail = async (email: string, fullName: string): Promise<void> => {
    try {
        await sendBrevoEmail({
            to: email,
            subject: `Welcome to BookMyVenue, ${fullName}!`,
            html: buildWelcomeHtml(fullName),
        })
    } catch (error) {
        console.error("Brevo welcome email error:", error)
        throw new Error("Failed to send welcome email")
    }
}

export const sendForgotPasswordEmail = async (email: string, otp: string): Promise<void> => {
    try {
        await sendBrevoEmail({
            to: email,
            subject: "Reset your BookMyVenue password",
            html: buildForgotPasswordHtml(otp),
        })
    } catch (error) {
        console.error("Brevo forgot password email error:", error)
        throw new Error("Failed to send forgot password email")
    }
}

export const sendBookingAcceptedEmail = async (email: string, fullName: string, venueName: string): Promise<void> => {
    try {
        await sendBrevoEmail({
            to: email,
            subject: `Your booking at ${venueName} is approved!`,
            html: buildBookingAcceptedHtml(fullName, venueName),
        })
    } catch (error) {
        console.error("Brevo booking accepted email error:", error)
    }
}

export const sendBookingRejectedEmail = async (email: string, fullName: string, venueName: string, reason?: string): Promise<void> => {
    try {
        await sendBrevoEmail({
            to: email,
            subject: `Your booking at ${venueName} was declined`,
            html: buildBookingRejectedHtml(fullName, venueName, reason),
        })
    } catch (error) {
        console.error("Brevo booking rejected email error:", error)
    }
}
