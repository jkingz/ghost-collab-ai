import { FileText, Network, Sparkles, Users } from "lucide-react"

const productPoints = [
  {
    icon: Network,
    title: "Map the system",
    description: "Turn a plain-language idea into a clear architecture graph.",
  },
  {
    icon: Users,
    title: "Work together",
    description: "Refine decisions with your team in one shared workspace.",
  },
  {
    icon: FileText,
    title: "Ship the thinking",
    description: "Generate a technical specification from the finished design.",
  },
]

export function AuthProductPanel() {
  return (
    <section className="relative hidden min-h-[100dvh] overflow-hidden border-r border-border bg-card px-10 py-10 lg:flex lg:flex-col xl:px-16">
      <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:linear-gradient(to_bottom,black,transparent_75%)]" />
      <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full border border-primary/20" />
      <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full border border-primary/10" />

      <div className="relative flex items-center gap-3 text-sm font-medium tracking-[0.18em] text-foreground">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Sparkles className="h-4 w-4" />
        </span>
        GHOST Collab AI
      </div>

      <div className="relative my-auto max-w-xl py-16">
        <p className="mb-5 font-mono text-xs uppercase tracking-[0.22em] text-primary">
          System design workspace
        </p>
        <h1 className="max-w-lg text-4xl font-medium leading-[1.05] tracking-[-0.04em] text-foreground xl:text-5xl">
          Make the architecture visible.
        </h1>
        <p className="mt-6 max-w-md text-base leading-7 text-muted-foreground">
          Ghost Collab AI helps teams shape complex systems, test their thinking, and
          leave the room with a design everyone can build from.
        </p>

        <div className="mt-12 space-y-6">
          {productPoints.map(({ icon: Icon, title, description }) => (
            <div key={title} className="flex gap-4">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-primary">
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-sm font-medium text-foreground">{title}</h2>
                <p className="mt-1 max-w-sm text-sm leading-6 text-muted-foreground">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="relative text-xs text-muted-foreground">
        Design clearly. Collaborate deeply. Build confidently.
      </p>
    </section>
  )
}
