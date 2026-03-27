import { Component, OnInit, DestroyRef } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ArticleService } from '../../services/article.service';
import { AnnotationService } from '../../services/annotation.service';
import { Article } from '../../models/article.model';
import { Annotation } from '../../models/annotation.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-article-list',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './article-list.component.html',
  styleUrl: './article-list.component.scss',
})
export class ArticleListComponent implements OnInit {
  articles: Article[] = [];

  constructor(
    private articleService: ArticleService,
    private router: Router,
    private annotationService: AnnotationService,
    private sanitizer: DomSanitizer,
    private destroyRef: DestroyRef,
  ) {}

  ngOnInit(): void {
    this.articleService.articles$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((articles) => {
        this.articles = articles;
      });
  }

  getAnnotatedContent(article: Article): SafeHtml {
    const annotations = this.annotationService.getByArticle(article.id);
    if (annotations.length === 0) {
      return this.sanitizer.bypassSecurityTrustHtml(article.content);
    }

    let content = article.content;
    annotations.sort((a, b) => b.startOffset - a.startOffset);

    for (const annotation of annotations) {
      if (
        annotation.startOffset >= content.length ||
        annotation.endOffset > content.length ||
        annotation.startOffset >= annotation.endOffset
      ) {
        continue;
      }
      const before = content.substring(0, annotation.startOffset);
      const highlighted = content.substring(annotation.startOffset, annotation.endOffset);
      const after = content.substring(annotation.endOffset);
      content = `${before}<span style="background-color: ${annotation.color}; cursor: pointer;" title="${annotation.note}">${highlighted}</span>${after}`;
    }

    return this.sanitizer.bypassSecurityTrustHtml(content);
  }

  createArticle(): void {
    const newArticle: Article = {
      id: Date.now().toString(),
      title: 'New Article',
      content: '',
    };
    this.articleService.save(newArticle);
    this.router.navigate(['/articles', newArticle.id]);
  }

  editArticle(id: string): void {
    this.router.navigate(['/articles', id]);
  }

  deleteArticle(id: string): void {
    if (confirm('Удалить статью?')) {
      this.articleService.delete(id);
    }
  }
}
