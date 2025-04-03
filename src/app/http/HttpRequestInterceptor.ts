import {HttpInterceptorFn} from '@angular/common/http';

export const httpRequestInterceptor: HttpInterceptorFn = (req, next) => {
  const modifiedReq = req.clone({
    withCredentials: true, // Ensures cookies are sent with requests
  });

  console.log('Intercepted Request:', modifiedReq);
  return next(modifiedReq);
};
