

// LOGIC TO MODIFY THE SCHEDULE OF A DAY

export const createScheduleActions = (setNewSchedule) => {
  const updateDay = (index, partialDay) => {
    setNewSchedule(prev => ({
      ...prev,
      [index]: {
        ...prev[index],
        ...partialDay,
      },
    }));
  };

  const updateBreak = (index, partialBreak) => {
    setNewSchedule(prev => ({
      ...prev,
      [index]: {
        ...prev[index],
        break: {
          ...prev[index].break,
          ...partialBreak,
        },
      },
    }));
  };

  return {
    toggleEnabled: (day, index) =>
      updateDay(index, { enabled: !day.enabled }),

    changeStart: (value, index) =>
      updateDay(index, { start: value }),

    changeEnd: (value, index) =>
      updateDay(index, { end: value }),

    toggleBreak: (day, index) =>
      updateBreak(index, { enabled: !day.break.enabled }),

    changeBreakStart: (value, index) =>
      updateBreak(index, { start: value }),

    changeBreakEnd: (value, index) =>
      updateBreak(index, { end: value }),
  };
};



// LOGIC TO VALIDATE THE VALUES OF A DAY

import moment from "moment";

const compareHours = (timeBefore, timeAfter) => moment(timeBefore, "HH:mm").isBefore(moment(timeAfter, "HH:mm"))

export const dayValidation = (day, finalCheck = false) => {
  
  const one = finalCheck ? "un " : "";
  const ofDay = finalCheck ? "de journée est " : "";
  const ofBreak = finalCheck ? "de pause est " : "";
  const inDay = finalCheck ? "d'une " : "de la ";

  let dayError = null;
  let breakError = null;

  if (!day.enabled) return { dayError, breakError }

  if (!compareHours(day.start, day.end)) {
    dayError = `Erreur : ${one}horaire de début ${ofDay}supérieur à celui de fin !`;
  }

  if (!day.break.enabled) return { dayError, breakError }


  if (!compareHours(day.break.start, day.break.end)) {
    breakError = `Erreur : ${one}horaire de début ${ofBreak}supérieur à celui de fin !`;
  } else if (
    !compareHours(day.start, day.break.start) ||
    !compareHours(day.break.end, day.end)
  ) {
    breakError = `Erreur : horaires de pause mal insérés dans ceux ${inDay}journée !`;
  }


  return { dayError, breakError };
};

