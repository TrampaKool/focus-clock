const { useState, useEffect } = React;

const FocusClock = () => {
  const [sessionLen, setSessionLen] = useState(25);
  const [breakLen, setBreakLen] = useState(5);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  const [isOnBreak, setIsOnBreak] = useState(false);

  const handleResetClick = () => {
    //Animate arrow
    const icon = document.querySelector(".bi-arrow-clockwise");
    icon.classList.add("bi-arrow-clockwise-spin");
    setTimeout(() => {
      icon.classList.remove("bi-arrow-clockwise-spin");
    }, 300);

    setIsOnBreak(false);
    setIsPaused(true);
    setMinutes(sessionLen);
    setSeconds(0);
  };

  const updateTimer = () => {
    setSeconds((prevSec) => {
      if (prevSec === 0) {
        setMinutes((prevMin) => {
          if (prevMin === 0) {
            const nextIsOnBreak = !isOnBreak;
            setIsOnBreak(nextIsOnBreak);
            const beep = new Audio("beep.wav");
            beep.play();
            return nextIsOnBreak ? breakLen - 1 : sessionLen - 1;
          }
          return prevMin - 1;
        });
        return 59;
      }
      return prevSec - 1;
    });
  };

  useEffect(() => {
    setMinutes(isOnBreak ? breakLen : sessionLen);
    setSeconds(0);
  }, [sessionLen, breakLen]);

  useEffect(() => {
    let intervalAction;
    if (!isPaused) {
      intervalAction = setInterval(() => updateTimer(), 1000);
    }

    return () => clearInterval(intervalAction);
  }, [isPaused]);

  return (
    <div className="row custom-row">
      <Display
        sessionLen={sessionLen}
        breakLen={breakLen}
        minutes={minutes}
        seconds={seconds}
        isOnBreak={isOnBreak}
        isPaused={isPaused}
        setIsPaused={setIsPaused}
        handleResetClick={handleResetClick}
      />
      <Settings
        sessionLen={sessionLen}
        setSessionLen={setSessionLen}
        breakLen={breakLen}
        setBreakLen={setBreakLen}
        isPaused={isPaused}
      />
    </div>
  );
};

const Display = ({
  sessionLen,
  breakLen,
  minutes,
  seconds,
  isOnBreak,
  isPaused,
  setIsPaused,
  handleResetClick
}) => {
  return (
    <>
      <div id="display-container" className="col-12 custom-col">
        <div className="d-flex flex-column justify-content-center align-items-center">
          <div style={{ fontSize: "4rem" }}>
            {isOnBreak ? "Break" : "Session"}
          </div>
          <div
            style={{ width: "max-content", fontSize: "8rem" }}
            className="inner-window fw-bold mt-2"
          >
            {minutes < 10 ? "0" + minutes : minutes} :{" "}
            {seconds < 10 ? "0" + seconds : seconds}
          </div>
          <div id="flow-controls">
            <button
              className="settings-button flow-controls-buttons"
              style={{ position: "relative" }}
              onClick={() => setIsPaused((prev) => !prev)}
            >
              <i
                style={{ display: isPaused ? "inline" : "none" }}
                className="bi bi-play-fill"
              />
              <i
                style={{ display: !isPaused ? "inline" : "none" }}
                className="bi bi-pause-fill"
              />
            </button>
            <button
              className="settings-button flow-controls-buttons"
              onClick={handleResetClick}
            >
              <i className="bi bi-arrow-clockwise" />
            </button>
          </div>
        </div>
      </div>
      <div className="col-6  custom-col d-flex flex-column justify-content-evenly">
        <div className="value">
          <div className="value-label">Session Length</div>
          <div className="time-label">
            {sessionLen < 10 ? "0" + sessionLen : sessionLen} : 00
          </div>
        </div>
        <div className="value">
          <div className="value-label">Break Length</div>
          <div className="time-label">
            {breakLen < 10 ? "0" + breakLen : breakLen} : 00
          </div>
        </div>
      </div>
    </>
  );
};

const Settings = ({
  sessionLen,
  breakLen,
  setSessionLen,
  setBreakLen,
  isPaused
}) => {
  const updateSessionLen = (val) => {
    setSessionLen((prev) => {
      const newVal = prev + val;
      if (newVal >= 1 && newVal <= 60) {
        return newVal;
      }
      return prev;
    });
  };

  const updateBreakLen = (val) => {
    setBreakLen((prev) => {
      const newVal = prev + val;
      if (newVal >= 1 && newVal <= 60) {
        return newVal;
      }
      return prev;
    });
  };

  const handleChange = (event) => {
    const setFunc =
      event.target.id === "session-input" ? setSessionLen : setBreakLen;
    const val = event.target.value;
    setFunc(() => {
      if (val > 60) {
        return 60;
      } else if (val < 1) {
        return 1;
      }
      return parseInt(val, 10);
    });
  };

  return (
    <div className="col-6 custom-col d-flex flex-column justify-content-evenly">
      <div className="value settings">
        <label className="input-label" for="session-input">
          Set Session
        </label>
        <button
          onClick={() => updateSessionLen(-1)}
          className="settings-button"
          disabled={!isPaused}
        >
          <i class="bi bi-dash-lg settings-icon"></i>
        </button>
        <input
          value={sessionLen}
          onChange={handleChange}
          disabled={!isPaused}
          type="number"
          inputMode="numeric"
          id="session-input"
          className="input-field"
        />
        <button
          onClick={() => updateSessionLen(1)}
          className="settings-button"
          disabled={!isPaused}
        >
          <i class="bi bi-plus-lg settings-icon"></i>
        </button>
      </div>
      <div className="value settings">
        <label
          style={{ marginRight: "2rem" }}
          className="input-label"
          for="break-input"
        >
          Set Break
        </label>
        <button
          onClick={() => updateBreakLen(-1)}
          className="settings-button"
          disabled={!isPaused}
        >
          <i class="bi bi-dash-lg settings-icon"></i>
        </button>
        <input
          value={breakLen}
          onChange={handleChange}
          disabled={!isPaused}
          type="number"
          inputMode="numeric"
          id="break-input"
          className="input-field"
        />
        <button
          onClick={() => updateBreakLen(1)}
          className="settings-button"
          disabled={!isPaused}
        >
          <i class="bi bi-plus-lg settings-icon"></i>
        </button>
      </div>
    </div>
  );
};

ReactDOM.render(<FocusClock />, document.getElementById("react-container"));
