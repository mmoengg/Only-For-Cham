
export default function StartAndResetButton({ isPlaying, handleStart, handleReset }) {
    return (
        <>
            {isPlaying
                ? (
                    <button onClick={handleReset} className="px-3 py-1 bg-gray-700 text-white rounded cursor-pointer">
                        초기화
                    </button>
                )
                : (
                    <button onClick={handleStart} className="px-3 py-1 bg-blue-600 text-white rounded cursor-pointer">
                        시작
                    </button>
                )
            }
        </>
    )
}