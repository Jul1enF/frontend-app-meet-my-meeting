const updateDay = (index, partialDay, setNewSchedule) => {
  setNewSchedule(prev => ({
    ...prev,
    [index]: {
      ...prev[index],
      ...partialDay,
    },
  }));
};

const updateBreak = (index, partialBreak, setNewSchedule) => {
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


  export const toggleEnabled = (day, index, setNewSchedule) => {
    updateDay(index, { enabled: !day.enabled }, setNewSchedule);
  };

  export const changeStart = (value) => {
    updateDay(index, { start: value }, setNewSchedule);
  };

  export const changeEnd = (value) => {
    updateDay(index, { end: value }, setNewSchedule);
  };

  export const toggleBreak = (day, index, setNewSchedule) => {
    updateBreak(index, { enabled: !day.break.enabled }, setNewSchedule);
  };

  export const changeBreakStart = (value) => {
    updateBreak(index, { start: value }, setNewSchedule);
  };

  export const changeBreakEnd = (value) => {
    updateBreak(index, { end: value }, setNewSchedule);
  };