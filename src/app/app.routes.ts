import { Routes } from '@angular/router';
import { ArticleListComponent } from './components/article-list/article-list.component';
import { ArticleEditorComponent } from './components/article-editor/article-editor.component';
import { RoutePaths } from './models/route-paths.model';

export const routes: Routes = [
  { path: '', redirectTo: `/${RoutePaths.Articles}`, pathMatch: 'full' },
  { path: RoutePaths.Articles, component: ArticleListComponent },
  { path: RoutePaths.ArticleById, component: ArticleEditorComponent },
];
