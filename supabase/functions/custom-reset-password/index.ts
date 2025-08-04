
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ResetPasswordRequest {
  email: string;
  resetUrl: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, resetUrl }: ResetPasswordRequest = await req.json();
    
    console.log("Enviando correo de recuperación a:", email);
    console.log("URL de recuperación:", resetUrl);

    // Initialize Supabase client for generating reset link
    const supabaseClient = createClient(
      'https://ryfpkossijltgliijani.supabase.co',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    );

    // Generate recovery link using admin API
    const { data, error } = await supabaseClient.auth.admin.generateLink({
      type: 'recovery',
      email: email,
      options: {
        redirectTo: resetUrl
      }
    });

    if (error) {
      console.error("Error generando enlace de recuperación:", error);
      throw error;
    }

    // Use the actual recovery link from Supabase
    const resetLink = data.properties?.action_link || resetUrl;
    
    console.log("Enlace de recuperación generado:", resetLink);

    const emailResponse = await resend.emails.send({
      from: "Instituto Argentino Excelencia <onboarding@resend.dev>",
      to: [email],
      subject: "Recuperación de contraseña - Instituto Argentino Excelencia",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Recupera tu contraseña</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333333;
              max-width: 600px;
              margin: 0 auto;
              padding: 0;
              background-color: #f8fafc;
            }
            .container {
              background-color: white;
              border-radius: 12px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              overflow: hidden;
              margin: 20px;
            }
            .header {
              background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%);
              padding: 40px 30px;
              text-align: center;
              color: white;
            }
            .logo {
              font-size: 28px;
              font-weight: bold;
              margin-bottom: 10px;
              letter-spacing: -0.5px;
            }
            .subtitle {
              font-size: 16px;
              opacity: 0.9;
              margin: 0;
            }
            .content {
              padding: 40px 30px;
              text-align: center;
            }
            .title {
              font-size: 24px;
              font-weight: 600;
              color: #1f2937;
              margin-bottom: 20px;
            }
            .message {
              font-size: 16px;
              color: #6b7280;
              margin-bottom: 30px;
              line-height: 1.6;
            }
            .button-container {
              margin: 30px 0;
            }
            .reset-button {
              display: inline-block;
              background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%);
              color: white;
              text-decoration: none;
              padding: 16px 32px;
              border-radius: 8px;
              font-weight: 600;
              font-size: 16px;
              box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
              transition: all 0.3s ease;
            }
            .reset-button:hover {
              transform: translateY(-2px);
              box-shadow: 0 6px 16px rgba(79, 70, 229, 0.4);
            }
            .security-note {
              background-color: #fef3c7;
              border: 1px solid #f59e0b;
              border-radius: 8px;
              padding: 16px;
              margin: 30px 0;
              font-size: 14px;
              color: #92400e;
            }
            .footer {
              background-color: #f9fafb;
              padding: 30px;
              text-align: center;
              font-size: 12px;
              color: #6b7280;
              border-top: 1px solid #e5e7eb;
            }
            .divider {
              height: 1px;
              background: linear-gradient(to right, transparent, #e5e7eb, transparent);
              margin: 30px 0;
            }
            .contact-info {
              margin-top: 20px;
              font-size: 13px;
              color: #9ca3af;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🧠 Instituto Argentino Excelencia</div>
              <p class="subtitle">Centro de Neurociencias y Desarrollo Profesional</p>
            </div>
            
            <div class="content">
              <h1 class="title">Recuperación de Contraseña</h1>
              <p class="message">
                Hemos recibido una solicitud para restablecer la contraseña de tu cuenta.
                Haz clic en el botón a continuación para crear una nueva contraseña segura.
              </p>
              
              <div class="button-container">
                <a href="${resetLink}" class="reset-button">
                  🔐 Restablecer mi Contraseña
                </a>
              </div>
              
              <div class="security-note">
                <strong>⚠️ Importante:</strong> Este enlace expirará en 1 hora por motivos de seguridad. 
                Si no solicitaste este cambio, puedes ignorar este correo.
              </div>
              
              <div class="divider"></div>
              
              <p style="font-size: 14px; color: #6b7280;">
                ¿Necesitas ayuda? Contáctanos y te asistiremos de inmediato.
              </p>
            </div>
            
            <div class="footer">
              <p><strong>Instituto Argentino Excelencia</strong></p>
              <p>Formación profesional en neurociencias y desarrollo humano</p>
              <div class="contact-info">
                <p>Este es un correo automático, por favor no respondas a este mensaje.</p>
                <p>© 2024 Instituto Argentino Excelencia. Todos los derechos reservados.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Email response:", emailResponse);
    
    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error en función custom-reset-password:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
