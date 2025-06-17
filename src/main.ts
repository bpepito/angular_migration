import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import { downgradeInjectable, UpgradeModule } from '@angular/upgrade/static';
import { MyServiceService } from './app/service/my-service.service';

import './assets/legacy/js/app.js';
import './assets/legacy/js/controllers/taskController.js';
import './assets/legacy/js/services/taskService.js';

declare var angular: any;

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .then((platformRef) => {
    angular
      .module('taskApp')
      .factory('MyServiceService', downgradeInjectable(MyServiceService));
    const upgrade = platformRef.injector.get(UpgradeModule);
    upgrade.bootstrap(document.body, ['taskApp']);
  })
  .catch((err) => console.error(err));
