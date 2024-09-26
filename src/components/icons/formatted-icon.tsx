import React, { FC } from 'react';
import TwitterIcon from './twitter';

interface FormattedIconProps {
  name: string;
}
const FormattedIcon: FC<FormattedIconProps> = ({ name }) => {
  switch (name) {
    case 'Twitter':
      return <TwitterIcon />;
    default:
      return <TwitterIcon />;
  }
};

export default FormattedIcon;
