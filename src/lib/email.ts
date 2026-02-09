import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || "587"),
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

// Common CSS styles for all emails
const commonStyles = `
    body { 
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
        line-height: 1.6; 
        color: #333; 
        margin: 0;
        padding: 0;
        background-color: #f5f8fa;
    }
    .container { 
        max-width: 600px; 
        margin: 0 auto; 
        background: white;
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
    }
    .header { 
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
        color: white; 
        padding: 40px 30px; 
        text-align: center; 
        position: relative;
    }
    .header::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: url('https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=600&q=80') center/cover;
        opacity: 0.1;
    }
    .header-content {
        position: relative;
        z-index: 2;
    }
    .camp-title {
        font-size: 28px;
        font-weight: 700;
        margin-bottom: 10px;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
    }
    .camp-subtitle {
        font-size: 16px;
        opacity: 0.9;
        font-weight: 300;
    }
    .content { 
        background: white; 
        padding: 40px 30px; 
    }
    .content-section {
        margin-bottom: 25px;
    }
    .highlight-box {
        background: linear-gradient(135deg, #fdfcfb 0%, #f5f7fa 100%);
        border-left: 4px solid #667eea;
        padding: 20px;
        border-radius: 8px;
        margin: 20px 0;
    }
    .info-item {
        display: flex;
        align-items: center;
        margin-bottom: 12px;
        padding: 12px 15px;
        background: #f8f9fa;
        border-radius: 8px;
        border: 1px solid #e9ecef;
    }
    .info-icon {
        margin-right: 12px;
        color: #667eea;
        font-size: 18px;
    }
    .button { 
        display: inline-block; 
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
        color: white; 
        padding: 14px 35px; 
        text-decoration: none; 
        border-radius: 30px; 
        margin: 20px 0; 
        font-weight: 600;
        font-size: 16px;
        text-align: center;
        border: none;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
    }
    .button:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
    }
    .whatsapp-button {
        background: linear-gradient(135deg, #25D366 0%, #128C7E 100%);
        box-shadow: 0 4px 15px rgba(37, 211, 102, 0.3);
    }
    .whatsapp-button:hover {
        box-shadow: 0 6px 20px rgba(37, 211, 102, 0.4);
    }
    .footer { 
        text-align: center; 
        padding: 25px 30px;
        background: linear-gradient(135deg, #2c3e50 0%, #1a2530 100%);
        color: rgba(255,255,255,0.8);
        font-size: 14px;
        line-height: 1.5;
    }
    .footer a {
        color: #667eea;
        text-decoration: none;
    }
    .logo {
        font-size: 24px;
        font-weight: 700;
        color: white;
        margin-bottom: 10px;
        letter-spacing: 1px;
    }
    .registration-code {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 15px;
        border-radius: 10px;
        text-align: center;
        margin: 25px 0;
        font-family: 'Courier New', monospace;
        font-size: 24px;
        font-weight: bold;
        letter-spacing: 2px;
    }
    .qr-code {
        text-align: center;
        margin: 20px 0;
        padding: 15px;
        background: #f8f9fa;
        border-radius: 10px;
        border: 2px dashed #dee2e6;
    }
    .countdown {
        display: flex;
        justify-content: center;
        gap: 15px;
        margin: 30px 0;
    }
    .countdown-item {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 15px;
        border-radius: 10px;
        min-width: 70px;
        text-align: center;
    }
    .countdown-number {
        font-size: 28px;
        font-weight: 700;
        display: block;
    }
    .countdown-label {
        font-size: 12px;
        opacity: 0.9;
        text-transform: uppercase;
        letter-spacing: 1px;
    }
    @media (max-width: 600px) {
        .container {
            margin: 10px;
            border-radius: 12px;
        }
        .header {
            padding: 30px 20px;
        }
        .content {
            padding: 30px 20px;
        }
        .countdown {
            flex-wrap: wrap;
            gap: 10px;
        }
    }
`;

// In your email.ts file, update the CAMP_INFO object:

const CAMP_INFO = {
    name: "The Intimacy Camp 2026",
    subtitle: "The Jacob Generation",
    bibleVerse: "Psalms 24:6",
    location: "Ago Iwoye, Ogun State, Nigeria",
    theme: "The Jacob Generation - Rising to Seek God's Face",
    date: "April 5-7, 2026",
    whatsappGroup: "https://chat.whatsapp.com/LSHPc8r3Ara96rzBBJsYhl",
    contactEmail: "contact@intimacycamp.org",
    contactPhone: "+234 XXX XXX XXXX",
    venue: "Ago Iwoye Camp Ground",
    address: "Along Ijebu-Ibadan Expressway, Ago Iwoye, Ogun State",
    description: "A divine mobilization for those who will be bearing the torch of revival in the coming move of God.",
    conveners: "The Mighty Men of David"
};

// Update the subject line in sendConfirmationEmail:
export async function sendConfirmationEmail(
    to: string,
    name: string,
    registrationCode: string,
    confirmationToken: string,
    type: "participant" | "volunteer" = "participant"
): Promise<void> {
    const confirmUrl = `${process.env.NEXT_PUBLIC_APP_URL}/${type === "volunteer" ? "volunteer/" : ""}confirm?token=${confirmationToken}`;

    const subject = type === "volunteer"
        ? `🎖️ Volunteer Application Received - The Intimacy Camp 2026`
        : `✅ Registration Successful - The Intimacy Camp 2026`;

    // Update HTML content to match your new design
    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${subject}</title>
            <style>${commonStyles}</style>
        </head>
        <body>
            <div class="container">
                <div class="header" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%);">
                    <div class="header-content">
                        <div class="logo" style="color: #fff; font-size: 28px; font-weight: 800; letter-spacing: 2px;">
                            THE INTIMACY CAMP
                        </div>
                        <div class="camp-title" style="font-size: 32px;">${CAMP_INFO.name}</div>
                        <div class="camp-subtitle" style="font-size: 24px; font-weight: 700; color: #d1fae5;">
                            ${CAMP_INFO.subtitle}
                        </div>
                        <div class="camp-subtitle" style="font-size: 18px; margin-top: 10px;">
                            ${CAMP_INFO.bibleVerse}
                        </div>
                        <div class="camp-subtitle">
                            ${CAMP_INFO.date} • ${CAMP_INFO.location}
                        </div>
                    </div>
                </div>
                
                <div class="content">
                    <div class="content-section">
                        <h2 style="color: #10b981; margin-bottom: 25px; font-size: 28px;">
                            🎉 Registration Successful, ${name}!
                        </h2>
                        <p style="font-size: 16px; line-height: 1.8;">
                            We're thrilled that you've joined <strong>The Jacob Generation</strong> for 
                            ${CAMP_INFO.name}! ${type === "volunteer"
            ? 'Your volunteer application has been received and we appreciate your heart to serve.'
            : 'Your registration has been successfully processed.'}
                        </p>
                        
                        <div style="background: #f0fdf4; border: 2px solid #10b981; border-radius: 12px; padding: 20px; margin: 25px 0;">
                            <h3 style="color: #065f46; margin-top: 0; text-align: center;">
                                ✨ A Generation That Seeks His Face
                            </h3>
                            <p style="text-align: center; font-style: italic; color: #047857;">
                                "This is the generation of them that seek him, that seek thy face, O Jacob. Selah."
                                <br><span style="font-size: 14px;">- Psalms 24:6</span>
                            </p>
                        </div>
                        
                        <div class="highlight-box">
                            <h3 style="margin-top: 0; color: #065f46;">📋 Registration Details</h3>
                            <div class="info-item">
                                <span class="info-icon">👤</span>
                                <strong>Name:</strong> ${name}
                            </div>
                            <div class="info-item">
                                <span class="info-icon">📧</span>
                                <strong>Email:</strong> ${to}
                            </div>
                            <div class="info-item">
                                <span class="info-icon">🎫</span>
                                <strong>Registration Type:</strong> ${type === "volunteer" ? 'Volunteer' : 'Participant'}
                            </div>
                            <div class="info-item">
                                <span class="info-icon">📅</span>
                                <strong>Event Date:</strong> ${CAMP_INFO.date}
                            </div>
                        </div>
                        
                        <div class="registration-code" style="background: linear-gradient(135deg, #065f46 0%, #10b981 100%);">
                            <div style="font-size: 14px; margin-bottom: 5px;">YOUR REGISTRATION CODE</div>
                            ${registrationCode}
                            <div style="font-size: 12px; margin-top: 10px; opacity: 0.9;">
                                Present this code at registration desk
                            </div>
                        </div>
                        
                        
                        
                        <div class="content-section">
                            <h3 style="color: #065f46;">📱 Join Our WhatsApp Group</h3>
                            <p>Stay updated with all camp announcements, connect with fellow participants, and receive important updates:</p>
                            <div style="text-align: center; margin: 25px 0;">
                                <a href="${CAMP_INFO.whatsappGroup}" class="button whatsapp-button" target="_blank">
                                    📲 JOIN WHATSAPP GROUP
                                </a>
                            </div>
                        </div>
                        
                        <div class="content-section">
                            <h3 style="color: #065f46;">📍 Event Details</h3>
                            <div class="info-item">
                                <span class="info-icon">🏕️</span>
                                <strong>Venue:</strong> ${CAMP_INFO.venue}
                            </div>
                            <div class="info-item">
                                <span class="info-icon">📍</span>
                                <strong>Address:</strong> ${CAMP_INFO.address}
                            </div>
                            <div class="info-item">
                                <span class="info-icon">📅</span>
                                <strong>Date:</strong> ${CAMP_INFO.date}
                            </div>
                            <div class="info-item">
                                <span class="info-icon">🙏</span>
                                <strong>Convened by:</strong> ${CAMP_INFO.conveners}
                            </div>
                        </div>
                        
                        <div style="background: #f0fdf4; padding: 20px; border-radius: 10px; margin: 25px 0; border-left: 4px solid #10b981;">
                            <h4 style="color: #065f46; margin-top: 0;">🎯 What To Expect:</h4>
                            <ul style="margin: 10px 0; padding-left: 20px;">
                                <li>Powerful worship encounters</li>
                                <li>Prophetic teaching sessions</li>
                                <li>Heartfelt prayer gatherings</li>
                                <li>Destiny-defining moments</li>
                                <li>Fellowship with like-minded believers</li>
                            </ul>
                        </div>
                        
                        <p style="font-size: 16px; line-height: 1.8;">
                            <strong>We're praying for you as you prepare for this divine encounter!</strong><br><br>
                            This April, a Jacob Generation is rising—a generation that seeks the face of God, not just the work of His hands.
                        </p>
                        
                        <p style="margin-top: 30px; text-align: center;">
                            <strong>In His Service,</strong><br>
                            <span style="color: #10b981; font-weight: 700;">The Intimacy Camp 2026 Team</span><br>
                            ${CAMP_INFO.conveners}
                        </p>
                    </div>
                </div>
                
                <div class="footer" style="background: linear-gradient(135deg, #1f2937 0%, #111827 100%);">
                    <p style="margin: 0 0 10px 0; font-size: 18px; color: #10b981;">
                        <strong>${CAMP_INFO.name}</strong>
                    </p>
                    <p style="margin: 0 0 5px 0; color: #d1fae5;">
                        ${CAMP_INFO.subtitle}
                    </p>
                    <p style="margin: 10px 0; font-size: 12px; opacity: 0.7; color: rgba(255,255,255,0.8);">
                        ${CAMP_INFO.date} • ${CAMP_INFO.location}<br>
                        <a href="mailto:${CAMP_INFO.contactEmail}" style="color: #10b981;">${CAMP_INFO.contactEmail}</a> • ${CAMP_INFO.contactPhone}
                    </p>
                    <p style="margin: 15px 0 0 0; font-size: 12px; opacity: 0.6; font-style: italic;">
                        "This is the generation of them that seek him, that seek thy face, O Jacob. Selah." - Psalms 24:6
                    </p>
                </div>
            </div>
        </body>
        </html>
    `;

    try {
        await transporter.sendMail({
            from: `"The Intimacy Camp 2026" <${process.env.EMAIL_FROM}>`,
            to,
            subject,
            html,
            headers: {
                'X-Priority': '1',
                'X-MSMail-Priority': 'High',
                'Importance': 'high'
            }
        });
        console.log(`✅ Registration confirmation email sent to ${to}`);
    } catch (error) {
        console.error("Email sending error:", error);
        throw new Error("Failed to send confirmation email");
    }
}

/**
 * Send welcome email after confirmation
 */
export async function sendWelcomeEmail(
    to: string,
    name: string,
    registrationCode: string,
    type: "participant" | "volunteer" = "participant"
): Promise<void> {
    const subject = type === "volunteer"
        ? `🎖️ Welcome to the Intimacy Camp Volunteer Team!`
        : `🌟 Welcome to Intimacy Camp 2026!`;

    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${subject}</title>
            <style>${commonStyles}</style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <div class="header-content">
                        <div class="logo">INTIMACY CAMP</div>
                        <div class="camp-title">WELCOME ABOARD!</div>
                        <div class="camp-subtitle">${CAMP_INFO.name} • ${CAMP_INFO.date}</div>
                    </div>
                </div>
                
                <div class="content">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h1 style="color: #667eea; font-size: 36px; margin-bottom: 10px;">🎉</h1>
                        <h2 style="color: #667eea; margin-bottom: 20px;">Welcome ${name}!</h2>
                        <p style="font-size: 18px; color: #2c3e50;">
                            ${type === "volunteer"
            ? 'Your volunteer application has been confirmed! We\'re grateful for your heart to serve.'
            : 'Your registration is now complete! Get ready for an unforgettable encounter with God.'}
                        </p>
                    </div>
                    
                    <div class="registration-code">
                        <div style="font-size: 14px; margin-bottom: 5px;">YOUR REGISTRATION CODE</div>
                        ${registrationCode}
                    </div>
                    
                    <div class="highlight-box">
                        <h3 style="margin-top: 0; color: #764ba2;">📋 Next Steps</h3>
                        <p>Here's what you need to do next:</p>
                        <ol style="margin: 15px 0; padding-left: 20px;">
                            <li><strong>Join our WhatsApp group</strong> for real-time updates</li>
                            <li><strong>Save your registration code</strong> - you'll need it at check-in</li>
                            <li><strong>Prepare your heart</strong> through prayer and meditation</li>
                            ${type === "volunteer" ? '<li><strong>Check your email</strong> for volunteer orientation details</li>' : ''}
                            <li><strong>Invite a friend</strong> to join this transformative experience</li>
                        </ol>
                    </div>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${CAMP_INFO.whatsappGroup}" class="button whatsapp-button">
                            📲 JOIN WHATSAPP UPDATES
                        </a>
                    </div>
                    
                    <div class="countdown">
                        <div class="countdown-item">
                            <span class="countdown-number" id="days">00</span>
                            <span class="countdown-label">Days</span>
                        </div>
                        <div class="countdown-item">
                            <span class="countdown-number" id="hours">00</span>
                            <span class="countdown-label">Hours</span>
                        </div>
                        <div class="countdown-item">
                            <span class="countdown-number" id="minutes">00</span>
                            <span class="countdown-label">Minutes</span>
                        </div>
                        <div class="countdown-item">
                            <span class="countdown-number" id="seconds">00</span>
                            <span class="countdown-label">Seconds</span>
                        </div>
                    </div>
                    
                    <div class="content-section">
                        <h3 style="color: #764ba2;">📅 Important Dates</h3>
                        <div class="info-item">
                            <span class="info-icon">⏰</span>
                            <div>
                                <strong>Camp Check-in:</strong> February 13, 2026 • 8:00 AM - 10:00 AM
                            </div>
                        </div>
                        <div class="info-item">
                            <span class="info-icon">🙏</span>
                            <div>
                                <strong>Opening Session:</strong> February 13, 2026 • 10:30 AM
                            </div>
                        </div>
                        <div class="info-item">
                            <span class="info-icon">🎉</span>
                            <div>
                                <strong>Closing & Commissioning:</strong> February 16, 2026 • 3:00 PM
                            </div>
                        </div>
                    </div>
                    
                    <div class="content-section">
                        <h3 style="color: #764ba2;">📍 Getting to the Venue</h3>
                        <p><strong>${CAMP_INFO.venue}</strong><br>
                        ${CAMP_INFO.address}</p>
                        <p style="font-size: 14px; color: #666; margin-top: 10px;">
                            <strong>Transport Tips:</strong><br>
                            • From Lagos: Take a bus to Ijebu-Ode, then taxi to Ago Iwoye<br>
                            • From Ibadan: Direct buses available to Ago Iwoye<br>
                            • Look for "Intimacy Camp" directional signs
                        </p>
                    </div>
                    
                    <p style="text-align: center; font-style: italic; color: #667eea; margin-top: 30px;">
                        "As the deer pants for streams of water, so my soul pants for you, my God." - Psalm 42:1
                    </p>
                    
                    <p style="margin-top: 40px; text-align: center;">
                        We're praying and preparing for an amazing time in God's presence!<br><br>
                        <strong>With great anticipation,</strong><br>
                        The Intimacy Camp 2026 Team
                    </p>
                </div>
                
                <div class="footer">
                    <p style="margin: 0 0 10px 0;">
                        <strong>${CAMP_INFO.name}</strong><br>
                        ${CAMP_INFO.theme}
                    </p>
                    <p style="margin: 10px 0; font-size: 12px; opacity: 0.7;">
                        Need help? Contact us:<br>
                        📧 <a href="mailto:${CAMP_INFO.contactEmail}">${CAMP_INFO.contactEmail}</a><br>
                        📱 ${CAMP_INFO.contactPhone}
                    </p>
                </div>
            </div>
            
            <script>
                // Countdown timer script
                const campDate = new Date("February 13, 2026 08:00:00").getTime();
                
                function updateCountdown() {
                    const now = new Date().getTime();
                    const distance = campDate - now;
                    
                    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
                    
                    document.getElementById("days").innerHTML = days.toString().padStart(2, '0');
                    document.getElementById("hours").innerHTML = hours.toString().padStart(2, '0');
                    document.getElementById("minutes").innerHTML = minutes.toString().padStart(2, '0');
                    document.getElementById("seconds").innerHTML = seconds.toString().padStart(2, '0');
                    
                    if (distance < 0) {
                        clearInterval(countdownInterval);
                        document.querySelector(".countdown").innerHTML = "<div style='padding: 20px; background: #2ecc71; color: white; border-radius: 10px;'>🎉 The Camp Has Begun! 🎉</div>";
                    }
                }
                
                updateCountdown();
                const countdownInterval = setInterval(updateCountdown, 1000);
            </script>
        </body>
        </html>
    `;

    try {
        await transporter.sendMail({
            from: `"Intimacy Camp 2026" <${process.env.EMAIL_FROM}>`,
            to,
            subject,
            html,
        });
        console.log(`✅ Welcome email sent to ${to}`);
    } catch (error) {
        console.error("Welcome email error:", error);
    }
}

/**
 * Send reminder email one day before the camp
 */
export async function sendDayBeforeReminder(
    to: string,
    name: string,
    registrationCode: string,
    type: "participant" | "volunteer" = "participant"
): Promise<void> {
    const subject = `⏰ Tomorrow is the Day! - ${CAMP_INFO.name} Reminder`;

    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${subject}</title>
            <style>${commonStyles}</style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <div class="header-content">
                        <div class="logo">INTIMACY CAMP</div>
                        <div class="camp-title">TOMORROW IS HERE!</div>
                        <div class="camp-subtitle">Final Preparations for ${CAMP_INFO.name}</div>
                    </div>
                </div>
                
                <div class="content">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h1 style="color: #667eea; font-size: 42px; margin-bottom: 10px;">⏰</h1>
                        <h2 style="color: #667eea; margin-bottom: 15px;">One Day to Go, ${name}!</h2>
                        <p style="font-size: 18px; color: #2c3e50; font-weight: 600;">
                            We can't wait to see you tomorrow at ${CAMP_INFO.name}!
                        </p>
                    </div>
                    
                    <div class="registration-code">
                        <div style="font-size: 14px; margin-bottom: 5px;">DON'T FORGET YOUR CODE</div>
                        ${registrationCode}
                    </div>
                    
                    <div class="highlight-box">
                        <h3 style="margin-top: 0; color: #764ba2;">🎒 FINAL CHECKLIST</h3>
                        <ul style="margin: 15px 0; padding-left: 20px;">
                            <li><strong>✅ Print or save this email</strong> with your registration code</li>
                            <li><strong>✅ Pack essentials:</strong> Bible, notebook, comfortable clothing, toiletries</li>
                            <li><strong>✅ Bring bedding/sleeping bag</strong> (if staying overnight)</li>
                            <li><strong>✅ Prepare your heart</strong> - spend time in prayer today</li>
                            <li><strong>✅ Charge your phone</strong> and bring a power bank</li>
                            <li><strong>✅ Set your alarm</strong> for early departure</li>
                        </ul>
                    </div>
                    
                    <div class="content-section">
                        <h3 style="color: #764ba2;">📅 TOMORROW'S SCHEDULE</h3>
                        <div class="info-item">
                            <span class="info-icon">🕗</span>
                            <div>
                                <strong>8:00 AM - 10:00 AM:</strong> Registration & Check-in
                            </div>
                        </div>
                        <div class="info-item">
                            <span class="info-icon">🙏</span>
                            <div>
                                <strong>10:30 AM:</strong> Opening Session & Welcome
                            </div>
                        </div>
                        <div class="info-item">
                            <span class="info-icon">🍽️</span>
                            <div>
                                <strong>12:30 PM:</strong> Lunch Break
                            </div>
                        </div>
                        <div class="info-item">
                            <span class="info-icon">💒</span>
                            <div>
                                <strong>2:00 PM - 6:00 PM:</strong> Afternoon Sessions
                            </div>
                        </div>
                        <div class="info-item">
                            <span class="info-icon">🔥</span>
                            <div>
                                <strong>7:00 PM:</strong> Evening Worship & Encounter
                            </div>
                        </div>
                    </div>
                    
                    <div class="content-section">
                        <h3 style="color: #764ba2;">📍 VENUE REMINDER</h3>
                        <p><strong>${CAMP_INFO.venue}</strong><br>
                        ${CAMP_INFO.address}</p>
                        
                        <div style="background: #e8f4fc; padding: 15px; border-radius: 8px; margin-top: 15px;">
                            <h4 style="margin-top: 0; color: #2980b9;">🚗 PARKING INFORMATION</h4>
                            <ul style="margin: 10px 0; padding-left: 20px;">
                                <li>Ample parking available on site</li>
                                <li>Security personnel will direct you</li>
                                <li>Look for "Intimacy Camp Parking" signs</li>
                                <li>Park at your own responsibility</li>
                            </ul>
                        </div>
                    </div>
                    
                    <div class="content-section">
                        <h3 style="color: #764ba2;">📱 URGENT UPDATES</h3>
                        <p>For last-minute changes or emergency announcements, please join our WhatsApp group:</p>
                        <div style="text-align: center; margin: 20px 0;">
                            <a href="${CAMP_INFO.whatsappGroup}" class="button whatsapp-button">
                                🔔 JOIN EMERGENCY UPDATES
                            </a>
                        </div>
                    </div>
                    
                    ${type === "volunteer" ? `
                    <div class="highlight-box" style="background: #fff3cd; border-left-color: #ffc107;">
                        <h3 style="margin-top: 0; color: #856404;">🎖️ VOLUNTEER NOTES</h3>
                        <ul style="margin: 10px 0; padding-left: 20px;">
                            <li><strong>Arrival Time:</strong> Please arrive by 7:00 AM</li>
                            <li><strong>Check-in:</strong> Report to Volunteer Coordinator</li>
                            <li><strong>Attire:</strong> Wear comfortable clothes and shoes</li>
                            <li><strong>Meeting:</strong> Briefing at 7:30 AM sharp</li>
                        </ul>
                    </div>
                    ` : ''}
                    
                    <div style="text-align: center; margin: 30px 0; padding: 20px; background: linear-gradient(135deg, #fdfcfb 0%, #e3f2fd 100%); border-radius: 10px;">
                        <h3 style="color: #2c3e50; margin-bottom: 15px;">🙏 PRAYER FOCUS FOR TODAY</h3>
                        <p style="font-style: italic; color: #555;">
                            "Lord, prepare my heart for what You want to do in me during this camp. 
                            Open my spiritual eyes and ears. Make me receptive to Your voice and 
                            sensitive to Your presence. Amen."
                        </p>
                    </div>
                    
                    <p style="text-align: center; font-weight: 600; color: #667eea; margin-top: 30px;">
                        Travel safely! We're praying for your journey and anticipating great things!<br><br>
                        See you tomorrow!<br>
                        <strong>The ${CAMP_INFO.name} Team</strong>
                    </p>
                </div>
                
                <div class="footer">
                    <p style="margin: 0 0 10px 0;">
                        <strong>${CAMP_INFO.name}</strong><br>
                        ${CAMP_INFO.date}
                    </p>
                    <p style="margin: 10px 0; font-size: 12px; opacity: 0.7;">
                        Emergency Contact: ${CAMP_INFO.contactPhone}<br>
                        "For where two or three gather in my name, there am I with them." - Matthew 18:20
                    </p>
                </div>
            </div>
        </body>
        </html>
    `;

    try {
        await transporter.sendMail({
            from: `"Intimacy Camp 2026" <${process.env.EMAIL_FROM}>`,
            to,
            subject,
            html,
            headers: {
                'X-Priority': '1',
                'Importance': 'high'
            }
        });
        console.log(`✅ Day-before reminder sent to ${to}`);
    } catch (error) {
        console.error("Reminder email error:", error);
    }
}

/**
 * Send reminder email on the day of the camp
 */
export async function sendDayOfReminder(
    to: string,
    name: string,
    registrationCode: string,
    type: "participant" | "volunteer" = "participant"
): Promise<void> {
    const subject = `🎉 Today is the Day! - ${CAMP_INFO.name} Has Begun!`;

    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${subject}</title>
            <style>${commonStyles}</style>
        </head>
        <body>
            <div class="container">
                <div class="header" style="background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);">
                    <div class="header-content">
                        <div class="logo">INTIMACY CAMP</div>
                        <div class="camp-title">IT'S CAMP DAY! 🎉</div>
                        <div class="camp-subtitle">${CAMP_INFO.date} • ${CAMP_INFO.location}</div>
                    </div>
                </div>
                
                <div class="content">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h1 style="color: #27ae60; font-size: 48px; margin-bottom: 10px;">🎊</h1>
                        <h2 style="color: #27ae60; margin-bottom: 15px;">Good Morning ${name}!</h2>
                        <p style="font-size: 20px; color: #2c3e50; font-weight: 700;">
                            Today marks the beginning of ${CAMP_INFO.name}!
                        </p>
                        <p style="font-size: 16px; color: #555; margin-top: 10px;">
                            We're praying for you as you make your way to us!
                        </p>
                    </div>
                    
                    <div class="registration-code" style="background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);">
                        <div style="font-size: 14px; margin-bottom: 5px;">REGISTRATION CODE</div>
                        ${registrationCode}
                        <div style="font-size: 12px; margin-top: 10px; opacity: 0.9;">
                            Show this at check-in for fast registration
                        </div>
                    </div>
                    
                    <div class="content-section" style="text-align: center;">
                        <div style="display: inline-block; padding: 15px 25px; background: #e8f6f3; border-radius: 10px; margin: 15px 0;">
                            <span style="font-size: 18px; color: #27ae60; font-weight: 600;">🕗 TODAY'S START TIME</span><br>
                            <span style="font-size: 24px; color: #2c3e50; font-weight: 700;">8:00 AM - 10:00 AM</span><br>
                            <span style="color: #666;">Registration & Check-in</span>
                        </div>
                    </div>
                    
                    <div class="highlight-box">
                        <h3 style="margin-top: 0; color: #27ae60;">🚨 URGENT ANNOUNCEMENTS</h3>
                        <div class="info-item" style="background: #fff8e1;">
                            <span class="info-icon">⚠️</span>
                            <div>
                                <strong>TRAFFIC ALERT:</strong> Expect heavier traffic on Ijebu-Ibadan Expressway
                            </div>
                        </div>
                        <div class="info-item" style="background: #e8f4fc;">
                            <span class="info-icon">🌦️</span>
                            <div>
                                <strong>WEATHER:</strong> Partly cloudy, 28°C. Bring light jacket for evening
                            </div>
                        </div>
                        <div class="info-item" style="background: #f0f4ff;">
                            <span class="info-icon">🍽️</span>
                            <div>
                                <strong>MEALS:</strong> Lunch provided. Special dietary needs? Inform at check-in
                            </div>
                        </div>
                    </div>
                    
                    <div class="content-section">
                        <h3 style="color: #27ae60;">📍 FINAL DIRECTIONS</h3>
                        <p><strong>${CAMP_INFO.venue}</strong><br>
                        ${CAMP_INFO.address}</p>
                        
                        <div style="margin-top: 15px; padding: 15px; background: #f9f9f9; border-radius: 8px; border-left: 4px solid #27ae60;">
                            <h4 style="margin-top: 0; color: #2c3e50;">🎯 LANDMARKS TO LOOK FOR:</h4>
                            <ul style="margin: 10px 0; padding-left: 20px;">
                                <li>Large "INTIMACY CAMP 2026" banner at entrance</li>
                                <li>Red and white directional signs along the road</li>
                                <li>Security personnel in yellow vests</li>
                                <li>Parking attendants will guide you</li>
                            </ul>
                        </div>
                    </div>
                    
                    ${type === "volunteer" ? `
                    <div class="highlight-box" style="background: #e8f4fc; border-left-color: #3498db;">
                        <h3 style="margin-top: 0; color: #2980b9;">🎖️ VOLUNTEERS - IMPORTANT</h3>
                        <ul style="margin: 10px 0; padding-left: 20px;">
                            <li><strong>ARRIVAL:</strong> Report by 7:00 AM (if not already there)</li>
                            <li><strong>UNIFORM:</strong> Collect your volunteer shirt at check-in</li>
                            <li><strong>MEETING:</strong> Mandatory briefing at 7:30 AM</li>
                            <li><strong>CONTACT:</strong> Volunteer Coordinator: ${CAMP_INFO.contactPhone}</li>
                        </ul>
                    </div>
                    ` : ''}
                    
                    <div class="content-section">
                        <h3 style="color: #27ae60;">📱 LIVE UPDATES</h3>
                        <p>For real-time updates, last-minute changes, and live announcements:</p>
                        <div style="text-align: center; margin: 25px 0;">
                            <a href="${CAMP_INFO.whatsappGroup}" class="button whatsapp-button" style="font-size: 18px; padding: 16px 40px;">
                                📲 JOIN LIVE UPDATES
                            </a>
                        </div>
                    </div>
                    
                    <div style="text-align: center; margin: 40px 0; padding: 25px; background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%); border-radius: 15px; color: white;">
                        <h3 style="margin-top: 0; font-size: 24px;">🙏 PRAYER FOR TODAY</h3>
                        <p style="font-size: 18px; font-style: italic; margin: 15px 0;">
                            "Heavenly Father, as we gather today, meet with us powerfully. 
                            Speak to our hearts, transform our lives, and draw us into deeper intimacy with You. 
                            Let this camp be a turning point in our spiritual journeys. Amen."
                        </p>
                        <p style="font-size: 16px; margin-top: 20px;">
                            "For I know the plans I have for you," declares the Lord,<br>
                            "plans to prosper you and not to harm you,<br>
                            plans to give you hope and a future." - Jeremiah 29:11
                        </p>
                    </div>
                    
                    <p style="text-align: center; font-size: 18px; font-weight: 700; color: #27ae60; margin-top: 30px;">
                        We are expectant for what God will do today!<br>
                        Travel safely and see you soon!<br><br>
                        With great excitement,<br>
                        <strong>The ${CAMP_INFO.name} Team</strong>
                    </p>
                </div>
                
                <div class="footer">
                    <p style="margin: 0 0 10px 0; font-size: 16px;">
                        <strong>${CAMP_INFO.name} IS HERE!</strong>
                    </p>
                    <p style="margin: 10px 0; font-size: 12px; opacity: 0.7;">
                        Emergency: ${CAMP_INFO.contactPhone}<br>
                        "This is the day the Lord has made; let us rejoice and be glad in it." - Psalm 118:24
                    </p>
                </div>
            </div>
        </body>
        </html>
    `;

    try {
        await transporter.sendMail({
            from: `"Intimacy Camp 2026" <${process.env.EMAIL_FROM}>`,
            to,
            subject,
            html,
            headers: {
                'X-Priority': '1',
                'Importance': 'high'
            }
        });
        console.log(`✅ Day-of reminder sent to ${to}`);
    } catch (error) {
        console.error("Day-of reminder error:", error);
    }
}

/**
 * Send thank you email after the camp
 */
export async function sendThankYouEmail(
    to: string,
    name: string,
    type: "participant" | "volunteer" = "participant"
): Promise<void> {
    const subject = `❤️ Thank You for Being Part of Intimacy Camp 2026!`;

    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${subject}</title>
            <style>${commonStyles}</style>
        </head>
        <body>
            <div class="container">
                <div class="header" style="background: linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%);">
                    <div class="header-content">
                        <div class="logo">INTIMACY CAMP</div>
                        <div class="camp-title">THANK YOU! ❤️</div>
                        <div class="camp-subtitle">${CAMP_INFO.name} • ${CAMP_INFO.date}</div>
                    </div>
                </div>
                
                <div class="content">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h1 style="color: #9b59b6; font-size: 48px; margin-bottom: 10px;">🙏</h1>
                        <h2 style="color: #9b59b6; margin-bottom: 15px;">Dear ${name},</h2>
                        <p style="font-size: 20px; color: #2c3e50; font-weight: 700;">
                            Thank you for being part of ${CAMP_INFO.name}!
                        </p>
                        <p style="font-size: 16px; color: #555; margin-top: 10px;">
                            We trust you had a life-changing experience in God's presence.
                        </p>
                    </div>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <div style="display: inline-block; padding: 20px 30px; background: linear-gradient(135deg, #fdfcfb 0%, #f9ebff 100%); border-radius: 15px; border: 2px dashed #9b59b6;">
                            <span style="font-size: 24px; color: #9b59b6; font-weight: 700;">🎉 CAMP COMPLETED!</span><br>
                            <span style="color: #666;">February 13-16, 2026</span>
                        </div>
                    </div>
                    
                    <div class="highlight-box">
                        <h3 style="margin-top: 0; color: #9b59b6;">🌟 WHAT'S NEXT?</h3>
                        <p>Your journey doesn't end here! Here's how to keep the fire burning:</p>
                        <ol style="margin: 15px 0; padding-left: 20px;">
                            <li><strong>Daily Devotion:</strong> Maintain your quiet time with God</li>
                            <li><strong>Community:</strong> Stay connected with your camp friends</li>
                            <li><strong>Apply:</strong> Implement what God spoke to you about</li>
                            <li><strong>Share:</strong> Testify of God's goodness in your life</li>
                            <li><strong>Pray:</strong> Continue in fervent prayer</li>
                        </ol>
                    </div>
                    
                    ${type === "volunteer" ? `
                    <div class="highlight-box" style="background: #e8f4fc; border-left-color: #3498db;">
                        <h3 style="margin-top: 0; color: #2980b9;">🎖️ SPECIAL THANKS TO VOLUNTEERS</h3>
                        <p>Dear ${name}, your service was invaluable! Because of volunteers like you:</p>
                        <ul style="margin: 10px 0; padding-left: 20px;">
                            <li>Sessions ran smoothly</li>
                            <li>Participants felt welcomed and cared for</li>
                            <li>Logistics were handled efficiently</li>
                            <li>God's work was accomplished</li>
                        </ul>
                        <p style="margin-top: 15px; font-weight: 600;">
                            "For even the Son of Man did not come to be served, but to serve..." - Mark 10:45
                        </p>
                    </div>
                    ` : ''}
                    
                    <div class="content-section">
                        <h3 style="color: #9b59b6;">📸 CAMP MEMORIES</h3>
                        <p>Photos and videos from the camp will be available soon! We'll notify you when they're ready.</p>
                        
                        <div style="text-align: center; margin: 25px 0;">
                            <div style="display: inline-block; padding: 15px 25px; background: #f0f0f0; border-radius: 10px;">
                                <span style="color: #9b59b6; font-weight: 600;">📍 Stay connected for updates:</span><br>
                                <a href="${CAMP_INFO.whatsappGroup}" style="color: #25D366; text-decoration: none; font-weight: 600;">
                                    📱 WhatsApp Group
                                </a>
                            </div>
                        </div>
                    </div>
                    
                    <div class="content-section">
                        <h3 style="color: #9b59b6;">📝 SHARE YOUR TESTIMONY</h3>
                        <p>We'd love to hear how God worked in your life during the camp! Share your testimony with us:</p>
                        <div style="text-align: center; margin: 20px 0;">
                            <a href="mailto:testimonies@intimacycamp.org" class="button" style="background: linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%);">
                                ✍️ SHARE YOUR STORY
                            </a>
                        </div>
                    </div>
                    
                    <div style="text-align: center; margin: 40px 0; padding: 25px; background: linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%); border-radius: 15px; color: white;">
                        <h3 style="margin-top: 0; font-size: 24px;">🙏 FINAL BLESSING</h3>
                        <p style="font-size: 18px; font-style: italic; margin: 15px 0;">
                            "May the Lord bless you and keep you;<br>
                            may the Lord make his face shine on you and be gracious to you;<br>
                            may the Lord turn his face toward you and give you peace."<br>
                            <span style="font-size: 14px;">- Numbers 6:24-26</span>
                        </p>
                    </div>
                    
                    <div style="border-top: 2px solid #e0e0e0; padding-top: 30px; margin-top: 30px;">
                        <h3 style="color: #9b59b6; text-align: center;">📅 SAVE THE DATE</h3>
                        <p style="text-align: center; font-size: 18px; font-weight: 700; color: #2c3e50;">
                            Intimacy Camp 2027<br>
                            <span style="font-size: 14px; font-weight: normal; color: #666;">(Dates to be announced)</span>
                        </p>
                    </div>
                    
                    <p style="text-align: center; margin-top: 40px; font-size: 16px; line-height: 1.8;">
                        Thank you for allowing us to be part of your spiritual journey.<br>
                        Keep pressing into God's presence and walking in intimacy with Him.<br><br>
                        
                        <strong>Until we meet again,</strong><br>
                        <span style="font-size: 18px; color: #9b59b6; font-weight: 700;">
                            The Intimacy Camp 2026 Team
                        </span>
                    </p>
                </div>
                
                <div class="footer">
                    <p style="margin: 0 0 10px 0; font-size: 16px;">
                        <strong>INTIMACY CAMP 2026</strong><br>
                        ${CAMP_INFO.theme}
                    </p>
                    <p style="margin: 10px 0; font-size: 12px; opacity: 0.7;">
                        Stay Connected:<br>
                        📧 <a href="mailto:${CAMP_INFO.contactEmail}">${CAMP_INFO.contactEmail}</a><br>
                        📱 ${CAMP_INFO.contactPhone}
                    </p>
                    <p style="margin: 15px 0 0 0; font-size: 11px; opacity: 0.6;">
                        "And let us consider how we may spur one another on toward love and good deeds..." - Hebrews 10:24
                    </p>
                </div>
            </div>
        </body>
        </html>
    `;

    try {
        await transporter.sendMail({
            from: `"Intimacy Camp 2026" <${process.env.EMAIL_FROM}>`,
            to,
            subject,
            html,
        });
        console.log(`✅ Thank you email sent to ${to}`);
    } catch (error) {
        console.error("Thank you email error:", error);
    }
}

/**
 * Send survey/feedback email after camp
 */
export async function sendFeedbackEmail(
    to: string,
    name: string
): Promise<void> {
    const subject = `📋 Share Your Experience - Intimacy Camp 2026 Feedback`;

    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${subject}</title>
            <style>${commonStyles}</style>
        </head>
        <body>
            <div class="container">
                <div class="header" style="background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);">
                    <div class="header-content">
                        <div class="logo">INTIMACY CAMP</div>
                        <div class="camp-title">YOUR FEEDBACK MATTERS</div>
                        <div class="camp-subtitle">Help us improve for next time</div>
                    </div>
                </div>
                
                <div class="content">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h2 style="color: #3498db; margin-bottom: 15px;">Hi ${name},</h2>
                        <p style="font-size: 18px; color: #2c3e50;">
                            We hope you're still basking in the afterglow of ${CAMP_INFO.name}!
                        </p>
                    </div>
                    
                    <div class="highlight-box">
                        <h3 style="margin-top: 0; color: #2980b9;">🎯 QUICK 3-MINUTE SURVEY</h3>
                        <p>Your honest feedback helps us:</p>
                        <ul style="margin: 15px 0; padding-left: 20px;">
                            <li>Improve future camps</li>
                            <li>Better serve participants</li>
                            <li>Understand what blessed you most</li>
                            <li>Plan even better experiences</li>
                        </ul>
                    </div>
                    
                    <div style="text-align: center; margin: 40px 0;">
                        <a href="${process.env.NEXT_PUBLIC_APP_URL}/feedback" class="button" style="background: linear-gradient(135deg, #3498db 0%, #2980b9 100%); font-size: 20px; padding: 18px 45px;">
                            📝 TAKE THE SURVEY
                        </a>
                        <p style="margin-top: 15px; color: #666; font-size: 14px;">
                            (Takes only 3-5 minutes to complete)
                        </p>
                    </div>
                    
                    <p style="text-align: center; font-style: italic; color: #3498db; margin: 30px 0;">
                        "As each has received a gift, use it to serve one another, as good stewards of God's varied grace." - 1 Peter 4:10
                    </p>
                    
                    <p style="text-align: center; margin-top: 40px;">
                        Thank you for helping us serve you better!<br><br>
                        <strong>Blessings,</strong><br>
                        The Intimacy Camp Planning Team
                    </p>
                </div>
                
                <div class="footer">
                    <p style="margin: 10px 0; font-size: 12px; opacity: 0.7;">
                        ${CAMP_INFO.name}<br>
                        Your feedback helps set a generation on fire for Jesus
                    </p>
                </div>
            </div>
        </body>
        </html>
    `;

    try {
        await transporter.sendMail({
            from: `"Intimacy Camp 2026" <${process.env.EMAIL_FROM}>`,
            to,
            subject,
            html,
        });
        console.log(`✅ Feedback email sent to ${to}`);
    } catch (error) {
        console.error("Feedback email error:", error);
    }
}
