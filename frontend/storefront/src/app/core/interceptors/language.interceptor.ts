import { HttpInterceptorFn } from '@angular/common/http';

export const languageInterceptor: HttpInterceptorFn = (req, next) => {
  // Get language directly from localStorage to avoid circular dependency
  // (LanguageService -> TranslateService -> HttpClient -> languageInterceptor)
  const language = typeof window !== 'undefined' 
    ? (localStorage.getItem('language') || 'ar')
    : 'ar';

  const clonedReq = req.clone({
    setHeaders: {
      'Accept-Language': language
    }
  });

  return next(clonedReq);
};
