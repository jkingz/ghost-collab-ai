import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-center px-12 bg-card">
        <div className="max-w-md">
          <h1 className="text-2xl font-bold mb-2">Ghost AI</h1>
          <p className="text-muted-foreground mb-8">
            Real-time collaborative system design workspace
          </p>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li>Design system architectures with AI assistance</li>
            <li>Collaborate in real-time with your team</li>
            <li>Generate technical specifications from your designs</li>
            <li>Import starter templates to accelerate your workflow</li>
          </ul>
        </div>
      </div>
      <div className="flex items-center justify-center p-8">
        <SignIn />
      </div>
    </div>
  );
}
