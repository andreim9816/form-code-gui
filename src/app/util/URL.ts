export class URL {
  static readonly HOSTNAME = '';
  static readonly API_URL = URL.HOSTNAME + '/api';
  static readonly AUTH_URL = URL.API_URL + '/auth';
  static readonly COMPANIES_URL = URL.API_URL + '/companies';
  static readonly TEMPLATE_URL = URL.API_URL + '/templates';
  static readonly FORM_URL = URL.API_URL + '/forms';
  static readonly USER_URL = URL.API_URL + '/users';
  static readonly FORM_SECTIONS_URL = URL.FORM_URL + '/sections';
}
