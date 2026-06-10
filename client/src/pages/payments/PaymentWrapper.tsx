import { useParams } from "react-router-dom";
import PaymentPage from "./PaymentPage";

export default function PaymentWrapper() {
  const { reservationId } =
    useParams<{
      reservationId: string;
    }>();

  if (!reservationId) {
    return <h1>Invalid Reservation</h1>;
  }

  return (
    <PaymentPage
      reservationId={reservationId}
    />
  );
}