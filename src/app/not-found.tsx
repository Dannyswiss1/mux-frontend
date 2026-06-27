import Link from "next/link";

export default function NotFound() {
	return (
		<div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
			<div className="flex min-h-[400px] w-full max-w-lg flex-col items-center justify-center rounded-xl border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-black">
				<div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
					<svg
						className="h-10 w-10 text-zinc-400 dark:text-zinc-500"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						strokeWidth={1.5}
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
						/>
					</svg>
				</div>
				<h1 className="mb-2 text-6xl font-bold text-zinc-900 dark:text-zinc-50">
					404
				</h1>
				<h2 className="mb-2 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
					Page not found
				</h2>
				<p className="mb-8 max-w-sm text-zinc-500 dark:text-zinc-400">
					The page you are looking for does not exist or has been moved. Please
					check the URL or navigate back to the homepage.
				</p>
				<Link
					href="/"
					className="inline-flex h-10 items-center justify-center rounded-lg bg-zinc-900 px-6 text-sm font-medium text-zinc-50 transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
				>
					Go back home
				</Link>
			</div>
		</div>
	);
}
