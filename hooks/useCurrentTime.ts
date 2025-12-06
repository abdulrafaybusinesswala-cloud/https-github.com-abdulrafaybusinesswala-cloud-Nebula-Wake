import { useState, useEffect } from 'react';

export const useCurrentTime = () => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const formatDisplayTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const formatSeconds = (date: Date) => {
    return date.getSeconds().toString().padStart(2, '0');
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });
  };

  return {
    now,
    timeString: formatTime(now),
    displayTime: formatDisplayTime(now),
    seconds: formatSeconds(now),
    dateString: formatDate(now),
  };
};
