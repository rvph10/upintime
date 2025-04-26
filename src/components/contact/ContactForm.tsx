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
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    email?: string;
    message?: string;
  }>({});

  // Handle form input changes with a single handler
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear field error when user starts typing
    if (fieldErrors[name as keyof typeof fieldErrors]) {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Reset errors
    setFieldErrors({});
    setFormStatus({
      type: null,
      message: "",
    });

    // Field validation
    let hasErrors = false;
    const errors: {
      name?: string;
      email?: string;
      message?: string;
    } = {};

    if (!formState.name.trim()) {
      errors.name = "Name is required";
      hasErrors = true;
    }

    if (!formState.message.trim()) {
      errors.message = "Message is required";
      hasErrors = true;
    }

    if (!formState.email.trim()) {
      errors.email = "Email is required";
      hasErrors = true;
    } else {
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formState.email)) {
        errors.email = "Please enter a valid email address";
        hasErrors = true;
      }
    }

    if (hasErrors) {
      setFieldErrors(errors);
      return;
    }

    setIsSubmitting(true);

    try {
      // Submit form data to the API
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formState),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error submitting form");
      }

      // Handle rate limiting (too many requests)
      if (response.status === 429) {
        setFormStatus({
          type: "error",
          message: `Too many requests. Please try again in ${data.resetInSeconds} seconds.`,
        });
        return;
      }

      setFormStatus({
        type: "success",
        message: data.message || "Your message has been sent successfully!",
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
        message:
          error instanceof Error
            ? error.message
            : "There was an error sending your message. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex flex-col gap-4 sm:gap-6 mix-blend-difference text-foreground-secondary p-4 ${className}`}
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
            className={`w-full mt-2 p-3 border-b-2 
                      ${fieldErrors.name ? "border-foreground-secondary" : "border-foreground-secondary/30 focus:border-foreground-secondary"} 
                      placeholder:text-foreground-secondary/50 outline-none bg-transparent transition-colors
                      text-base sm:text-lg`}
            aria-label="Your name"
            data-cursor-hover
            data-cursor-type="text"
          />
          {fieldErrors.name && (
            <div className="text-foreground-secondary text-xs mt-1 ml-1">
              {fieldErrors.name}
            </div>
          )}
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
            className={`w-full mt-2 p-3 border-b-2 
                      ${fieldErrors.email ? "border-foreground-secondary" : "border-foreground-secondary/30 focus:border-foreground-secondary"} 
                      placeholder:text-foreground-secondary/50 outline-none bg-transparent transition-colors
                      text-base sm:text-lg`}
            aria-label="Your email"
            data-cursor-hover
            data-cursor-type="text"
          />
          {fieldErrors.email && (
            <div className="text-foreground-secondary text-xs mt-1 ml-1">
              {fieldErrors.email}
            </div>
          )}
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
          data-cursor-hover
          data-cursor-type="text"
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
          className={`w-full mt-2 p-3 border-b-2 
                    ${fieldErrors.message ? "border-foreground-secondary" : "border-foreground-secondary/30 focus:border-foreground-secondary"} 
                    placeholder:text-foreground-secondary/50 outline-none bg-transparent transition-colors
                    resize-none text-base sm:text-lg`}
          aria-label="Your message"
          data-cursor-hover
          data-cursor-type="text"
        />
        {fieldErrors.message && (
          <div className="text-foreground-secondary text-xs mt-1 ml-1">
            {fieldErrors.message}
          </div>
        )}
      </div>

      {/* General error message (for non-field specific errors) */}
      {formStatus.type === "error" && (
        <div
          className={`
            transform transition-all duration-500 ease-out
            flex items-center gap-3
            text-base sm:text-lg
            py-3 text-foreground-secondary
            mix-blend-difference
          `}
          role="alert"
        >
          <div className="flex-1 font-light tracking-wide">
            <span className="inline-block w-4 h-4 mr-3 rounded-full border border-foreground-secondary" />
            {formStatus.message}
          </div>
        </div>
      )}

      {/* Submit button or success message */}
      {formStatus.type === "success" ? (
        <div
          className={`
            group w-full mt-2 py-4
            text-foreground-secondary
            transition-all duration-500 ease-out
            mix-blend-difference
            flex items-center justify-between
          `}
          aria-live="polite"
        >
          <div className="flex-1 font-light tracking-wide text-xl sm:text-2xl md:text-3xl">
            <span className="inline-block w-4 h-4 mr-3 rounded-full bg-foreground-secondary" />
            {formStatus.message}
          </div>
        </div>
      ) : (
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
          data-cursor-hover
          data-cursor-text={isSubmitting ? "Sending..." : "Submit"}
          data-cursor-type="button"
        >
          <span className="truncate">
            {isSubmitting ? "Sending..." : "Submit"}
          </span>
          <div className="flex items-center justify-center transition-transform group-hover:translate-x-1">
            <MdOutlineArrowOutward className="h-8 w-8 sm:h-10 sm:w-10" />
          </div>
        </button>
      )}
    </form>
  );
};

export default ContactForm;
