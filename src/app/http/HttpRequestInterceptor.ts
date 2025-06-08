import {HttpInterceptorFn} from '@angular/common/http';
import {finalize, timeout} from 'rxjs';
import {inject} from '@angular/core';
import {LoadingService} from './LoadingService';

let activeRequests = 0;

export const httpRequestInterceptor: HttpInterceptorFn = (req, next) => {
  const loader = inject(LoadingService);

  if (activeRequests === 0) {
    loader.show();
  }

  activeRequests++;

  return next(req).pipe(
    timeout(15000), // if a request takes too long, then after 15s it should throw an error
    finalize(() => {
      activeRequests--;
      if (activeRequests === 0) {
        loader.hide();
      }
    })
  );
}
