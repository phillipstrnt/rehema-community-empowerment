<<<<<<< HEAD
import React from "react";

export default function WhatsAppButton() {

  const number = (import.meta.env.VITE_WHATSAPP_NUMBER || "256702952694")
    .replace(/\D/g, "");


  const message =
    "Hello REHEMA, I would like to know more about your work.";


  return (

    <a

      className="whatsapp"

      href={
        `whatsapp://send?phone=${number}&text=${
          encodeURIComponent(message)
        }`
      }

      aria-label="Chat with REHEMA on WhatsApp"

    >

      WhatsApp

    </a>

  );
}
=======
import React from "react";

export default function WhatsAppButton() {

  const number = (import.meta.env.VITE_WHATSAPP_NUMBER || "256702952694")
    .replace(/\D/g, "");


  const message =
    "Hello REHEMA, I would like to know more about your work.";


  return (

    <a

      className="whatsapp"

      href={
        `https://wa.me/${number}?text=${
          encodeURIComponent(message)
        }`
      }

      aria-label="Chat with REHEMA on WhatsApp"

    >

      WhatsApp

    </a>

  );
}
>>>>>>> d5654c452cbb6c15341a2a7d6601300e472486d0
