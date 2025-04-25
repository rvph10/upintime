"use client";
import { MdOutlineArrowOutward } from "react-icons/md";


const ContactForm = ({className}: {className?: string}) => {

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted");
  };

  return (
    <form onSubmit={handleSubmit} className={`flex flex-col gap-4 mix-blend-difference text-foreground-secondary ${className}`}>
      {/* Grid full name and email */}
      <div className="grid grid-cols-2 gap-4 text-foreground-secondary">
        <div className="border-b-2 border-foreground-secondary">
          <input
            type="text"
            placeholder="Name"
            className="w-full p-2 placeholder:text-foreground-secondary outline-none"
          />
        </div>
        <div className="border-b-2 border-foreground-secondary">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 placeholder:text-foreground-secondary outline-none"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="border-b-2 border-foreground-secondary">
            <input type="text" placeholder="Subject" className="w-full p-2 placeholder:text-foreground-secondary outline-none" />
        </div>
      </div>
      <div className="border-b-2 border-foreground-secondary">
        <textarea
          placeholder="Message"
          rows={5}
          className="w-full p-2 h-fit resize-none placeholder:text-foreground-secondary outline-none"
        />
      </div>
      <button
        type="submit"
        className="w-full text-7xl font-bold hover:scale-105 hover:translate-y-[-5px] transition-all duration-300 flex items-center justify-between"
      >
        <p>Submit</p>
        <div className="flex items-center justify-center">
          <MdOutlineArrowOutward className="h-full" />
        </div>
      </button>
    </form>
  );
};

export default ContactForm;
