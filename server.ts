import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { Resend } from "resend";

dotenv.config();

// ---------- Telegram Notifications ----------
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

/**
 * Send a plain text or HTML message to the configured Telegram chat.
 * Returns true if successful, false otherwise (error logged).
 */
async function sendTelegramMessage(text: string, parseMode: 'HTML' | 'Markdown' = 'HTML'): Promise<boolean> {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.warn("⚠️ Telegram bot token or chat ID missing. Skipping notification.");
    return false;
  }

  try {
    const url = `${TELEGRAM_API_URL}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text,
        parse_mode: parseMode,
        disable_web_page_preview: true,
      }),
    });

    const data = await response.json();
    if (!data.ok) {
      console.error("Telegram API error:", data.description);
      return false;
    }
    console.log("✅ Telegram notification sent.");
    return true;
  } catch (error) {
    console.error("Failed to send Telegram message:", error);
    return false;
  }
}

/**
 * Format a generic lead into an HTML message for Telegram.
 */
function formatLeadForTelegram(lead: any, typeLabel: string): string {
  const dateStr = new Date(lead.timestamp).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  let detailsHtml = '';

  switch (lead.type) {
    case 'sell':
      detailsHtml = `
<b>🚗 SELL INQUIRY</b>
<b>Name:</b> ${escapeHtml(lead.name)}
<b>Phone:</b> ${escapeHtml(lead.phone)}
<b>Email:</b> ${escapeHtml(lead.email)}
<b>City:</b> ${escapeHtml(lead.city)}
<b>Vehicle:</b> ${lead.details.brand} ${lead.details.model} (${lead.details.variant})
<b>Year:</b> ${lead.details.year}
<b>Fuel/Trans:</b> ${lead.details.fuel} / ${lead.details.transmission}
<b>KM:</b> ${lead.details.km.toLocaleString()} km
<b>Expected Price:</b> ₹${lead.details.expectedPrice} Lakh
<b>Condition:</b> ${lead.details.condition}
<b>Notes:</b> ${lead.details.notes || '—'}
<b>Images count:</b> ${lead.details.images?.length || 0}
      `;
      break;

    case 'buy':
      detailsHtml = `
<b>🔍 BUY INQUIRY</b>
<b>Name:</b> ${escapeHtml(lead.name)}
<b>Phone:</b> ${escapeHtml(lead.phone)}
<b>Email:</b> ${escapeHtml(lead.email)}
<b>City:</b> ${escapeHtml(lead.city)}
<b>Target Car:</b> ${lead.details.brand} ${lead.details.model} (${lead.details.year})
<b>Request type:</b> ${lead.details.condition}
<b>Notes:</b> ${lead.details.notes || '—'}
      `;
      break;

    case 'service':
      detailsHtml = `
<b>🔧 DOORSTEP SERVICE BOOKING</b>
<b>Name:</b> ${escapeHtml(lead.name)}
<b>Phone:</b> ${escapeHtml(lead.phone)}
<b>Email:</b> ${escapeHtml(lead.email)}
<b>Vehicle:</b> ${lead.details.brand} ${lead.details.model}
<b>Service:</b> ${lead.details.serviceType}
<b>Slot:</b> ${lead.details.bookingDate} at ${lead.details.bookingTime}
<b>Address:</b> ${escapeHtml(lead.details.address)}
<b>Notes:</b> ${lead.details.notes || '—'}
      `;
      break;

    case 'finance':
      detailsHtml = `
<b>💰 CAR FINANCE APPLICATION</b>
<b>Name:</b> ${escapeHtml(lead.name)}
<b>Phone:</b> ${escapeHtml(lead.phone)}
<b>Email:</b> ${escapeHtml(lead.email)}
<b>City:</b> ${escapeHtml(lead.city)}
<b>Loan Amount:</b> ₹${lead.details.expectedPrice} Lakh
<b>Employment:</b> ${lead.details.condition}
<b>Income Bracket:</b> ${lead.details.variant}
<b>Notes:</b> ${lead.details.notes || '—'}
      `;
      break;

    case 'contact':
      detailsHtml = `
<b>📩 CONTACT / SUPPORT</b>
<b>Name:</b> ${escapeHtml(lead.name)}
<b>Phone:</b> ${escapeHtml(lead.phone)}
<b>Email:</b> ${escapeHtml(lead.email)}
<b>Message:</b> ${escapeHtml(lead.details.notes)}
      `;
      break;

    default:
      detailsHtml = `<b>📋 GENERIC LEAD</b>\n<pre>${JSON.stringify(lead, null, 2)}</pre>`;
  }

  return `
<b>🏷️ ${typeLabel}</b>
<code>ID: ${lead.id}</code>
${detailsHtml}
<i>⏱️ ${dateStr}</i>
  `;
}

// Helper to escape HTML special characters
function escapeHtml(str: string): string {
  if (!str) return '';
  return str.replace(/[&<>]/g, function(m) {
    if (m === '&') return '&amp;';
    if (m === '<') return '&lt;';
    if (m === '>') return '&gt;';
    return m;
  }).replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, function(c) {
    return c;
  });
}

// Global in‑memory leads (for dashboard)
const IN_MEMORY_LEADS: any[] = [];

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || apiKey === "MY_RESEND_API_KEY" || apiKey.includes("MY_")) {
    return null;
  }
  return new Resend(apiKey);
}

function getAdminEmail() {
  return process.env.ADMIN_EMAIL || "admin@manausedcars.com";
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Healthcheck
  app.get("/api/health", (req, res) => {
    res.json({ status: "healthy", timestamp: new Date().toISOString() });
  });

  app.get("/api/leads", (req, res) => {
    res.json({ leads: IN_MEMORY_LEADS });
  });

  // ---------- LEAD: Sell / Buy ----------
  app.post("/api/inquiry", async (req, res) => {
    try {
      const { sellerDetails, vehicleDetails, expectedPrice, condition, additionalNotes, images, type = 'sell' } = req.body;
      const t = new Date().toISOString();

      const newLead = {
        id: `lead_${Math.random().toString(36).substring(2, 9)}`,
        type,
        name: sellerDetails?.name || "Anonymous",
        phone: sellerDetails?.phone || "N/A",
        email: sellerDetails?.email || "N/A",
        city: sellerDetails?.city || "N/A",
        timestamp: t,
        details: {
          brand: vehicleDetails?.brand || "N/A",
          model: vehicleDetails?.model || "N/A",
          variant: vehicleDetails?.variant || "N/A",
          year: vehicleDetails?.year || vehicleDetails?.registrationYear || "N/A",
          fuel: vehicleDetails?.fuel || "N/A",
          transmission: vehicleDetails?.transmission || "N/A",
          km: vehicleDetails?.km || 0,
          expectedPrice: expectedPrice || 0,
          condition: condition || "N/A",
          notes: additionalNotes || "",
          images: images || [],
        }
      };

      IN_MEMORY_LEADS.unshift(newLead);

      // --- Telegram notification (non‑blocking) ---
      const typeLabel = type === 'sell' ? '🚀 SELL REQUEST' : '🔎 BUY INQUIRY';
      const telegramText = formatLeadForTelegram(newLead, typeLabel);
      sendTelegramMessage(telegramText, 'HTML').catch(err => console.error("Telegram async error:", err));

      // --- Resend Email (existing logic) ---
      const resend = getResendClient();
      const adminEmail = getAdminEmail();
      const subject = `New Car Selling Inquiry - ${vehicleDetails?.brand || ""} ${vehicleDetails?.model || ""}`;
      const imagesHtml = (images && images.length > 0)
        ? images.map((img: string, i: number) => `<div style="margin: 5px; display: inline-block;"><img src="${img}" style="width: 150px; height: 100px; object-fit: cover; border-radius: 4px;" alt="Vehicle View ${i+1}"/></div>`).join('')
        : "<p>No photos uploaded</p>";

      const emailHtml = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; padding: 24px; color: #0f172a;">
          <h2 style="color: #2563eb; margin-top: 0;">🚗 New Car Selling Inquiry</h2>
          <p style="color: #64748b; font-size: 14px;">Received on: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
          <hr style="border: 0; border-top: 1px dashed #e2e8f0; margin: 20px 0;"/>
          <h3 style="color: #0f172a; margin-bottom: 8px;">👤 Seller Details</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr><td style="padding: 4px 0; font-weight: bold; width: 120px;">Name:</td><td>${sellerDetails?.name || "N/A"}</td></tr>
            <tr><td style="padding: 4px 0; font-weight: bold;">Phone:</td><td>${sellerDetails?.phone || "N/A"}</td></tr>
            <tr><td style="padding: 4px 0; font-weight: bold;">Email:</td><td>${sellerDetails?.email || "N/A"}</td></tr>
            <tr><td style="padding: 4px 0; font-weight: bold;">City:</td><td>${sellerDetails?.city || "N/A"}</td></tr>
          </table>
          <hr style="border: 0; border-top: 1px dashed #e2e8f0; margin: 20px 0;"/>
          <h3 style="color: #0f172a; margin-bottom: 8px;">🚙 Vehicle Details</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr><td style="padding: 4px 0; font-weight: bold; width: 120px;">Brand/Model:</td><td>${vehicleDetails?.brand || "N/A"} ${vehicleDetails?.model || ""} (${vehicleDetails?.variant || "N/A"})</td></tr>
            <tr><td style="padding: 4px 0; font-weight: bold;">Year:</td><td>${vehicleDetails?.year || vehicleDetails?.registrationYear || "N/A"}</td></tr>
            <tr><td style="padding: 4px 0; font-weight: bold;">Fuel Type:</td><td>${vehicleDetails?.fuel || "N/A"}</td></tr>
            <tr><td style="padding: 4px 0; font-weight: bold;">Transmission:</td><td>${vehicleDetails?.transmission || "N/A"}</td></tr>
            <tr><td style="padding: 4px 0; font-weight: bold;">KM Driven:</td><td>${Number(vehicleDetails?.km).toLocaleString('en-IN')} km</td></tr>
            <tr><td style="padding: 4px 0; font-weight: bold; color: #16a34a;">Expected Price:</td><td style="font-weight: bold; color: #16a34a;">₹ ${expectedPrice} Lakhs</td></tr>
            <tr><td style="padding: 4px 0; font-weight: bold;">Condition:</td><td>${condition || "N/A"}</td></tr>
          </table>
          <hr style="border: 0; border-top: 1px dashed #e2e8f0; margin: 20px 0;"/>
          <h3 style="color: #0f172a; margin-bottom: 8px;">📝 Notes</h3>
          <p style="background-color: #f8fafc; padding: 12px; border-radius: 6px; font-size: 14px; margin: 0; border: 1px solid #f1f5f9;">
            ${additionalNotes || "No specific comments added."}
          </p>
          <hr style="border: 0; border-top: 1px dashed #e2e8f0; margin: 20px 0;"/>
          <h3 style="color: #0f172a; margin-bottom: 8px;">📸 Uploaded Images</h3>
          <div style="margin-top: 10px;">${imagesHtml}</div>
          <div style="margin-top: 30px; font-size: 12px; color: #94a3b8; text-align: center;">
            <p>Sent from ManaUsedCars Lead Capture Engine</p>
          </div>
        </div>
      `;

      if (resend) {
        await resend.emails.send({
          from: 'ManaUsedCars <leads@onboarding.resend.dev>',
          to: adminEmail,
          subject: subject,
          html: emailHtml,
        });
        console.log(`[Resend Email Sent] Successfully sent inquiry to ${adminEmail}`);
        return res.json({ success: true, mode: 'production', message: 'Inquiry successfully transmitted via Resend API!', lead: newLead });
      } else {
        console.log(`[SANDBOX MAIL SIMULATION]\nSubject: ${subject}\nTo: ${adminEmail}\nSender: ${sellerDetails?.name} / ${sellerDetails?.phone}\nCar: ${vehicleDetails?.brand} ${vehicleDetails?.model} | ₹${expectedPrice} Lakhs`);
        return res.json({ success: true, mode: 'sandbox', message: 'Lead received! Sandbox Mode enabled (Email logged to console).', lead: newLead });
      }
    } catch (error: any) {
      console.error("Error processing inquiry lead:", error);
      res.status(500).json({ success: false, error: error.message || "Failed to process lead" });
    }
  });

  // ---------- LEAD: Contact ----------
  app.post("/api/contact", async (req, res) => {
    try {
      const { name, email, phone, message } = req.body;
      const t = new Date().toISOString();

      const newLead = {
        id: `contact_${Math.random().toString(36).substring(2, 9)}`,
        type: 'contact',
        name: name || "Anonymous",
        phone: phone || "N/A",
        email: email || "N/A",
        city: "N/A",
        timestamp: t,
        details: { notes: message || "" }
      };

      IN_MEMORY_LEADS.unshift(newLead);

      // Telegram
      const telegramText = formatLeadForTelegram(newLead, '📞 CONTACT FORM');
      sendTelegramMessage(telegramText, 'HTML').catch(err => console.error("Telegram async error:", err));

      const resend = getResendClient();
      const adminEmail = getAdminEmail();
      const subject = `Support Lead: Contact Request from ${name}`;
      const emailHtml = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; padding: 24px; color: #0f172a;">
          <h2 style="color: #2563eb; margin-top: 0;">📨 Support Lead Request</h2>
          <p style="color: #64748b; font-size: 14px;">Received: ${new Date().toLocaleString()}</p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;"/>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Message:</strong></p>
          <p style="background: #f8fafc; padding: 15px; border-radius: 6px; border: 1px solid #f1f5f9;">${message}</p>
        </div>
      `;

      if (resend) {
        await resend.emails.send({ from: 'ManaUsedCars Contact <leads@onboarding.resend.dev>', to: adminEmail, subject: subject, html: emailHtml });
        return res.json({ success: true, mode: 'production', message: 'Message sent!' });
      } else {
        console.log(`[SANDBOX CONTACT SIMULATION]\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}`);
        return res.json({ success: true, mode: 'sandbox', message: 'Contact form accepted! Sandbox mode simulated.', lead: newLead });
      }
    } catch (error: any) {
      console.error("Error processing contact lead:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // ---------- LEAD: Doorstep Service ----------
  app.post("/api/booking", async (req, res) => {
    try {
      const { name, phone, email, brand, model, serviceType, date, time, address, notes } = req.body;
      const t = new Date().toISOString();

      const newLead = {
        id: `service_${Math.random().toString(36).substring(2, 9)}`,
        type: 'service',
        name: name || "Anonymous",
        phone: phone || "N/A",
        email: email || "N/A",
        city: "N/A",
        timestamp: t,
        details: { brand, model, serviceType, bookingDate: date, bookingTime: time, address, notes }
      };

      IN_MEMORY_LEADS.unshift(newLead);
      const telegramText = formatLeadForTelegram(newLead, '🔧 DOORSTEP SERVICE');
      sendTelegramMessage(telegramText, 'HTML').catch(err => console.error("Telegram async error:", err));

      const resend = getResendClient();
      const adminEmail = getAdminEmail();
      const subject = `🔧 Doorstep Servicing Booking - ${brand} ${model} [${serviceType}]`;
      const emailHtml = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; padding: 24px; color: #0f172a;">
          <h2 style="color: #2563eb; margin-top: 0;">🔧 Doorstep Car Servicing Booking</h2>
          <p style="color: #64748b; font-size: 14px;">Requested: ${new Date().toLocaleString()}</p>
          <hr/>
          <h3>👤 Customer Contact</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Email:</strong> ${email}</p>
          <hr/>
          <h3>🔧 Service Specifications</h3>
          <p><strong>Vehicle:</strong> ${brand} ${model}</p>
          <p><strong>Service Type:</strong> ${serviceType}</p>
          <p><strong>Preferred Slot:</strong> ${date} at ${time}</p>
          <p><strong>Doorstep Address:</strong> ${address}</p>
          <p><strong>Special Instructions:</strong> ${notes || "None"}</p>
        </div>
      `;

      if (resend) {
        await resend.emails.send({ from: 'ManaUsedCars Servicing <leads@onboarding.resend.dev>', to: adminEmail, subject: subject, html: emailHtml });
        return res.json({ success: true, mode: 'production', message: 'Booking confirmed!', lead: newLead });
      } else {
        console.log(`[SANDBOX BOOKING SIMULATION]\nName: ${name}\nVehicle: ${brand} ${model}\nService: ${serviceType}\nSlot: ${date} @ ${time}`);
        return res.json({ success: true, mode: 'sandbox', message: 'Booking received (sandbox).', lead: newLead });
      }
    } catch (error: any) {
      console.error("Error processing service booking:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // ---------- LEAD: Finance ----------
  app.post("/api/finance", async (req, res) => {
    try {
      const { name, phone, email, city, employmentType, monthlyIncome, loanAmount, notes } = req.body;
      const t = new Date().toISOString();

      const newLead = {
        id: `finance_${Math.random().toString(36).substring(2, 9)}`,
        type: 'finance',
        name: name || "Anonymous",
        phone: phone || "N/A",
        email: email || "N/A",
        city: city || "N/A",
        timestamp: t,
        details: {
          expectedPrice: Number(loanAmount) || 0,
          condition: employmentType || "N/A",
          variant: monthlyIncome || "N/A",
          notes: notes || "Car Loan Request"
        }
      };

      IN_MEMORY_LEADS.unshift(newLead);
      const telegramText = formatLeadForTelegram(newLead, '💰 FINANCE APPLICATION');
      sendTelegramMessage(telegramText, 'HTML').catch(err => console.error("Telegram async error:", err));

      const resend = getResendClient();
      const adminEmail = getAdminEmail();
      const subject = `💰 Car Finance Application - ${name} [₹${loanAmount} Lakhs]`;
      const emailHtml = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; padding: 24px; color: #0f172a;">
          <h2 style="color: #2563eb; margin-top: 0;">💰 Car Finance Application</h2>
          <p style="color: #64748b; font-size: 14px;">Requested: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
          <hr/>
          <h3>👤 Applicant Profile</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>City:</strong> ${city}</p>
          <hr/>
          <h3>💵 Loan Requirements</h3>
          <p><strong>Required Loan Amount:</strong> ₹ ${loanAmount} Lakhs</p>
          <p><strong>Employment Status:</strong> ${employmentType}</p>
          <p><strong>Monthly Income Bracket:</strong> ${monthlyIncome}</p>
          <p><strong>Calculated Loan Scheme Indicator:</strong> ${notes || "None"}</p>
        </div>
      `;

      if (resend) {
        await resend.emails.send({ from: 'ManaUsedCars Finance <leads@onboarding.resend.dev>', to: adminEmail, subject: subject, html: emailHtml });
        return res.json({ success: true, mode: 'production', message: 'Loan request received!', lead: newLead });
      } else {
        console.log(`[SANDBOX FINANCE SIMULATION]\nName: ${name}\nAmount: ₹${loanAmount} Lakhs\nEmployment: ${employmentType}`);
        return res.json({ success: true, mode: 'sandbox', message: 'Loan application captured (sandbox).', lead: newLead });
      }
    } catch (error: any) {
      console.error("Error processing finance application:", error);
      res.status(500).json({ success: false, error: error.message || "Failed to process finance lead" });
    }
  });

  // Vite / static serving (unchanged)
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: "spa" });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => { res.sendFile(path.join(distPath, "index.html")); });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`ManaUsedCars running on port ${PORT} (Prod: ${process.env.NODE_ENV === "production"})`);
  });
}

startServer();
