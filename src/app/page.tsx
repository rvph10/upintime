import Link from "next/link";

export default function Home() {
  return (
    <main>
      {/* Hero Section */}
      <section className="min-h-[90vh] flex items-center justify-center">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h1 className="animate-fade-in">
              Transforming Ideas into
              <span className="text-accent block mt-2">Digital Excellence</span>
            </h1>

            <p className="text-xl md:text-2xl opacity-90">
              We craft cutting-edge applications that drive business growth and
              user engagement.
            </p>

            <div className="flex gap-4 justify-center mt-8">
              <Link href="/portfolio" className="btn-primary">
                View Our Work
              </Link>
              <Link href="/contact" className="btn-accent">
                Start Your Project
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
