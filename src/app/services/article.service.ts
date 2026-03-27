import { Injectable } from '@angular/core';
import { Article } from '@models';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ArticleService {
  private storageKey = 'articles';
  private articlesSubject = new BehaviorSubject<Article[]>(this.getAll());

  get articles$(): Observable<Article[]> {
    return this.articlesSubject.asObservable();
  }

  getAll(): Article[] {
    return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
  }

  getById(id: string): Article | null {
    return this.getAll().find((a) => a.id === id) || null;
  }

  save(article: Article) {
    const articles = this.getAll();
    const idx = articles.findIndex((a) => a.id === article.id);
    if (idx > -1) {
      articles[idx] = article;
    } else {
      articles.push(article);
    }
    localStorage.setItem(this.storageKey, JSON.stringify(articles));
    this.articlesSubject.next(articles);
  }

  delete(id: string) {
    const articles = this.getAll().filter((a) => a.id !== id);
    localStorage.setItem(this.storageKey, JSON.stringify(articles));
    this.articlesSubject.next(articles);
  }
}