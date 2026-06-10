import transporter from "../config/mail";

export const sendTicketMail = async (
  email: string,
  ticketPath: string
) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,

    to: email,

    subject: "Movie Ticket",

    text: "Your ticket is attached.",

    attachments: [
      {
        filename: "ticket.pdf",
        path: ticketPath,
      },
    ],
  });
};