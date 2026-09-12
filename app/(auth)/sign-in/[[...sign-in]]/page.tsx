import { SignIn } from "@clerk/nextjs"
import { AuthProductPanel } from "@/components/auth/auth-product-panel"

export default function SignInPage() {
  return (
    <main className="grid min-h-[100dvh] bg-background lg:grid-cols-2">
      <AuthProductPanel />
      <section className="flex min-h-[100dvh] items-center justify-center px-6 py-10 sm:px-10 lg:px-12">
        <div className="w-full max-w-[420px]">
          <div className="mb-8 lg:hidden">
            <div className="flex items-center gap-3 text-sm font-medium tracking-[0.18em] text-foreground">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                G
              </span>
              GHOST Collab AI
            </div>
          </div>
          <SignIn
            path="/sign-in"
            routing="path"
            signInUrl="/sign-in"
            signUpUrl="/sign-up"
            fallbackRedirectUrl="/editor"
          />
        </div>
      </section>
    </main>
  )
}
