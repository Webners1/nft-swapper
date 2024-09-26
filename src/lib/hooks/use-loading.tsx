import { useState } from 'react';

const useLoading = () => {
  const [isLoading, setIsLoading] = useState(false);

  const showLoading = () => {
    const bodyElement = document.querySelector('body') as HTMLElement;
    setIsLoading(true);
    bodyElement.style.overflow = 'hidden';
  };
  const hideLoading = () => {
    const bodyElement = document.querySelector('body') as HTMLElement;
    setIsLoading(false);
    bodyElement.style.overflow = 'auto';
  };
  return [isLoading, showLoading, hideLoading] as const;
};

export default useLoading;
