import add from 'date-fns/add'
import endOfDay from 'date-fns/endOfDay'
import intervalToDuration from 'date-fns/intervalToDuration'
import startOfDay from 'date-fns/startOfDay'

/** time wrapper to handle time-related operations (works in seconds and not ms, synchronized
 * with backend's time) */
export class DateManager {
  private date: Date

  /** input date is in seconds if provided */
  constructor(date?: DateManager | Date | number | string, utc: boolean = false) {
    if (typeof date === 'number') {
      this.date = new Date(date * 1000)
    } else if (typeof date === 'string') {
      if (utc) {
        /**
         * the string is interpreted as UTC in the UX, but the Date constructure interprets it as local string.
         * So we need to shift the local time offset.
         */
        this.date = new Date(date)
        // temp.getTimezoneOffset();
        // this.date = new Date(temp.getTime() - temp.getTimezoneOffset() * 60 * 1000);
      } else {
        this.date = new Date(date)
      }
    } else if (date instanceof Date) {
      this.date = date
    } else if (date instanceof Date) {
      this.date = date
    } else {
      this.date = new Date()
    }
  }

  static from(
    date?: DateManager | Date | number | string,
    utc: boolean = false,
  ): DateManager {
    const datem = new DateManager(date, utc)
    return datem
  }

  clone(): DateManager {
    return new DateManager(new Date(this.date))
  }

  /** get's time in seconds (includes the bias) */
  getTime(): number {
    return Math.floor(this.date.getTime() / 1000)
  }

  /* Returns the dynamic time. Similar to Date.now() but in seconds and including the bias. */
  getTimeDynamic(): number {
    return Date.now() / 1000
  }

  /** returns a new DateManger object with the time = getTimeDynamic */
  cloneToNow(): DateManager {
    return DateManager.from(new Date(this.getTimeDynamic() * 1000))
  }

  /** updates to the latest device date (keeping the bias) */
  refresh(): void {
    this.date = new Date()
  }

  addMonths(n: number): DateManager {
    this.date = add(this.date, { months: n })
    return this
  }

  addDays(n: number): DateManager {
    this.date = add(this.date, { days: n })
    return this
  }

  startOfDay(): DateManager {
    const start = startOfDay(this.date)
    this.date = start
    return this
  }

  endOfDay(): DateManager {
    const start = endOfDay(this.date)
    this.date = start
    return this
  }

  durationTo(endDate: number): Duration {
    return intervalToDuration({
      start: this.date.getTime() * 1000,
      end: endDate * 1000,
    })
  }
  static intervalDuration(startDate: number, endDate: number): Duration {
    return intervalToDuration({
      start: startDate * 1000,
      end: endDate * 1000,
    })
  }

  prettyDiff(to: number): string {
    // TODO
    const diff = Math.abs(this.getTime() - to)
    if (diff < 60) {
      return Math.ceil(diff).toString() + ' sec'
    } else if (diff < 60 * 60) {
      return Math.ceil(diff / 60).toString() + ' min'
    } else if (diff < 60 * 60 * 24) {
      return Math.ceil(diff / (60 * 60)).toString() + ' hr'
    } else {
      return Math.ceil(diff / (60 * 60 * 24)).toString() + ' days'
    }
  }

  toString(): string {
    return this.date.toString()
  }
}
