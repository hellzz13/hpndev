import Image from "next/image";

type BrandProps = {
  compactOnMobile?: boolean;
  className?: string;
};

function Brand({
  compactOnMobile = false,
  className = "h-8 w-auto",
}: BrandProps) {
  const lockupStyle = compactOnMobile ? "mobile:hidden" : "";
  return (
    <span className="inline-flex shrink-0 items-center">
      <Image
        src="/brand/helio-os-logo.svg"
        alt="Hélio OS"
        width={303}
        height={80}
        className={`${className} ${lockupStyle}`}
        priority
      />
      {compactOnMobile && (
        <Image
          src="/brand/helio-os-symbol.svg"
          alt="Hélio OS"
          width={80}
          height={80}
          className="hidden h-6 w-6 mobile:block"
          priority
        />
      )}
    </span>
  );
}

export { Brand };
