import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArticleEditorComponent, ArticleListComponent } from '@components';

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