import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { Resend } from "resend";

dotenv.config();

// ---------- Telegram Notifications ----------
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const TELEGRAM_API_URL = TELEGRAM_BOT_TOKEN ? `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}` : null;

async function sendTelegramMessage(text: string, parseMode: 'HTML' | 'Markdown' = 'HTML'): Promise<boolean> {
  if (!TELEGRAM_API_URL || !TELEGRAM_CHAT_ID) {
    console.warn("⚠️ Telegram bot token or chat ID missing. Skipping notification.");
    return false;
  }
  try {
    const response = await fetch(`${TELEGRAM_API_URL}/sendMessage`, {
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

function escapeHtml(str: string): string {
  if (!str) return '';
  return str.replace(/[&<>]/g, (m) => {
    if (m === '&') return '&amp;';
    if (m === '<') return '&lt;';
    if (m === '>') return '&gt;';
    return m;
  });
}

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
<b>Images count:</b> ${lead.details.images?.length || 0}`;
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
<b>Notes:</b> ${lead.details.notes || '—'}`;
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
<b>Notes:</b> ${lead.details.notes || '—'}`;
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
<b>Notes:</b> ${lead.details.notes || '—'}`;
      break;
    case 'contact':
      detailsHtml = `
<b>📩 CONTACT / SUPPORT</b>
<b>Name:</b> ${escapeHtml(lead.name)}
<b>Phone:</b> ${escapeHtml(lead.phone)}
<b>Email:</b> ${escapeHtml(lead.email)}
<b>Message:</b> ${escapeHtml(lead.details.notes)}`;
      break;
    default:
      detailsHtml = `<b>📋 GENERIC LEAD</b>\n<pre>${JSON.stringify(lead, null, 2)}</pre>`;
  }
  return `<b>🏷️ ${typeLabel}</b>\n<code>ID: ${lead.id}</code>\n${detailsHtml}\n<i>⏱️ ${dateStr}</i>`;
}

// ---------- In‑memory leads (for dashboard) ----------
const IN_MEMORY_LEADS: any[] = [];

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || apiKey === "MY_RESEND_API_KEY" || apiKey.includes("MY_")) return null;
  return new Resend(apiKey);
}

function getAdminEmail() {
  return process.env.ADMIN_EMAIL || "admin@manausedcars.com";
}

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;   // ✅ Use Vercel's assigned port

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

      // Telegram notification (non‑blocking, errors logged but don't break response)
      const typeLabel = type === 'sell' ? '🚀 SELL REQUEST' : '🔎 BUY INQUIRY';
      const telegramText = formatLeadForTelegram(newLead, typeLabel);
      sendTelegramMessage(telegramText, 'HTML').catch(err => console.error("Telegram error:", err));

      // Rest of your email logic (unchanged)...
      const resend = getResendClient();
      const adminEmail = getAdminEmail();
      const subject = `New Car Selling Inquiry - ${vehicleDetails?.brand || ""} ${vehicleDetails?.model || ""}`;
      const imagesHtml = (images && images.length > 0)
        ? images.map((img: string, i: number) => `<div style="margin: 5px; display: inline-block;"><img src="${img}" style="width: 150px; height: 100px; object-fit: cover; border-radius: 4px;" alt="Vehicle View ${i+1}"/></div>`).join('')
        : "<p>No photos uploaded</p>";

      const emailHtml = `...`;  // keep your original email template (same as before)

      if (resend) {
        await resend.emails.send({
          from: 'ManaUsedCars <leads@onboarding.resend.dev>',
          to: adminEmail,
          subject: subject,
          html: emailHtml,
        });
        console.log(`[Resend Email Sent] to ${adminEmail}`);
        return res.json({ success: true, mode: 'production', message: 'Inquiry transmitted!', lead: newLead });
      } else {
        console.log(`[SANDBOX MAIL] ${subject} | ${sellerDetails?.name} | ${vehicleDetails?.brand} ${vehicleDetails?.model}`);
        return res.json({ success: true, mode: 'sandbox', message: 'Lead received (sandbox).', lead: newLead });
      }
    } catch (error: any) {
      console.error("Error processing inquiry lead:", error);
      // Send a clear error response so frontend knows what happened
      res.status(500).json({ success: false, error: error.message || "Internal server error" });
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
      const telegramText = formatLeadForTelegram(newLead, '📞 CONTACT FORM');
      sendTelegramMessage(telegramText, 'HTML').catch(err => console.error("Telegram error:", err));

      // ... email sending (keep your existing code) ...
      const resend = getResendClient();
      const adminEmail = getAdminEmail();
      const subject = `Support Lead: Contact Request from ${name}`;
      const emailHtml = `<div>...</div>`; // use your original template

      if (resend) {
        await resend.emails.send({ from: 'ManaUsedCars Contact <leads@onboarding.resend.dev>', to: adminEmail, subject: subject, html: emailHtml });
        return res.json({ success: true, mode: 'production', message: 'Message sent!' });
      } else {
        console.log(`[SANDBOX CONTACT] ${name} | ${phone} | ${message}`);
        return res.json({ success: true, mode: 'sandbox', message: 'Contact form accepted (sandbox).', lead: newLead });
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
      sendTelegramMessage(telegramText, 'HTML').catch(err => console.error("Telegram error:", err));

      // ... email sending (keep your existing code) ...
      const resend = getResendClient();
      const adminEmail = getAdminEmail();
      const subject = `🔧 Doorstep Servicing Booking - ${brand} ${model} [${serviceType}]`;
      const emailHtml = `<div>...</div>`; // use your original template

      if (resend) {
        await resend.emails.send({ from: 'ManaUsedCars Servicing <leads@onboarding.resend.dev>', to: adminEmail, subject: subject, html: emailHtml });
        return res.json({ success: true, mode: 'production', message: 'Booking confirmed!', lead: newLead });
      } else {
        console.log(`[SANDBOX BOOKING] ${name} | ${brand} ${model} | ${serviceType}`);
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
      sendTelegramMessage(telegramText, 'HTML').catch(err => console.error("Telegram error:", err));

      // ... email sending (keep your existing code) ...
      const resend = getResendClient();
      const adminEmail = getAdminEmail();
      const subject = `💰 Car Finance Application - ${name} [₹${loanAmount} Lakhs]`;
      const emailHtml = `<div>...</div>`; // use your original template

      if (resend) {
        await resend.emails.send({ from: 'ManaUsedCars Finance <leads@onboarding.resend.dev>', to: adminEmail, subject: subject, html: emailHtml });
        return res.json({ success: true, mode: 'production', message: 'Loan request received!', lead: newLead });
      } else {
        console.log(`[SANDBOX FINANCE] ${name} | ₹${loanAmount} Lakhs`);
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
    console.log(`✅ ManaUsedCars server running on port ${PORT} (mode: ${process.env.NODE_ENV || 'development'})`);
  });
}

startServer();
