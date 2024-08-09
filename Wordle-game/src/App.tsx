import { useEffect, useState } from "react";
import GuessInput from "./components/GuessInput";
import KeyBoardButtons from "./components/KeyBoardButtons";
import useGameStore from "./store/store";
import GameStatus from "./components/GameStatus";
import Timer from "./components/Timer";
import PlayAgainButton from "./components/PlayAgainButton";

function App() {
  const {
    word,
    guesses,
    currentGuesses,
    wonLoseFlag,
    remainAttempts,
    setGuess,
    updateGuesses,
    addGuess,
    resetGame,
  } = useGameStore();

  const [showPlayAgain, setShowPlayAgain] = useState(false);
  const [timer, setTimer] = useState(20);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (wonLoseFlag === "Won" || wonLoseFlag === "Lost") {
        // Ignore any input if the game is won or lost
        return;
      }
      console.log("im in handleKey: ", event);
  
      if (event.key.match(/^[a-z]$/i) && guesses[currentGuesses].length < 5) {
        // Handle letter keys (A-Z or a-z)
        setGuess(event.key.toLowerCase(), currentGuesses);
      } else if (event.key === "Enter" && guesses[currentGuesses].length === 5) {
        // Handle the Enter key
        event.preventDefault();
        addGuess(guesses[currentGuesses]);
      } else if (event.key === "Backspace") {
        // Handle the Backspace key
        event.preventDefault();
        updateGuesses();
      }
    };

    window.addEventListener("keydown", handleKey);

    return () => {
      window.removeEventListener("keydown", handleKey);
    };
  }, [word, guesses, currentGuesses, setGuess, addGuess, updateGuesses, wonLoseFlag]);

  useEffect(() => {
    if (wonLoseFlag === "Lost") {
      if (remainAttempts <= 0) {
        setShowPlayAgain(false);
        setTimer(20);

        const timerInterval = setInterval(() => {
          setTimer(prev => {
            if (prev <= 1) {
              clearInterval(timerInterval);
              setShowPlayAgain(true);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        setShowPlayAgain(true); // Show "Play Again" button if there are attempts left
      }
    } else {
      setShowPlayAgain(false); // Hide "Play Again" button if not in a losing state
    }
  }, [wonLoseFlag, remainAttempts]);

  return (
    <div className="main-card relative">
      <h1 className="header">Wordle</h1>
      {guesses.map((_, i) => (
        <GuessInput
          key={i.toString()}
          inputKey={i.toString()}
          word={word}
          guess={guesses[i]}
          isGuessed={i < currentGuesses}
        />
      ))}
      <KeyBoardButtons />
      <p>word: {word}</p>

      {/* Conditional Rendering for Game Status */}
      <GameStatus
        wonLoseFlag={wonLoseFlag}
        remainAttempts={remainAttempts}
        showPlayAgain={showPlayAgain}
        resetGame={resetGame}
      />
      {wonLoseFlag === "Lost" && remainAttempts <= 0 && !showPlayAgain && (
        <Timer timer={timer} />
      )}
      {wonLoseFlag === "Lost" && remainAttempts <= 0 && showPlayAgain && (
        <PlayAgainButton resetGame={resetGame} />
      )}
    </div>
  );
}

export default App;
