import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, } from '@angular/core';
import { MarkdownService } from 'ngx-markdown';
import { ArticlesService, article } from '../services/articles.service';
import { ActivatedRoute } from '@angular/router';
import hljs from 'highlight.js/lib/common';
import hljs_dockerfile from 'highlight.js/lib/languages/dockerfile'
import { MediaMatcher } from '@angular/cdk/layout';
import { Stack } from './data_structure_stack';
import { CdkDragEnd, CdkDragStart } from '@angular/cdk/drag-drop';

export interface Title {
  level: number,
  TitleId: string,
  TitleName: string,
}



@Component({
  selector: 'app-blog-display',
  templateUrl: './blog-display.component.html',
  styleUrls: ['./blog-display.component.css'],
})
export class BlogDisplayComponent implements OnInit, AfterViewInit, OnDestroy {

  //markdown variable
  markdownData: string = "";
  onTitleLoading: boolean = true;
  onContentLoading: boolean = true;
  isReady: boolean = false;

  // anchor variable
  titleArray: Array<Title> = [];
  titleNum: number = 0;

  // article variable
  articleId: number = 0;
  articleTitle: string = "";
  articleDesc: string = "";
  articlePv: number = 0;
  articleInfo: article;
  // bookmark
  showBookmark: boolean = false;
  isDragBookmark: boolean = false;

  // mobile support
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;


  constructor(
    private markdownService: MarkdownService,
    private articleService: ArticlesService,
    private route: ActivatedRoute,
    changeDetectorRef: ChangeDetectorRef, media: MediaMatcher
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 400px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener("change", this._mobileQueryListener);
  }


  // ------------------ markdown process ---------------------
  initAnchorAndMarkdownValue() {
    this.markdownData = "";
    this.onContentLoading = true;
    this.onTitleLoading = true;
    this.isReady = false;

    this.titleArray = [];
    this.titleNum = 0;
  }
  onReady() {
    this.ngAfterViewInit()
  }
  onScroll(titleId: string) {
    const element = document.getElementById(titleId);
    element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'start' });
  }

  renderHeading() {
    const stack = new Stack<Title>();
    this.markdownService.renderer.heading = (text: string, level: number) => {
      this.titleNum++;

      const title: Title = {
        level: level,
        TitleId: "title".concat(String(this.titleNum)),
        TitleName: text,
      }
      this.titleArray.push(title);

      return '<h' + level + ' id="' + text + '">' +
        '<a id="title' + (this.titleNum) + '" #title' + (this.titleNum) + '>' +
        '</a>' + text +
        '</h' + level + '>';
    };
    this.onContentLoading = false;
  }

  registerNewSupportedHighlight() {
    hljs.registerLanguage('dockerfile', hljs_dockerfile);
  }
  // -------------------- markdown process --------------------------

  // ---------------------- bookmark --------------------------------
  onMouseOver(){
    this.isDragBookmark = false;
  }
  onBookMarkDrag(event: CdkDragEnd): void {
    if (Math.abs(event.distance.x) > 10 || Math.abs(event.distance.y) > 10) {
      this.isDragBookmark = true;
    }
  }
  onBookMarkClick() {
    if (!this.isDragBookmark) {
      this.showBookmark = !this.showBookmark;
    }
  }
  // ---------------------- bookmark --------------------------------
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.isReady = true;
      document.querySelectorAll('pre').forEach((el: HTMLElement) => {
        el.style.background = '#033456';
        hljs.highlightElement(el.firstElementChild as HTMLElement);
      })
    }, 1000);

    setTimeout(() => {
      this.onContentLoading = false;
    }, 3000);

  }

  ngOnInit(): void {

    this.registerNewSupportedHighlight()
    this.route.params.subscribe({
      next: (value) => {
        this.initAnchorAndMarkdownValue();
        this.articleId = value['id'];
        this.articleService.getSingleArticleInfo(this.articleId).subscribe(
          {
            next: (value) => {
              if (value === null || value.message != "OK") {
                this.markdownData = "# 文章不见了";
              }
              else {
                this.articleInfo = value;
                this.articleTitle = value.data["title"];
                this.articleDesc = value.data["desc"];
                this.articlePv = value.data["pv"]
                this.onTitleLoading = false;

                if (value.data["content"] === "") {
                  this.markdownData = "# 暂无正文内容"
                } else {
                  // the website is https, but this request is http. It should be convert in nginx.
                  var url: string = value.data["content"];
                  if (url.startsWith("http://", 0)) {
                    url = url.substring(7,);
                    url = "https://" + url;
                  }
                  this.articleService.getSingleArticleContent(url).subscribe({
                    next: (content) => {
                      if (content === null) {
                        this.markdownData = "# 文章不见了";
                      } else {
                        this.markdownData = content;
                      }
                    },
                    error: (contentErr) => {
                      this.markdownData = "# 文章不见了";
                      console.log(contentErr);
                    }
                  })
                }
              }
              this.renderHeading()

            },
            error: (err) => {
              this.markdownData = "# 文章不见了";
              this.onContentLoading = false;
              console.log(err)
            }
          }
        )
      }
    })
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeEventListener("change", this._mobileQueryListener);
  }

}
