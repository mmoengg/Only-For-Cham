'use client';

import GameStatusTitle from "@/components/GameStatusTitle";
import { useEffect, useState, useRef } from "react";

const CARD_COUNT = 20;
const GAME_TIME = 45;

export default function MainGame() {
    const [score, setScore] = useState(0);
    const [timer, setTimer] = useState(GAME_TIME);
    const [isPlaying, setIsPlaying] = useState(false);
    const [cardStates, setCardStates] = useState(Array(CARD_COUNT).fill("off"));
    const [hasBombAppeared, setHasBombAppeared] = useState(false);
    const isPlayingRef = useRef(isPlaying);

    // 타이머용 useRef 2개 분리
    const hideCardTimeout = useRef(null);
    const showNextCardTimeout = useRef(null);

    // 타이머 모두 초기화 함수
    const clearAllTimeouts = () => {
        if (hideCardTimeout.current) {
            clearTimeout(hideCardTimeout.current);
            hideCardTimeout.current = null;
        }
        if (showNextCardTimeout.current) {
            clearTimeout(showNextCardTimeout.current);
            showNextCardTimeout.current = null;
        }
    };

    /**
     * 화면 리셋
     */
    const resetBoard = () => {
        clearAllTimeouts();
        setCardStates(Array(CARD_COUNT).fill("off"));
        setScore(0);
        setTimer(GAME_TIME);
        setHasBombAppeared(false);
    };

    /**
     * 게임 시작
     */
    const handleStart = () => {
        resetBoard();
        setIsPlaying(true);

        // 2초 후에 카드 활성화 시작
        showNextCardTimeout.current = setTimeout(() => {
            showOneActiveCard();
        }, 2000);
    };

    /**
     * 게임 초기화
     */
    const handleReset = () => {
        resetBoard();
        setIsPlaying(false);
    };

    /**
     * 카드 랜덤 on
     */
    const showOneActiveCard = () => {
        clearAllTimeouts();

        setCardStates(() => {
            const idx = Math.floor(Math.random() * CARD_COUNT);

            let bomb = false;
            if (!hasBombAppeared) {
                bomb = Math.random() < 0.1;
                if (bomb) setHasBombAppeared(true);
            }

            const arr = Array(CARD_COUNT).fill("off");
            arr[idx] = bomb ? "bomb" : "on";

            return arr;
        });

        // 1초 후 카드 비활성화
        hideCardTimeout.current = setTimeout(() => {
            setCardStates(Array(CARD_COUNT).fill("off"));
        }, 1000);

        // 2초 후에는 다음 카드 활성화 시도
        showNextCardTimeout.current = setTimeout(() => {
            if (timer > 1 && isPlayingRef) {
                showOneActiveCard();
            }
        }, 2000);
    };

    /**
     * 카드 클릭 시 처리
     */
    const handleCardClick = (idx) => {
        if (!isPlaying) return;

        setCardStates((prev) => {
            const type = prev[idx];
            setScore((s) => {
                let newScore = s;
                if (type === "on") newScore += 20;
                else if (type === "off") newScore -= 100;
                else if (type === "bomb") newScore -= 20;
                return newScore;
            });

            // 클릭 시 각각 타이머 초기화
            clearAllTimeouts();

            // 모든 카드 off
            const offState = Array(CARD_COUNT).fill("off");

            // 클릭 후 2초 후 다음 카드 보여주기
            showNextCardTimeout.current = setTimeout(() => {
                if (timer > 0 && isPlaying) {
                    showOneActiveCard();
                }
            }, 2000);

            return offState;
        });
    };

    // 타이머 카운트다운 처리
    useEffect(() => {
        if (!isPlaying) return;

        if (timer === 0) {
            setIsPlaying(false);
            clearAllTimeouts();
            return;
        }

        const countdownTimer = setTimeout(() => {
            setTimer((t) => t - 1);
        }, 1000);

        return () => clearTimeout(countdownTimer);
    }, [isPlaying, timer]);

    // 컴포넌트 unmount 시 타이머 정리
    useEffect(() => {
        return () => clearAllTimeouts();
    }, []);

    // isPlaying 상태 변경시 카드 끄기 및 타이머 정리
    useEffect(() => {
        if (!isPlaying) {
            clearAllTimeouts();
            setCardStates(Array(CARD_COUNT).fill("off"));
        }
    }, [isPlaying]);

    useEffect(() => {
        isPlayingRef.current = isPlaying;
    }, [isPlaying]);

    return (
        <div className="w-full flex flex-col items-center gap-4">
            <GameStatusTitle
                timer={timer}
                score={score}
                handleStart={handleStart}
                handleReset={handleReset}
                isPlaying={isPlaying}
            />
            <div className="w-full px-6 flex items-center justify-center flex-wrap">
                {cardStates.map((type, index) => (
                    <div key={index} className="w-1/5 h-[170px] p-3">
                        <button
                            onClick={() => handleCardClick(index)}
                            className="w-full h-full rounded"
                            style={{
                                background:
                                    type === "off"
                                        ? "oklch(0.816 0.134 153.655)"
                                        : type === "on"
                                            ? "#fde274"
                                            : "#ffb4b4",
                            }}
                            disabled={!isPlaying}
                        >
                            {
                                type === "off"
                                    ? ""
                                    : type === "on"
                                        ? "♥️"
                                        : "💣"
                            }
                        </button>
                    </div>
                ))}
            </div>
            {!isPlaying && timer !== GAME_TIME && (
                <div className="mt-6 text-2xl text-blue-700 font-semibold">
                    {score >= 350 ? "축하합니다! 1등입니다!" : "아쉽지만 다시 도전해보세요!"}
                </div>
            )}
        </div>
    );
}
