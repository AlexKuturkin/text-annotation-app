import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ArticleService } from '../../services/article.service';
import { AnnotationService } from '../../services/annotation.service';
import { Article } from '../../models/article.model';
import { Annotation } from '../../models/annotation.model';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-article-list',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './article-list.component.html',
  styleUrl: './article-list.component.scss',
})
export class ArticleListComponent implements OnInit, OnDestroy {
  articles: Article[] = [];
  private subscription: Subscription = new Subscription();

  constructor(
    private articleService: ArticleService,
    private router: Router,
    private annotationService: AnnotationService,
  ) {}

  ngOnInit() {
    this.subscription = this.articleService.articles$.subscribe((articles) => {
      this.articles = articles;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getAnnotatedContent(article: Article): string {
    const annotations = this.annotationService.getByArticle(article.id);
    if (annotations.length === 0) {
      return article.content;
    }

    let content = article.content;
    // Sort annotations by startOffset descending to avoid offset shifts
    annotations.sort((a, b) => b.startOffset - a.startOffset);

    for (const annotation of annotations) {
      if (
        annotation.startOffset >= content.length ||
        annotation.endOffset > content.length ||
        annotation.startOffset >= annotation.endOffset
      ) {
        continue; // Skip invalid annotations
      }
      const before = content.substring(0, annotation.startOffset);
      const highlighted = content.substring(annotation.startOffset, annotation.endOffset);
      const after = content.substring(annotation.endOffset);
      content = `${before}<span style="background-color: ${annotation.color};" title="${annotation.note}">${highlighted}</span>${after}`;
    }

    return content;
  }

  createArticle() {
    const newArticle: Article = {
      id: Date.now().toString(),
      title: 'New Article',
      content: '',
    };
    this.articleService.save(newArticle);
    this.router.navigate(['/articles', newArticle.id]);
  }

  editArticle(id: string) {
    this.router.navigate(['/articles', id]);
  }

  deleteArticle(id: string) {
    this.articleService.delete(id);
  }
}
