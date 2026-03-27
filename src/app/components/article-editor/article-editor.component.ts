import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Annotation, Article, RoutePaths } from '@models';
import { StoreService } from '@services';

@Component({
  selector: 'app-article-editor',
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: './article-editor.component.html',
  styleUrl: './article-editor.component.scss',
})
export class ArticleEditorComponent implements OnInit, AfterViewInit {
  @ViewChild('contentEditable', { static: true }) contentEditable?: ElementRef;
  article: Article = { id: '', title: '', content: '' };
  annotations: Annotation[] = [];
  showAnnotationForm = false;
  selectedRange: Range | null = null;
  editingAnnotation: Annotation | null = null;
  annotationColor = '#ffff00';
  annotationNote = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: StoreService,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const existingArticle = this.store.getArticleById(id);
      if (existingArticle) {
        this.article = { ...existingArticle };
        this.annotations = this.store.getAnnotationsByArticle(id);
      }
    }
  }

  ngAfterViewInit(): void {
    this.renderAnnotations();
  }

  onTitleChange(event: Event): void {
    this.article.title = (event.target as HTMLInputElement).value;
  }

  onContentInput(event: Event): void {
    this.article.content = (event.target as HTMLElement).textContent || '';
  }

  onMouseUp(): void {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      if (!range.collapsed) {
        this.selectedRange = range;
        this.showAnnotationForm = true;
      }
    }
  }

  addAnnotation(): void {
    if (!this.annotationNote.trim()) {
      return;
    }

    if (this.editingAnnotation) {
      const annotation = this.editingAnnotation;
      annotation.color = this.annotationColor;
      annotation.note = this.annotationNote;

      this.store.saveAnnotation(annotation);
      this.annotations = this.annotations.map((a) => (a.id === annotation.id ? annotation : a));
      this.renderAnnotations();
      this.editingAnnotation = null;
      this.showAnnotationForm = false;
      this.annotationNote = '';
      return;
    }

    if (this.selectedRange) {
      const container = this.contentEditable?.nativeElement;
      const startOffset = this.getOffset(
        container,
        this.selectedRange.startContainer,
        this.selectedRange.startOffset,
      );
      const endOffset = this.getOffset(
        container,
        this.selectedRange.endContainer,
        this.selectedRange.endOffset,
      );

      const annotation: Annotation = {
        id: Date.now().toString(),
        articleId: this.article.id,
        startOffset,
        endOffset,
        color: this.annotationColor,
        note: this.annotationNote,
      };

      this.store.saveAnnotation(annotation);
      this.annotations.push(annotation);
      this.renderAnnotations();
      this.showAnnotationForm = false;
      this.annotationNote = '';
      window.getSelection()?.removeAllRanges();
    }
  }

  cancelAnnotation(): void {
    this.showAnnotationForm = false;
    this.annotationNote = '';
    this.editingAnnotation = null;
    window.getSelection()?.removeAllRanges();
  }

  editAnnotation(annotation: Annotation): void {
    this.editingAnnotation = annotation;
    this.annotationColor = annotation.color;
    this.annotationNote = annotation.note;
    this.showAnnotationForm = true;
  }

  deleteAnnotation(annotation: Annotation): void {
    if (confirm('Удалить аннотацию?')) {
      this.store.deleteAnnotation(annotation.id);
      this.annotations = this.annotations.filter((a) => a.id !== annotation.id);
      this.renderAnnotations();
    }
  }

  private getOffset(container: Node, node: Node, offset: number): number {
    let totalOffset = 0;
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null);
    let currentNode = walker.nextNode();
    while (currentNode) {
      if (currentNode === node) {
        return totalOffset + offset;
      }
      totalOffset += currentNode.textContent?.length || 0;
      currentNode = walker.nextNode();
    }
    return totalOffset;
  }

  private renderAnnotations(): void {
    const container = this.contentEditable?.nativeElement;
    if (!container) {
      return;
    }
    container.innerText = this.article.content;
    container.style.whiteSpace = 'pre-wrap';

    this.annotations.forEach((annotation) => {
      const range = document.createRange();
      const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null);
      let currentOffset = 0;
      let startNode: Node | null = null;
      let startOffset = 0;
      let endNode: Node | null = null;
      let endOffset = 0;

      let node = walker.nextNode();
      while (node) {
        const nodeLength = node.textContent?.length || 0;
        if (!startNode && currentOffset + nodeLength > annotation.startOffset) {
          startNode = node;
          startOffset = annotation.startOffset - currentOffset;
        }
        if (!endNode && currentOffset + nodeLength >= annotation.endOffset) {
          endNode = node;
          endOffset = annotation.endOffset - currentOffset;
          break;
        }
        currentOffset += nodeLength;
        node = walker.nextNode();
      }

      if (startNode && endNode) {
        range.setStart(startNode, startOffset);
        range.setEnd(endNode, endOffset);
        const span = document.createElement('span');
        span.style.backgroundColor = annotation.color;
        span.style.cursor = 'pointer';
        span.title = annotation.note; // Simple tooltip
        try {
          range.surroundContents(span);
        } catch (e) {
          // Skip if range partially selects non-Text node
        }
      }
    });
  }

  saveArticle(): void {
    const container = this.contentEditable?.nativeElement;
    if (!container) {
      return;
    }
    this.article.content = container.textContent || '';
    this.store.saveArticle(this.article);
    this.router.navigate([`/${RoutePaths.Articles}`]);
  }

  backToList(): void {
    this.router.navigate([`/${RoutePaths.Articles}`]);
  }
}
