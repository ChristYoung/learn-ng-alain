import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { ACLService } from '@delon/acl';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { ALAIN_I18N_TOKEN, MenuService, SettingsService, TitleService } from '@delon/theme';
import { zip } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { NzIconService } from 'ng-zorro-antd/icon';
import { ICONS } from '../../../style-icons';
import { ICONS_AUTO } from '../../../style-icons-auto';

/**
 * Used for application startup
 * Generally used to get the basic data of the application, like: Menu Data, User Data, etc.
 */
@Injectable()
export class StartupService {
  constructor(
    iconSrv: NzIconService,
    private menuService: MenuService,
    private settingService: SettingsService,
    private aclService: ACLService,
    private titleService: TitleService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    private httpClient: HttpClient,
    private injector: Injector
  ) {
    iconSrv.addIcon(...ICONS_AUTO, ...ICONS);
  }

  private viaHttp(resolve: any, reject: any) {
    zip(
      this.httpClient.get('assets/tmp/app-data.json')
    ).pipe(
      catchError((res) => {
        console.warn(`StartupService.load: Network request failed`, res);
        resolve(null);
        return [];
      })
    ).subscribe(([appData]) => {

      // Application data
      const res: any = appData;
      // Application information: including site name, description, year
      this.settingService.setApp(res.app);
      // layout infomation: using fixed
      this.settingService.setLayout(`fixed`, true);
      // User information: including name, avatar, email address
      this.settingService.setUser(res.user);
      // ACL: Set the permissions to full, https://ng-alain.com/acl/getting-started
      this.aclService.setFull(true);
      // Menu data, https://ng-alain.com/theme/menu
      this.menuService.add(res.menu);
      // Can be set page suffix title, https://ng-alain.com/theme/title
      this.titleService.suffix = res.app.name;
    },
      () => { },
      () => {
        resolve(null);
      });
  }

  load(): Promise<any> {
    console.log(location.href);
    // only works with promises
    // https://github.com/angular/angular/issues/15088
    return new Promise((resolve, reject) => {
      this.viaHttp(resolve, reject);
    });
  }
}
