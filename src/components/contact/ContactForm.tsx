"use client";
import { useState } from "react";
import { MdOutlineArrowOutward } from "react-icons/md";

/**
 * Optimized ContactForm component with proper form validation
 * and responsive design across all screen sizes
 */
const ContactForm = ({ className }: { className?: string }) => {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({
    type: null,
    message: "",
  });

  // Handle form input changes with a single handler
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Basic validation
    if (!formState.name || !formState.email || !formState.message) {
      setFormStatus({
        type: "error",
        message: "Please fill in all required fields",
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formState.email)) {
      setFormStatus({
        type: "error",
        message: "Please enter a valid email address",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Replace with actual form submission logic
      // For now, just simulate a network request
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setFormStatus({
        type: "success",
        message: "Your message has been sent successfully!",
      });

      // Reset form after successful submission
      setFormState({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      setFormStatus({
        type: "error",
        message: "There was an error sending your message. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex flex-col gap-4 sm:gap-6 mix-blend-difference text-foreground-secondary backdrop-blur-sm bg-background/5 p-4 sm:p-6 md:p-8 rounded-lg ${className}`}
      autoComplete="off"
    >
      {/* Form Title - Only visible on mobile */}
      <h2 className="text-2xl font-bold mb-2 sm:hidden">Contact Us</h2>

      {/* Grid for name and email with better touch targets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div className="relative">
          <label
            htmlFor="name"
            className="absolute -top-2 left-0 text-xs text-foreground-secondary/70"
          >
            Name *
          </label>
          <input
            id="name"
            type="text"
            name="name"
            value={formState.name}
            onChange={handleChange}
            placeholder="John Doe"
            required
            className="w-full mt-2 p-3 border-b-2 border-foreground-secondary/30 focus:border-foreground-secondary 
                     placeholder:text-foreground-secondary/50 outline-none bg-transparent transition-colors
                     text-base sm:text-lg"
            aria-label="Your name"
          />
        </div>
        <div className="relative">
          <label
            htmlFor="email"
            className="absolute -top-2 left-0 text-xs text-foreground-secondary/70"
          >
            Email *
          </label>
          <input
            id="email"
            type="email"
            name="email"
            value={formState.email}
            onChange={handleChange}
            placeholder="john@example.com"
            required
            className="w-full mt-2 p-3 border-b-2 border-foreground-secondary/30 focus:border-foreground-secondary 
                     placeholder:text-foreground-secondary/50 outline-none bg-transparent transition-colors
                     text-base sm:text-lg"
            aria-label="Your email"
          />
        </div>
      </div>

      <div className="relative">
        <label
          htmlFor="subject"
          className="absolute -top-2 left-0 text-xs text-foreground-secondary/70"
        >
          Subject
        </label>
        <input
          id="subject"
          type="text"
          name="subject"
          value={formState.subject}
          onChange={handleChange}
          placeholder="What's this about?"
          className="w-full mt-2 p-3 border-b-2 border-foreground-secondary/30 focus:border-foreground-secondary 
                   placeholder:text-foreground-secondary/50 outline-none bg-transparent transition-colors
                   text-base sm:text-lg"
          aria-label="Subject"
        />
      </div>

      <div className="relative">
        <label
          htmlFor="message"
          className="absolute -top-2 left-0 text-xs text-foreground-secondary/70"
        >
          Message *
        </label>
        <textarea
          id="message"
          name="message"
          value={formState.message}
          onChange={handleChange}
          placeholder="Your message here..."
          required
          rows={5}
          className="w-full mt-2 p-3 border-b-2 border-foreground-secondary/30 focus:border-foreground-secondary 
                   placeholder:text-foreground-secondary/50 outline-none bg-transparent transition-colors
                   resize-none text-base sm:text-lg"
          aria-label="Your message"
        />
      </div>

      {/* Status message with improved visibility */}
      {formStatus.type && (
        <div
          className={`text-sm sm:text-base px-4 py-2 rounded-md ${
            formStatus.type === "error"
              ? "bg-red-500/10 text-red-300 border border-red-500/20"
              : "bg-green-500/10 text-green-300 border border-green-500/20"
          }`}
          role="alert"
        >
          {formStatus.message}
        </div>
      )}

      {/* Submit button with responsive sizing and improved hover states */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="group w-full mt-2 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold 
                 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 
                 flex items-center justify-between
                 disabled:opacity-70 disabled:hover:transform-none
                 focus:outline-none focus:ring-2 focus:ring-foreground-secondary/30 focus:ring-offset-2 focus:ring-offset-transparent
                 rounded-lg py-2"
        aria-label="Submit form"
      >
        <span className="truncate">
          {isSubmitting ? "Sending..." : "Submit"}
        </span>
        <div className="flex items-center justify-center transition-transform group-hover:translate-x-1">
          <MdOutlineArrowOutward className="h-8 w-8 sm:h-10 sm:w-10" />
        </div>
      </button>
    </form>
  );
};

export default ContactForm;
