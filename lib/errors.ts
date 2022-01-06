import { defekt } from 'defekt';

class PasswordNotSet extends defekt({ code: 'PasswordNotSet' }) {}
class RedirectAlreadyExists extends defekt({ code: 'RedirectAlreadyExists' }) {}
class RedirectNotFound extends defekt({ code: 'RedirectNotFound' }) {}
class UsernameNotSet extends defekt({ code: 'UsernameNotSet' }) {}

export {
  PasswordNotSet,
  RedirectAlreadyExists,
  RedirectNotFound,
  UsernameNotSet
};
