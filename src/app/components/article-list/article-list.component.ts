import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ArticleService } from '../../services/article.service';
import { Article } from '../../models/article.model';
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
  ) {}

  ngOnInit() {
    this.loadArticles();
  }

  loadArticles() {
    this.articles = this.articleService.getAll();
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
    this.loadArticles();
  }
}
