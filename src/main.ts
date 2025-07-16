import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app.config';
import { AppComponent } from './app.component';
import { registerLocaleData } from '@angular/common';
import * as fr from '@angular/common/locales/fr';
import { OpenAPI } from './app/api/core/OpenAPI';
import { environment } from './environments/environment';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';

OpenAPI.BASE = environment.BACK_URL;
ModuleRegistry.registerModules([AllCommunityModule]);

registerLocaleData(fr.default);

bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));

// ng s --host 0.0.0.0 --port 4200
