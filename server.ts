import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { Resend } from "resend";

dotenv.config();

// Global in-memory lists of leads to simulate dashboard data & give visibility
const IN_MEMORY_LEADS: any[] = [];

// Lazy load Resend client
function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  // If no api key is specified or it is placeholder, return null to fall back to logs
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

  // Middleware for body parsing
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // API Routes
  
  // Healthcheck
  app.get("/api/health", (req, res) => {
    res.json({ status: "healthy", timestamp: new Date().toISOString() });
  });

  // Fetch created leads (for live preview inspection and validating lead generation)
  app.get("/api/leads", (req, res) => {
    res.json({ leads: IN_MEMORY_LEADS });
  });

  // Lead Generation: Sell My Car or Buy Inquiry
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

      // Add to session store
      IN_MEMORY_LEADS.unshift(newLead);

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
          <div style="margin-top: 10px;">
            ${imagesHtml}
          </div>

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
        // Safe logging in Sandbox/Demo environment
        console.log(`[SANDBOX MAIL SIMULATION]
---------- EMAIL BODY ----------
Subject: ${subject}
To: ${adminEmail}
Sender Name: ${sellerDetails?.name}
Phone: ${sellerDetails?.phone}
City: ${sellerDetails?.city}
Brand/Model: ${vehicleDetails?.brand} ${vehicleDetails?.model}
Expected Price: INR ${expectedPrice} Lakhs`) ;

        return res.json({
          success: true,
          mode: 'sandbox',
          message: 'Lead received! Sandbox Mode enabled (No RESEND_API_KEY set). Email draft logged to system console successfully.',
          lead: newLead
        });
      }
    } catch (error: any) {
      console.error("Error processing inquiry lead:", error);
      res.status(500).json({ success: false, error: error.message || "Failed to process lead" });
    }
  });

  // Contact Page Form API
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
        details: {
          notes: message || ""
        }
      };

      IN_MEMORY_LEADS.unshift(newLead);

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
        await resend.emails.send({
          from: 'ManaUsedCars Contact <leads@onboarding.resend.dev>',
          to: adminEmail,
          subject: subject,
          html: emailHtml,
        });
        return res.json({ success: true, mode: 'production', message: 'Message sent!' });
      } else {
        console.log(`[SANDBOX CONTACT SIMULATION]
Received Contact Form:
Name: ${name}
Email: ${email}
Phone: ${phone}
Message: ${message}`);
        return res.json({
          success: true,
          mode: 'sandbox',
          message: 'Contact form accepted! Sandbox mode simulated successfully (draft printed in log).',
          lead: newLead
        });
      }
    } catch (error: any) {
      console.error("Error processing contact lead:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Doorstep Car Servicing Booking API
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
        details: {
          brand,
          model,
          serviceType,
          bookingDate: date,
          bookingTime: time,
          address,
          notes
        }
      };

      IN_MEMORY_LEADS.unshift(newLead);

      const resend = getResendClient();
      const adminEmail = getAdminEmail();
      const subject = `🔧 Doorstep Servicing Booking - ${brand} ${model} [${serviceType}]`;

      const emailHtml = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; padding: 24px; color: #0f172a;">
          <h2 style="color: #2563eb; margin-top: 0;">🔧 Doorstep Car Servicing Booking</h2>
          <p style="color: #64748b; font-size: 14px;">Requested: ${new Date().toLocaleString()}</p>
          
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;"/>
          
          <h3>👤 Customer Contact</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Email:</strong> ${email}</p>
          
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;"/>
          
          <h3>🔧 Service Specifications</h3>
          <p><strong>Vehicle:</strong> ${brand} ${model}</p>
          <p><strong>Service Type:</strong> ${serviceType}</p>
          <p><strong>Preferred Slot:</strong> ${date} at ${time}</p>
          <p><strong>Doorstep Address:</strong> ${address}</p>
          <p><strong>Special Instructions:</strong> ${notes || "None"}</p>
        </div>
      `;

      if (resend) {
        await resend.emails.send({
          from: 'ManaUsedCars Servicing <leads@onboarding.resend.dev>',
          to: adminEmail,
          subject: subject,
          html: emailHtml,
        });
        return res.json({ success: true, mode: 'production', message: 'Booking confirmed! Notification transmitted to admin.', lead: newLead });
      } else {
        console.log(`[SANDBOX BOOKING SIMULATION]
Doorstep Servicing Request:
Name: ${name}
Phone: ${phone}
Vehicle: ${brand} ${model}
Service: ${serviceType}
Slot: ${date} @ ${time}
Address: ${address}`);
        return res.json({
          success: true,
          mode: 'sandbox',
          message: 'Doorstep booking received successfully! Sandbox Mode enabled.',
          lead: newLead
        });
      }
    } catch (error: any) {
      console.error("Error processing service booking:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Car Loan & Finance Application API
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

      const resend = getResendClient();
      const adminEmail = getAdminEmail();
      const subject = `💰 Car Finance Application - ${name} [₹${loanAmount} Lakhs]`;

      const emailHtml = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; padding: 24px; color: #0f172a;">
          <h2 style="color: #2563eb; margin-top: 0;">💰 Car Finance Application</h2>
          <p style="color: #64748b; font-size: 14px;">Requested: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
          
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;"/>
          
          <h3>👤 Applicant Profile</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>City:</strong> ${city}</p>
          
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;"/>
          
          <h3>💵 Loan Requirements</h3>
          <p><strong>Required Loan Amount:</strong> ₹ ${loanAmount} Lakhs</p>
          <p><strong>Employment Status:</strong> ${employmentType}</p>
          <p><strong>Monthly Income Bracket:</strong> ${monthlyIncome}</p>
          <p><strong>Calculated Loan Scheme Indicator:</strong> ${notes || "None"}</p>
        </div>
      `;

      if (resend) {
        await resend.emails.send({
          from: 'ManaUsedCars Finance <leads@onboarding.resend.dev>',
          to: adminEmail,
          subject: subject,
          html: emailHtml,
        });
        return res.json({ success: true, mode: 'production', message: 'Loan request received! Sent to lender matching network.', lead: newLead });
      } else {
        console.log(`[SANDBOX FINANCE SIMULATION]
Car Finance Application Received:
Name: ${name}
Phone: ${phone}
City: ${city}
Amount: ₹${loanAmount} Lakhs
Employment: ${employmentType}
Income: ${monthlyIncome}`);
        return res.json({
          success: true,
          mode: 'sandbox',
          message: 'Loan application captured! Sandbox mode simulated successfully (draft logged to system terminal).',
          lead: newLead
        });
      }
    } catch (error: any) {
      console.error("Error processing finance application:", error);
      res.status(500).json({ success: false, error: error.message || "Failed to process finance lead" });
    }
  });

  // Support Vite dev pipeline or production compiled static files
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`ManaUsedCars running on port ${PORT} (Prod: ${process.env.NODE_ENV === "production"})`);
  });
}

startServer();
