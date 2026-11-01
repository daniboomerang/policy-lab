export default function PoliciesPage() {
  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:px-8">
      <h1 className="text-2xl font-semibold tracking-tight">Policies</h1>
      <section className="rounded-lg border bg-card p-5 text-card-foreground">
        <p className="text-muted-foreground">Policy Lab is being built. The policies table lands here.</p>
        <p className="mt-2 font-mono text-xs text-muted-foreground">GET /v1/mandates?status=active</p>
      </section>
    </main>
  );
}
