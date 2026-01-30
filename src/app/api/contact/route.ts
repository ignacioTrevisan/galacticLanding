import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const { nombre, email, mensaje } = await request.json();

    // Validar datos
    if (!nombre || !email || !mensaje) {
      return NextResponse.json(
        { error: "Todos los campos son requeridos" },
        { status: 400 },
      );
    }

    // Log para debugging (remover en producción)
    console.log("Configuración SMTP:", {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      user: process.env.SMTP_USER,
      from: process.env.SMTP_FROM,
      to: process.env.EMAIL_TO,
    });

    // Configurar transporter de nodemailer
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false, // Útil para desarrollo
      },
    });

    // Verificar la conexión
    try {
      await transporter.verify();
      console.log("✅ Conexión SMTP exitosa");
    } catch (verifyError) {
      console.error("❌ Error de verificación SMTP:", verifyError);
      throw new Error("No se pudo conectar al servidor SMTP");
    }

    // Configurar el email
    const mailOptions = {
      from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM}>`,
      to: process.env.EMAIL_TO,
      replyTo: email, // Para responder directamente al usuario
      subject: `Nuevo mensaje de contacto de ${nombre}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f9f9f9;
              border-radius: 10px;
            }
            .header {
              background: linear-gradient(135deg, #8a2be2 0%, #6a0dad 100%);
              color: white;
              padding: 20px;
              border-radius: 10px 10px 0 0;
              text-align: center;
            }
            .content {
              background: white;
              padding: 20px;
              border-radius: 0 0 10px 10px;
            }
            .field {
              margin-bottom: 15px;
            }
            .label {
              font-weight: bold;
              color: #8a2be2;
              display: block;
              margin-bottom: 5px;
            }
            .value {
              padding: 10px;
              background-color: #f5f5f5;
              border-left: 3px solid #8a2be2;
              border-radius: 5px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>🚀 Nuevo Mensaje de Contacto</h2>
            </div>
            <div class="content">
              <div class="field">
                <span class="label">Nombre:</span>
                <div class="value">${nombre}</div>
              </div>
              <div class="field">
                <span class="label">Email:</span>
                <div class="value">${email}</div>
              </div>
              <div class="field">
                <span class="label">Mensaje:</span>
                <div class="value">${mensaje.replace(/\n/g, "<br>")}</div>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Nuevo mensaje de contacto
        
        Nombre: ${nombre}
        Email: ${email}
        Mensaje: ${mensaje}
      `,
    };

    // Enviar el email
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email enviado:", info.messageId);

    return NextResponse.json(
      {
        message: "Email enviado exitosamente",
        messageId: info.messageId,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("❌ Error completo al enviar email:", error);

    return NextResponse.json(
      {
        error: "Error al enviar el email",
        details: error.message || "Error desconocido",
      },
      { status: 500 },
    );
  }
}
