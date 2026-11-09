interface AdminPageHeaderProps {
  title: string;
  description: string;
}

export function AdminPageHeader({ title, description }: AdminPageHeaderProps) {
  return (
    <div className="space-y-1">
      <h1 className="text-2xl font-bold tracking-tight text-[#F5F2EB]">
        {title}
      </h1>
      <p className="text-sm text-[#888888]">{description}</p>
    </div>
  );
}
