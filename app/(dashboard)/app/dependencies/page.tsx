import { DependencyGraph } from '@/components/dependencies/DependencyGraph';

export default function DependenciesPage() {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b bg-background px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Dependency Graph</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Visualize and manage project dependencies across your organization
            </p>
          </div>
        </div>
      </div>

      {/* Graph */}
      <DependencyGraph />
    </div>
  );
}
