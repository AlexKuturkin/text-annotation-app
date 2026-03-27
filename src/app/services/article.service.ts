import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Article } from '../models/article.model';

@Injectable({ providedIn: 'root' })
export class ArticleService {
  private storageKey = 'articles';
  private articlesSubject = new BehaviorSubject<Article[]>(this.getAll());

  get articles$(): Observable<Article[]> {
    return this.articlesSubject.asObservable();
  }

  getAll(): Article[] {
    const articles = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
    articles.forEach((article: Article) => {
      article.content = this.stripHtml(article.content);
    });
    return articles;
  }

  getById(id: string): Article | undefined {
    return this.getAll().find((a) => a.id === id);
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

  private stripHtml(html: string): string {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  }
}