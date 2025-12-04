import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface MarketplaceEmailRequest {
  email: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Marketplace confirmation email function called");
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email }: MarketplaceEmailRequest = await req.json();
    
    console.log(`Sending marketplace confirmation to: ${email}`);

    if (!email || !email.includes('@')) {
      console.error("Invalid email provided:", email);
      return new Response(
        JSON.stringify({ error: "Invalid email address" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const emailResponse = await resend.emails.send({
      from: "Momster <onboarding@resend.dev>",
      to: [email],
      subject: "🌸 Καλωσήρθες στη λίστα αναμονής του Momster Marketplace!",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #FFF5F7; margin: 0; padding: 20px; }
            .container { max-width: 500px; margin: 0 auto; background: white; border-radius: 24px; padding: 32px; box-shadow: 0 4px 20px rgba(233, 180, 195, 0.3); }
            .header { text-align: center; margin-bottom: 24px; }
            .title { color: #E9B4C3; font-size: 28px; margin: 0; font-family: 'Pacifico', cursive; }
            .content { color: #5A4A52; line-height: 1.8; }
            .highlight { background: linear-gradient(135deg, #FFF5F7 0%, #FCE8EE 100%); padding: 20px; border-radius: 16px; margin: 20px 0; text-align: center; }
            .footer { text-align: center; margin-top: 24px; color: #9A8A92; font-size: 12px; }
            .emoji { font-size: 48px; margin-bottom: 16px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="emoji">🌸</div>
              <h1 class="title">Momster Marketplace</h1>
            </div>
            
            <div class="content">
              <p>Γεια σου, αγαπημένη μαμά! 💕</p>
              
              <p>Η εγγραφή σου στη λίστα αναμονής του <strong>Momster Marketplace</strong> ολοκληρώθηκε με επιτυχία!</p>
              
              <div class="highlight">
                <p style="margin: 0; font-size: 16px;">
                  ✨ Θα είσαι από τις πρώτες που θα μάθουν<br/>
                  όταν ανοίξει ο πιο γλυκός μαμαδο-χώρος<br/>
                  αγοραπωλησίας & ανταλλαγών! ✨
                </p>
              </div>
              
              <p>Ετοιμαζόμαστε να φέρουμε κοντά μαμάδες που θέλουν να δώσουν δεύτερη ζωή σε αγαπημένα αντικείμενα 🧸</p>
              
              <p style="text-align: center; font-style: italic; color: #E9B4C3;">
                Μαζί, οι μαμάδες ακμάζουμε! 🌷
              </p>
            </div>
            
            <div class="footer">
              <p>© ${new Date().getFullYear()} Momster - Together, moms thrive!</p>
              <p>Αυτό το email στάλθηκε γιατί εγγράφηκες στη λίστα αναμονής του Marketplace.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({ success: true, data: emailResponse }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error sending marketplace confirmation:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
