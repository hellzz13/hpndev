import Image from "next/image";

type ProjectIdentityProps = { name: string; logo: string };

function ProjectIdentity({ name, logo }: ProjectIdentityProps) {
  return (
    <div className="flex items-center gap-3">
      <Image src={logo} alt="" width={48} height={48} className="h-12 w-12 shrink-0 rounded-project-card object-contain" />
      <h3 className="min-w-0">{name}</h3>
    </div>
  );
}

export { ProjectIdentity };
