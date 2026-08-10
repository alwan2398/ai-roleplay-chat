import Link from "next/link";

const NotFound = () => {
  return (
    <main className="relative flex flex-1 min-h-[calc(100vh-4rem)] w-full flex-col items-center justify-center overflow-hidden px-4 text-center">
      {/* Background 404 Typography */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center select-none z-0"
      >
        <span className="text-[32vw] font-black leading-none text-foreground/5 sm:text-[26vw] md:text-[22rem] tracking-tighter">
          404
        </span>
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 flex max-w-lg flex-col items-center justify-center space-y-6">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
          Nothing to see here
        </h1>
        <p className="max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
          Page you are trying to open does not exist. You may have mistyped the
          address, or the page has been moved to another URL. If you think this
          is an error contact support.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-full border border-foreground/20 bg-background/50 px-6 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-foreground/40 hover:bg-foreground/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Back to home page
        </Link>
      </div>
    </main>
  );
};

export default NotFound;
