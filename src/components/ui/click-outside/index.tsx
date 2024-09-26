import React, { useRef, useEffect, FC, ReactElement } from 'react';
import hasParent from './has-parent';

interface ClickOutsideProps {
  active: boolean;
  onClick: (evt: MouseEvent) => void;
  children: ReactElement;
}

const ClickOutside: FC<ClickOutsideProps> = ({
  active = true,
  onClick,
  children,
}) => {
  const innerRef = useRef();
  const handleClick = (event: MouseEvent) => {
    if (innerRef.current) {
      if (!hasParent(event.target, innerRef?.current)) {
        if (typeof onClick === 'function') {
          onClick(event);
        }
      }
    }
  };
  useEffect(() => {
    if (active) {
      document.addEventListener('mousedown', handleClick);
    }
    return () => {
      if (active) {
        document.removeEventListener('mousedown', handleClick);
      }
    };
  });
  return React.cloneElement(children, { ref: innerRef });
};

export default ClickOutside;
