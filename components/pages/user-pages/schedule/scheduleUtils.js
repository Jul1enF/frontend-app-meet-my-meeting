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
