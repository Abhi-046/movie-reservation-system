import { useEffect, useState } from "react";
import axios from "axios";
import { socket } from "../../sockets/socket";
import { useParams, useNavigate } from "react-router-dom";

type Seat = {
  id: string;
  row: string;
  number: number;
};

export default function SeatSelectionPage() {
  const { showtimeId } = useParams();

  const navigate = useNavigate();

  const [availableSeats, setAvailableSeats] = useState<Seat[]>([]);

  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  const [lockedSeats, setLockedSeats] = useState<string[]>([]);

  const [bookedSeats, setBookedSeats] = useState<string[]>([]);

  const fetchSeats = async () => {
    const response = await axios.get(
      `http://localhost:5000/api/reservations/available/${showtimeId}`,
    );

    setAvailableSeats(response.data.availableSeats);
  };

  useEffect(() => {
    if (!showtimeId) return;

    const loadSeats = async () => {
      const response = await axios.get(
        `http://localhost:5000/api/reservations/available/${showtimeId}`,
      );
      setAvailableSeats(response.data.availableSeats);
    };

    loadSeats();

    socket.emit("join-showtime", showtimeId);

    socket.on("seat-locked", (seatIds: string[]) => {
      setLockedSeats((prev) => [...prev, ...seatIds]);
    });

    socket.on("seat-booked", (seatIds: string[]) => {
      setBookedSeats((prev) => [...prev, ...seatIds]);
    });

    socket.on("seat-unlocked", (seatIds: string[]) => {
      setLockedSeats((prev) => prev.filter((seat) => !seatIds.includes(seat)));
    });

    return () => {
      socket.off("seat-locked");
      socket.off("seat-booked");
      socket.off("seat-unlocked");
    };
  }, [showtimeId, fetchSeats]);

  const toggleSeat = (seatId: string) => {
    if (lockedSeats.includes(seatId) || bookedSeats.includes(seatId)) {
      return;
    }

    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((id) => id !== seatId)
        : [...prev, seatId],
    );
  };

  const bookSeats = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:5000/api/reservations",
        {
          showtimeId,
          seatIds: selectedSeats,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const reservationId = response.data.reservation.id;

      navigate(`/payment/${reservationId}`);
    } catch (error) {
      console.log(error);

      alert("Booking Failed");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Seat Selection</h1>

      <div className="grid grid-cols-10 gap-2 mt-6">
        {availableSeats.map((seat) => (
          <button
            key={seat.id}
            onClick={() => toggleSeat(seat.id)}
            className={`
              p-2 border rounded

              ${bookedSeats.includes(seat.id) ? "bg-red-500" : ""}

              ${lockedSeats.includes(seat.id) ? "bg-yellow-500" : ""}

              ${selectedSeats.includes(seat.id) ? "bg-green-500" : ""}
            `}
          >
            {seat.row}
            {seat.number}
          </button>
        ))}
      </div>

      <button
        onClick={bookSeats}
        className="mt-6 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Book Selected Seats
      </button>
    </div>
  );
}
