export default function Home() {
  return (
    <div className="w-full h-[100vh] rounded-lg overflow-hidden flex items-center justify-center">
      <div className="w-full h-full text-center font-bold text-4xl md:text-6xl lg:text-9xl text-foreground flex flex-col items-center justify-center px-4">
        <h1 className="opacity-0">Up In Town</h1>
        <div className="text-lg md:text-xl lg:text-2xl font-medium mt-6 md:mt-8 lg:mt-12 text-foreground/60 w-full md:w-2/3 lg:w-1/4 opacity-0">
          Constructing digital landmarks that captivate the town
        </div>
      </div>
    </div>
  );
}
