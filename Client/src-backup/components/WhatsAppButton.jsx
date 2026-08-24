export default function WhatsAppButton() {

  const number =
    import.meta.env.VITE_WHATSAPP_NUMBER ||
    "256702952694";


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

      target="_blank"

      rel="noreferrer"

      aria-label="Chat with REHEMA on WhatsApp"

    >

      WhatsApp

    </a>

  );
}