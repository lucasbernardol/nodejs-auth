import Gravatar from 'gravatar';
import configs from '../../configs/gravatar.js';

export const gravatar = (email) => {
  const gravatarUrl = Gravatar.url(email, configs);

  return gravatarUrl;
};
