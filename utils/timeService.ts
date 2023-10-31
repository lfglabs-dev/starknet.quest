export function timeElapsed(timestamp: number) {
  const now = Date.now();
  const differenceInSeconds = (now - timestamp) / 1000;

  const secondsInAMinute = 60;
  const minutesInAnHour = 60;
  const hoursInADay = 24;
  const daysInAWeek = 7;
  const weeksInAMonth = 4.35; // Average weeks in a month
  const monthsInAYear = 12;

  if (differenceInSeconds < 60) {
    return `${Math.round(differenceInSeconds)} s ago`;
  } else if (differenceInSeconds < secondsInAMinute * minutesInAnHour) {
    return `${Math.round(differenceInSeconds / secondsInAMinute)} min. ago`;
  } else if (
    differenceInSeconds <
    secondsInAMinute * minutesInAnHour * hoursInADay
  ) {
    const hoursElapsed = Math.round(
      differenceInSeconds / (secondsInAMinute * minutesInAnHour)
    );
    return `${hoursElapsed} hr. ago`;
  } else if (
    differenceInSeconds <
    secondsInAMinute * minutesInAnHour * hoursInADay * daysInAWeek
  ) {
    const daysElapsed = Math.round(
      differenceInSeconds / (secondsInAMinute * minutesInAnHour * hoursInADay)
    );
    if (daysElapsed === 1) return "yesterday";
    else return `${daysElapsed} days ago`;
  } else if (
    differenceInSeconds <
    secondsInAMinute *
      minutesInAnHour *
      hoursInADay *
      daysInAWeek *
      weeksInAMonth
  ) {
    const weeksElapsed = Math.round(
      differenceInSeconds /
        (secondsInAMinute * minutesInAnHour * hoursInADay * daysInAWeek)
    );
    if (weeksElapsed === 1) return "last week";
    else return `${weeksElapsed} weeks ago`;
  } else if (
    differenceInSeconds <
    secondsInAMinute *
      minutesInAnHour *
      hoursInADay *
      daysInAWeek *
      weeksInAMonth *
      monthsInAYear
  ) {
    const monthsElapsed = Math.round(
      differenceInSeconds /
        (secondsInAMinute *
          minutesInAnHour *
          hoursInADay *
          daysInAWeek *
          weeksInAMonth)
    );
    if (monthsElapsed === 1) return "last month";
    else return `${monthsElapsed} months ago`;
  } else {
    const yearsElapsed = Math.round(
      differenceInSeconds /
        (secondsInAMinute *
          minutesInAnHour *
          hoursInADay *
          daysInAWeek *
          weeksInAMonth *
          monthsInAYear)
    );
    if (yearsElapsed === 1) return "last year";
    else
      return `${Math.round(
        differenceInSeconds /
          (secondsInAMinute *
            minutesInAnHour *
            hoursInADay *
            daysInAWeek *
            weeksInAMonth *
            monthsInAYear)
      )} years ago`;
  }
}
