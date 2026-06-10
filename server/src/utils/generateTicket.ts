// pdfkit has no bundled TypeScript types in this project. Ignore type errors for this import.
// @ts-ignore
import PDFDocument from "pdfkit";
import fs from "fs";
// qrcode has no bundled TypeScript types in this project. Ignore type errors for this import.
// @ts-ignore
import QRCode from "qrcode";

export const generateTicket = async (
  reservation: any
) => {
  const filePath =
    `tickets/${reservation.id}.pdf`;

  const doc =
    new PDFDocument();

  doc.pipe(
    fs.createWriteStream(filePath)
  );

  const qrData =
    JSON.stringify({
      reservationId:
        reservation.id,
    });

  const qrImage =
    await QRCode.toDataURL(qrData);

  doc.fontSize(24);
  doc.text(
    "Movie Ticket",
    {
      align: "center",
    }
  );

  doc.moveDown();

  doc.text(
    `Reservation ID: ${reservation.id}`
  );

  doc.text(
    `Movie: ${reservation.showtime.movie.title}`
  );

  doc.text(
    `Theatre: ${reservation.showtime.screen.theatre.name}`
  );

  doc.text(
    `Show Time: ${reservation.showtime.startTime}`
  );

  doc.image(
    Buffer.from(
      qrImage.replace(
        /^data:image\/png;base64,/,
        ""
      ),
      "base64"
    ),
    {
      width: 150,
      height: 150,
    }
  );

  doc.end();

  return filePath;
};