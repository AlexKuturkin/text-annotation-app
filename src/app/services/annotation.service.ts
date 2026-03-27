import { Injectable } from '@angular/core';
import { Annotation } from '@models';


@Injectable({ providedIn: 'root' })
export class AnnotationService {
  private storageKey = 'annotations';

  getAll(): Annotation[] {
    return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
  }

  getByArticle(articleId: string): Annotation[] {
    return this.getAll().filter(a => a.articleId === articleId);
  }

  save(annotation: Annotation) {
    const annotations = this.getAll();
    const idx = annotations.findIndex(a => a.id === annotation.id);
    if (idx > -1) {
      annotations[idx] = annotation;
    } else {
      annotations.push(annotation);
    }
    localStorage.setItem(this.storageKey, JSON.stringify(annotations));
  }

  delete(id: string) {
    const annotations = this.getAll().filter(a => a.id !== id);
    localStorage.setItem(this.storageKey, JSON.stringify(annotations));
  }
}