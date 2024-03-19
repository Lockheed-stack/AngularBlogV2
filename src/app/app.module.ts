import { NgModule, SecurityContext } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { zh_CN } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { NgIconsModule } from '@ng-icons/core';
import {bootstrapCheckCircleFill, bootstrapEyeFill, bootstrapGithub, bootstrapHeart, 
  bootstrapHeartFill, bootstrapHouse, bootstrapShare, bootstrapTools, 
  bootstrapWechat,bootstrapXCircleFill,bootstrapJournalBookmarkFill} from '@ng-icons/bootstrap-icons'

// custom components
import { BlogAdminComponent } from './blog-admin/blog-admin.component';
import { LoginComponent } from './login/login.component';
import { AddArticleComponent } from './blog-admin/add-article/add-article.component';
import { ArticleListComponent } from './blog-admin/article-list/article-list.component';
import { CategoriesComponent } from './blog-admin/categories/categories.component';
import { AuthInterceptorService } from './services/auth-interceptor.service';
import { BlogDisplayComponent } from './blog-display/blog-display.component';

// ng zorro
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzImageModule } from 'ng-zorro-antd/image';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzQRCodeModule } from 'ng-zorro-antd/qr-code';

// angular material
import { MatFormFieldModule, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import {MatTreeModule} from '@angular/material/tree';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatTooltipModule} from '@angular/material/tooltip';
import { CdkDrag } from '@angular/cdk/drag-drop';
import {CdkListboxModule} from '@angular/cdk/listbox';

// prime ng
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { ListboxModule } from 'primeng/listbox';

// markdown
import { MarkdownModule, MARKED_OPTIONS } from 'ngx-markdown';
import { SideNavComponent } from './shared/side-nav/side-nav.component';
import { BlogIndexComponent } from './blog-index/blog-index.component';
import { NotFoundPageComponent } from './shared/not-found-page/not-found-page.component';
import { ToolBarComponent } from './shared/tool-bar/tool-bar.component';
import { AddCatalogComponent } from './blog-admin/add-catalog/add-catalog.component';
import { FootComponent } from './shared/foot/foot.component';
import { BlogDashboardComponent } from './blog-dashboard/blog-dashboard.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';


registerLocaleData(zh);

@NgModule({
  declarations: [
    AppComponent,
    BlogAdminComponent,
    LoginComponent,
    AddArticleComponent,
    ArticleListComponent,
    CategoriesComponent,
    BlogDisplayComponent,
    SideNavComponent,
    BlogIndexComponent,
    NotFoundPageComponent,
    ToolBarComponent,
    AddCatalogComponent,
    FootComponent,
    BlogDashboardComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgIconsModule.withIcons({
      bootstrapGithub,
      bootstrapWechat,
      bootstrapHeart,
      bootstrapHeartFill,
      bootstrapShare,
      bootstrapTools,
      bootstrapHouse,
      bootstrapEyeFill,
      bootstrapCheckCircleFill,
      bootstrapXCircleFill,
      bootstrapJournalBookmarkFill
    }),

    NzLayoutModule,
    NzMenuModule,
    NzBreadCrumbModule,
    NzIconModule,
    NzSpaceModule,
    NzGridModule,
    NzAlertModule,
    NzButtonModule,
    NzToolTipModule,
    NzTableModule,
    NzDividerModule,
    NzInputModule,
    NzPaginationModule,
    NzModalModule,
    NzFormModule,
    NzUploadModule,
    NzSelectModule,
    NzImageModule,
    NzSkeletonModule,
    NzPopoverModule,
    NzCardModule,
    NzQRCodeModule,

    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatRadioModule,
    MatCardModule,
    MatCheckboxModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatExpansionModule,
    MatTreeModule,
    MatGridListModule,
    MatTooltipModule,
    CdkDrag,
    CdkListboxModule,

    SidebarModule,
    ButtonModule,
    DividerModule,
    ListboxModule,

    MarkdownModule.forRoot({
      loader: HttpClient,
      sanitize: SecurityContext.NONE,
      markedOptions: {
        provide: MARKED_OPTIONS,
        useValue: {
          gfm: true,
          breaks: false,
          pedantic: false,
          smartLists: true,
          smartypants: false,
        },
      },
    }),

  ],
  providers: [
    { provide: NZ_I18N, useValue: zh_CN },
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' } },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true },
    provideAnimationsAsync(),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
