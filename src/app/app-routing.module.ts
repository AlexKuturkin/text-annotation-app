import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArticleListComponent } from './components/article-list';
import { ArticleEditorComponent } from './components/article-editor';

const routes: Routes = [
  { path: '', redirectTo: '/articles', pathMatch: 'full' },
  { path: 'articles', component: ArticleListComponent },
  { path: 'articles/edit/:id', component: ArticleEditorComponent },
  { path: 'articles/new', component: ArticleEditorComponent },
  { path: '**', redirectTo: '/articles' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }