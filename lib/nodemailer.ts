import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    ciphers: "TLSv1.2,TLSv1.3",
  },
});

interface ForgotPasswordContext {
  name: string;
  email: string;
  resetPasswordToken: string;
}

export async function sendForgotPasswordMail(
  to: string,
  context: ForgotPasswordContext
) {
  const frontendUrl = process.env.FRONTEND_URL;
  const subject = "Restablecer contraseña";
  const html = `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <h2 style="color: #2c3e50;">Hola ${context.name},</h2>
    <p>Recibimos una solicitud para restablecer tu contraseña en <strong>GymPlanner</strong>.</p>
    <p>Para cambiar tu contraseña, haz clic en el siguiente botón:</p>
    <p style="text-align: center;">
      <a href="${frontendUrl}/reset-password/${encodeURIComponent(
    context.resetPasswordToken
  )}" 
         style="display: inline-block; padding: 12px 24px; background-color: #4CAF50; color: #fff; text-decoration: none; border-radius: 6px; font-weight: bold;">
        Restablecer contraseña
      </a>
    </p>
    <p>Si no solicitaste esto, simplemente ignora este correo.</p>
    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
    <p style="font-size: 12px; color: #999;">GymPlanner &copy; ${new Date().getFullYear()}. Todos los derechos reservados.</p>
  </div>
`;

  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject,
      html,
    });
    return { success: true, message: "Correo enviado correctamente" };
  } catch {
    return {
      success: false,
      message:
        "Hubo un problema enviando el correo. Intenta nuevamente más tarde",
    };
  }
}
