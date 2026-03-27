import { Injectable } from '@angular/core';
import { Article } from '../models/article.model';

@Injectable({ providedIn: 'root' })
export class ArticleService {
  private storageKey = 'articles';

  getAll(): Article[] {
    return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
  }

  getById(id: string): Article | undefined {
    return this.getAll().find(a => a.id === id);
  }

  save(article: Article) {
    const articles = this.getAll();
    const idx = articles.findIndex(a => a.id === article.id);
    if (idx > -1) {
      articles[idx] = article;
    } else {
      articles.push(article);
    }
    localStorage.setItem(this.storageKey, JSON.stringify(articles));
  }

  delete(id: string) {
    const articles = this.getAll().filter(a => a.id !== id);
    localStorage.setItem(this.storageKey, JSON.stringify(articles));
  }
}