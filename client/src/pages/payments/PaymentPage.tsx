import axios from "axios";
import { useState } from "react";

type Props = {
  reservationId: string;
};

type RazorpayHandlerResponse = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayHandlerResponse) => void | Promise<void>;
  theme: {
    color: string;
  };
};

type RazorpayConstructor = new (options: RazorpayOptions) => {
  open: () => void;
};

type RazorpayWindow = Window & {
  Razorpay: RazorpayConstructor;
};

export default function PaymentPage({ reservationId }: Props) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    try {
      setLoading(true);

      const orderResponse = await axios.post(
        "http://localhost:5000/api/payments/create-order",
        {
          reservationId,
        },
      );

      const order = orderResponse.data.order;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,

        amount: order.amount,

        currency: order.currency,

        name: "Movie Reservation",

        description: "Movie Ticket Payment",

        order_id: order.id,

        handler: async (response: RazorpayHandlerResponse) => {
          const verifyResponse = await axios.post(
            "http://localhost:5000/api/payments/verify",
            {
              reservationId,

              razorpay_order_id: response.razorpay_order_id,

              razorpay_payment_id: response.razorpay_payment_id,

              razorpay_signature: response.razorpay_signature,
            },
          );

          alert(verifyResponse.data.message);
        },

        theme: {
          color: "#3399cc",
        },
      };

      const razorpay = new (window as unknown as RazorpayWindow).Razorpay(
        options,
      );

      razorpay.open();
    } catch (error) {
      console.log(error);

      alert("Payment Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className="bg-green-600 text-white px-4 py-2 rounded"
    >
      {loading ? "Processing..." : "Pay Now"}
    </button>
  );
}
