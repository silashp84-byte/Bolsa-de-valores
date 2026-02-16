
import { StockExchange, ExchangeStatus } from '../types';

/**
 * Determines the current open/closed status of a stock exchange based on its trading hours and timezone.
 * This is a simplified client-side check and does not account for holidays or daylight saving changes dynamically.
 *
 * @param exchange The StockExchange object containing name, timezone, openHour, and closeHour.
 * @returns ExchangeStatus.OPEN if the exchange is currently within its trading hours, otherwise ExchangeStatus.CLOSED.
 */
export function getExchangeStatus(exchange: StockExchange): ExchangeStatus {
  const now = new Date();

  // Get current time in the exchange's timezone
  const formatter = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hourCycle: 'h23', // Use 24-hour format
    timeZone: exchange.timezone,
  });

  const parts = formatter.formatToParts(now);
  let exchangeHour = 0;
  let exchangeMinute = 0;

  for (const part of parts) {
    if (part.type === 'hour') {
      exchangeHour = parseInt(part.value, 10);
    } else if (part.type === 'minute') {
      exchangeMinute = parseInt(part.value, 10);
    }
  }

  const currentExchangeTimeInMinutes = exchangeHour * 60 + exchangeMinute;
  const openTimeInMinutes = exchange.openHour * 60;
  const closeTimeInMinutes = exchange.closeHour * 60;

  // Check if current time is within trading hours
  if (currentExchangeTimeInMinutes >= openTimeInMinutes && currentExchangeTimeInMinutes < closeTimeInMinutes) {
    return ExchangeStatus.OPEN;
  } else {
    return ExchangeStatus.CLOSED;
  }
}
