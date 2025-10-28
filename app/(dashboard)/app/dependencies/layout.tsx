export default function DependenciesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 top-16 left-[var(--sidebar-width)] overflow-auto z-10">
      {children}
    </div>
  );
}
