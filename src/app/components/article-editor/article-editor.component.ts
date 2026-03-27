import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticleService } from '../../services/article.service';
import { AnnotationService } from '../../services/annotation.service';
import { Article } from '../../models/article.model';
import { Annotation } from '../../models/annotation.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-article-editor',
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: './article-editor.component.html',
  styleUrl: './article-editor.component.scss',
})
export class ArticleEditorComponent implements OnInit, AfterViewInit {
  @ViewChild('contentEditable', { static: true }) contentEditable!: ElementRef;
  article: Article = { id: '', title: '', content: '' };
  annotations: Annotation[] = [];
  showAnnotationForm = false;
  selectedRange: Range | null = null;
  annotationColor = '#ffff00';
  annotationNote = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private articleService: ArticleService,
    private annotationService: AnnotationService,
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const existingArticle = this.articleService.getById(id);
      if (existingArticle) {
        this.article = { ...existingArticle };
        this.annotations = this.annotationService.getByArticle(id);
      }
    }
  }

  ngAfterViewInit() {
    this.renderAnnotations();
  }

  onTitleChange(event: Event) {
    this.article.title = (event.target as HTMLInputElement).value;
  }

  onContentInput(event: Event) {
    this.article.content = (event.target as HTMLElement).textContent || '';
  }

  onMouseUp() {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      if (!range.collapsed) {
        this.selectedRange = range;
        this.showAnnotationForm = true;
      }
    }
  }

  addAnnotation() {
    if (this.selectedRange && this.annotationNote.trim()) {
      const container = this.contentEditable.nativeElement;
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

      this.annotationService.save(annotation);
      this.annotations.push(annotation);
      this.renderAnnotations();
      this.showAnnotationForm = false;
      this.annotationNote = '';
      window.getSelection()?.removeAllRanges();
    }
  }

  cancelAnnotation() {
    this.showAnnotationForm = false;
    this.annotationNote = '';
    window.getSelection()?.removeAllRanges();
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

  private renderAnnotations() {
    const container = this.contentEditable.nativeElement;
    container.innerHTML = this.article.content;

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
        span.title = annotation.note; // Simple tooltip
        try {
          range.surroundContents(span);
        } catch (e) {
          // Skip if range partially selects non-Text node
        }
      }
    });
  }

  saveArticle() {
    this.articleService.save(this.article);
    this.router.navigate(['/articles']);
  }

  backToList() {
    this.router.navigate(['/articles']);
  }
}
