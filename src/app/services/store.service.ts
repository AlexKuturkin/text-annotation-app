import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Article } from '../models/article.model';
import { Annotation } from '../models/annotation.model';

const ARTICLES_KEY = 'articles';
const ANNOTATIONS_KEY = 'annotations';

@Injectable({ providedIn: 'root' })
export class StoreService {
  private articlesSubject = new BehaviorSubject<Article[]>(this.loadArticles());
  private annotationsSubject = new BehaviorSubject<Annotation[]>(this.loadAnnotations());

  get articles$(): Observable<Article[]> {
    return this.articlesSubject.asObservable();
  }

  get annotations$(): Observable<Annotation[]> {
    return this.annotationsSubject.asObservable();
  }

  getAllArticles(): Article[] {
    return this.articlesSubject.getValue();
  }

  getArticleById(id: string): Article | null {
    return this.getAllArticles().find((a) => a.id === id) || null;
  }

  saveArticle(article: Article): void {
    const articles = this.getAllArticles();
    const idx = articles.findIndex((a) => a.id === article.id);
    if (idx > -1) {
      articles[idx] = article;
    } else {
      articles.push(article);
    }
    this.persistArticles(articles);
    this.articlesSubject.next([...articles]);
  }

  deleteArticle(id: string): void {
    const articles = this.getAllArticles().filter((a) => a.id !== id);
    this.persistArticles(articles);
    this.articlesSubject.next([...articles]);

    const annotations = this.getAllAnnotations().filter((a) => a.articleId !== id);
    this.persistAnnotations(annotations);
    this.annotationsSubject.next([...annotations]);
  }

  getAllAnnotations(): Annotation[] {
    return this.annotationsSubject.getValue();
  }

  getAnnotationsByArticle(articleId: string): Annotation[] {
    return this.getAllAnnotations().filter((a) => a.articleId === articleId);
  }

  saveAnnotation(annotation: Annotation): void {
    const annotations = this.getAllAnnotations();
    const idx = annotations.findIndex((a) => a.id === annotation.id);
    if (idx > -1) {
      annotations[idx] = annotation;
    } else {
      annotations.push(annotation);
    }
    this.persistAnnotations(annotations);
    this.annotationsSubject.next([...annotations]);
  }

  deleteAnnotation(id: string): void {
    const annotations = this.getAllAnnotations().filter((a) => a.id !== id);
    this.persistAnnotations(annotations);
    this.annotationsSubject.next([...annotations]);
  }

  private loadArticles(): Article[] {
    try {
      return JSON.parse(localStorage.getItem(ARTICLES_KEY) || '[]') as Article[];
    } catch {
      return [];
    }
  }

  private loadAnnotations(): Annotation[] {
    try {
      return JSON.parse(localStorage.getItem(ANNOTATIONS_KEY) || '[]') as Annotation[];
    } catch {
      return [];
    }
  }

  private persistArticles(articles: Article[]): void {
    localStorage.setItem(ARTICLES_KEY, JSON.stringify(articles));
  }

  private persistAnnotations(annotations: Annotation[]): void {
    localStorage.setItem(ANNOTATIONS_KEY, JSON.stringify(annotations));
  }
}
