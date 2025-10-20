import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
	return (
		<div className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-slate-950 via-slate-900 to-slate-950 px-4">
			<div className="w-full max-w-sm bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl p-4 lg:p-8">
				<h1 className="text-2xl font-semibold text-white text-center mb-6 tracking-tight">
					Welcome Back!
				</h1>

				<LoginForm />
			</div>
		</div>
	)
}
