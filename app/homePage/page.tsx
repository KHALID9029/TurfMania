export default function HomePage() {
    return (
        <div>
            <h1 className="text-4xl font-bold">Welcome to Turf Mania!</h1>
            <p className="mt-4 text-lg">Your one-stop solution for turf management.</p>
            <div className="mt-8">
                <a href="/dashboard" className="bg-blue-500 text-white px-4 py-2 rounded">Go to Dashboard</a>
            </div>
        </div>
    )
}