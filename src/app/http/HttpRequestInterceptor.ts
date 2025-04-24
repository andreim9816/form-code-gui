import {HttpInterceptorFn} from '@angular/common/http';
import {finalize} from 'rxjs';
import {inject} from '@angular/core';
import {LoadingService} from './LoadingService';

let totalRequests = 0;
let requestsCompleted = 0;

export const httpRequestInterceptor: HttpInterceptorFn = (req, next) => {
  const loader = inject(LoadingService);

  loader.show();
  totalRequests++;

  return next(req).pipe(
    finalize(() => {
      requestsCompleted++;

      // console.log(requestsCompleted, totalRequests);

      if (requestsCompleted === totalRequests) {
        loader.hide();
        totalRequests = 0;
        requestsCompleted = 0;
      }
    })
  );
};
