import { SignupForm } from "@/components/signup-form"

export default function SignUpPage() {
	return (
		<div className="w-full flex items-center justify-center min-h-screen bg-gradient-to-tr from-slate-950 via-slate-900 to-slate-950 p-4">
			<div className="w-full max-w-5xl bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl p-d lg:p-4">
				<h1 className="text-2xl font-semibold text-white text-center mb-6 tracking-tight">
					Welcome!
				</h1>

				<SignupForm className="px-4" />
			</div>
		</div>
	)
}
