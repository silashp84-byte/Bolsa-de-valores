
import React, { useState, useEffect } from 'react';
import { StockExchange, ExchangeStatus } from '../types';
import { getExchangeStatus } from '../utils/timeUtils';

interface StockExchangeStatusProps {
  exchanges: StockExchange[];
}

interface ExchangeStatusData extends StockExchange {
  status: ExchangeStatus;
}

const StockExchangeStatus: React.FC<StockExchangeStatusProps> = ({ exchanges }) => {
  const [exchangeStatuses, setExchangeStatuses] = useState<ExchangeStatusData[]>([]);

  const updateStatuses = () => {
    const updated = exchanges.map(exchange => ({
      ...exchange,
      status: getExchangeStatus(exchange),
    }));
    setExchangeStatuses(updated);
  };

  useEffect(() => {
    updateStatuses(); // Initial update
    const intervalId = setInterval(updateStatuses, 60 * 1000); // Update every minute
    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [exchanges]);

  return (
    <div className="bg-green-900 p-4 rounded-xl shadow-md">
      <h2 className="text-xl font-semibold text-lime-100 mb-4 border-b border-green-800 pb-2">
        Status das Bolsas de Valores
      </h2>
      <div className="space-y-2 text-sm">
        {exchangeStatuses.map((exchange) => (
          <div key={exchange.name} className="flex justify-between items-center">
            <span className="text-gray-100">{exchange.name}:</span>
            <span
              className={`font-semibold ${
                exchange.status === ExchangeStatus.OPEN ? 'text-emerald-400' : 'text-pink-400'
              }`}
            >
              {exchange.status === ExchangeStatus.OPEN ? 'Aberto' : 'Fechado'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StockExchangeStatus;
