import StartAndResetButton from "./StartAndResetButton";

export default function GameStatusTitle({ timer, score, isPlaying, handleStart, handleReset }) {
    return (
        <div className="flex items-center justify-center gap-8">
            <span>⏰ {timer}초</span>
            <span>점수 : {score}점</span>
            <StartAndResetButton isPlaying={isPlaying} handleStart={handleStart} handleReset={handleReset} />
        </div>
    )
}