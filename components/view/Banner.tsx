import Image from "next/image";

const Banner = () => {
  return (
    <div className="w-full max-h-105 overflow-hidden rounded-xl">
      <Image
        src="/img-banner.webp"
        alt="Banner"
        width={1920}
        height={1080}
        loading="eager"
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export default Banner;
