import { Routes } from '@angular/router';
import { ArticleEditorComponent, ArticleListComponent } from '@components';
import { RoutePaths } from '@models';

export const routes: Routes = [
  { path: '', redirectTo: `/${RoutePaths.Articles}`, pathMatch: 'full' },
  { path: RoutePaths.Articles, component: ArticleListComponent },
  { path: RoutePaths.ArticleById, component: ArticleEditorComponent },
];
