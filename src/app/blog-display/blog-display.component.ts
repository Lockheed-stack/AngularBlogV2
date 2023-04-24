import { AfterViewInit, ChangeDetectorRef, Component, OnChanges, OnDestroy, OnInit, SimpleChanges, } from '@angular/core';
import { KatexOptions, MarkdownService } from 'ngx-markdown';
import { ArticlesService, article } from '../services/articles.service';
import { ActivatedRoute } from '@angular/router';
import hljs from 'highlight.js/lib/common';
import hljs_dockerfile from 'highlight.js/lib/languages/dockerfile'
import { MediaMatcher } from '@angular/cdk/layout';
import { GlobalService } from '../services/global.service';


interface subTitle {
  subTitleId: string,
  subTitleName: string
}
interface Title {
  TitleId: string,
  TitleName: string,
  subTitles: subTitle[]
}



@Component({
  selector: 'app-blog-display',
  templateUrl: './blog-display.component.html',
  styleUrls: ['./blog-display.component.css']
})
export class BlogDisplayComponent implements OnInit, AfterViewInit,OnDestroy {

  //markdown variable
  markdownData: string = "";
  onTitleLoading: boolean = true;
  onContentLoading: boolean = true;
  isReady: boolean = false;

  // anchor variable
  subTitle: {}
  titleArray: Array<Title> = [];
  titleNum: number = 0;
  previewTitleLevel: number = -1;
  findSubTitle: boolean = false;

  // article variable
  articleId: number = 0;
  articleTitle: string = "";
  articleDesc: string = "";
  articleInfo: article;


  // mobile support
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;


  constructor(
    private markdownService: MarkdownService,
    private articleService: ArticlesService,
    private route: ActivatedRoute,
    private globalVar: GlobalService,
    changeDetectorRef: ChangeDetectorRef, media: MediaMatcher
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener("change",this._mobileQueryListener);
  }


  // ------------------ markdown process ---------------------
  initAnchorAndMarkdownValue() {
    this.markdownData = "";
    this.onContentLoading = true;
    this.onTitleLoading = true;
    this.isReady = false;

    this.subTitle = {};
    this.titleArray = [];
    this.titleNum = 0;
    this.previewTitleLevel = -1;
    this.findSubTitle = false;
  }
  onReady() {
    this.ngAfterViewInit()
  }
  onScroll(titleId: string) {
    const element = document.getElementById(titleId);
    element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'start' });
  }

  renderHeading() {
    this.markdownService.renderer.heading = (text: string, level: number) => {
      this.titleNum++;
      if ((this.previewTitleLevel >= level || this.previewTitleLevel === -1) && !this.findSubTitle) { // h1>h2>..>h6
        const title: Title = {
          TitleId: "title".concat(String(this.titleNum)),
          TitleName: text,
          subTitles: []
        }
        this.titleArray.push(title)
      } else {
        if (level < this.previewTitleLevel) {
          this.findSubTitle = false;
          const title: Title = {
            TitleId: "title".concat(String(this.titleNum)),
            TitleName: text,
            subTitles: []
          }
          this.titleArray.push(title)
        }
        else {
          this.findSubTitle = true;
          const subtitle: subTitle = {
            subTitleId: "title".concat(String(this.titleNum)),
            subTitleName: text
          }
          const loc: number = this.titleArray.length <= 0 ? 0 : (this.titleArray.length - 1)
          this.titleArray[loc].subTitles.push(subtitle);
        }
      }
      this.previewTitleLevel = level;

      // const escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');
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
                this.onTitleLoading = false;

                if (value.data["content"] === "") {
                  this.markdownData = "# 暂无正文内容"
                } else {
                  // the website is https, but this request is http. It should be convert in nginx.
                  var url: string = value.data["content"];
                  if (url.startsWith("http://", 0)) {
                    url = url.substring(7,);
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
    this.mobileQuery.removeEventListener("change",this._mobileQueryListener);
  }
}
