import { NgModule } from '@angular/core';
import { Routes, RouterModule, ExtraOptions } from '@angular/router';
import { AddArticleComponent } from './blog-admin/add-article/add-article.component';
import { ArticleListComponent } from './blog-admin/article-list/article-list.component';
import { BlogAdminComponent } from './blog-admin/blog-admin.component';
import { CategoriesComponent } from './blog-admin/categories/categories.component';
import { DashboardComponent } from './blog-admin/dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth-guard.guard';
import { BlogDisplayComponent } from './blog-display/blog-display.component';
import { BlogIndexComponent } from './blog-index/blog-index.component';
import { NotFoundPageComponent } from './shared/not-found-page/not-found-page.component';
import { AddCatalogComponent } from './blog-admin/add-catalog/add-catalog.component';


const routes: Routes = [
  {path:"",component:BlogIndexComponent},
  {path:"article/:id",component:BlogDisplayComponent},
  {path:"login",component:LoginComponent},
  {path:"blogadmin",component:BlogAdminComponent,canActivate:[AuthGuard],
  canActivateChild:[AuthGuard],
  children:[
    {path:"dashboard",component:DashboardComponent},
    {path:"addArticle",component:AddArticleComponent},
    {path:"articleList",component:ArticleListComponent},
    {path:"categories",component:CategoriesComponent},
    {path:"addCatalog",component:AddCatalogComponent},
    {path:"**",redirectTo:"dashboard"},
  ]},
  {path:"**",component:NotFoundPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
