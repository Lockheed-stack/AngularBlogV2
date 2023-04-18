import { Component, OnInit } from '@angular/core';
import { ArticlesService } from '../services/articles.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalService } from '../services/global.service';

interface RespondData {
  id: number;
  title: string;
  desc: string;
  img: string;
  createdAt: string;
  catalogName: string;
}

@Component({
  selector: 'app-blog-index',
  templateUrl: './blog-index.component.html',
  styleUrls: ['./blog-index.component.css']
})
export class BlogIndexComponent implements OnInit {

  articleData: Array<RespondData> = [];
  iconBtnLikeType: Map<number, string> = new Map<number, string>();
  articleShareSrc: string = this.globalVar.domain;

  breakPoint: number;
  rowHeightRatio: string;
  grid:HTMLElement;
  gridHot:HTMLElement;

  constructor(
    private articlesService: ArticlesService,
    private router: Router,
    private globalVar: GlobalService,
  ) { }

  onTileClick(id: number) {
    this.router.navigate(['article/', id]);
  }

  onLikeClick(id: number) {
    this.iconBtnLikeType.set(id, "bootstrapHeartFill");
  }
  onShareClick(id: number) {
    this.articleShareSrc = this.globalVar.domain + "article/" + String(id);
  }
  onResize(event: Event) {
    this.breakPoint = (event.target["innerWidth"] <= 800) ? 1 : 3;
    var innerWidth: number = event.target["innerWidth"];
    this.setRowHeightRatio(innerWidth);
  }
  setRowHeightRatio(innerWidth: number) {
    if (innerWidth <= 800) {
      this.grid.style.height = "1600px";
      this.gridHot.style.height = "1600px";
    } else{
      this.grid.style.height = "600px";
      this.gridHot.style.height = "600px";
    }
  }

  ngOnInit(): void {
    this.breakPoint = (window.innerWidth <= 600) ? 1 : 3;
    this.grid = document.getElementById("grid-list");
    this.gridHot = document.getElementById("grid-list-hot");
    this.setRowHeightRatio(window.innerWidth);

    this.articlesService.getLast3ArticlesInfo().subscribe({
      next: (value) => {
        if (value === null) {
          console.log(value)
        } else {
          for (let val of value.data) {

            // the website is https, but this request is http. It should be convert in nginx.
            let tmp: string = val['img'];
            // if (!tmp.startsWith("http", 0) && tmp !== "") {
            //   tmp = "http://".concat(tmp)
            // }

            const item: RespondData = {
              id: val['ID'],
              title: val['title'],
              desc: val['desc'],
              img: tmp,
              createdAt: val['Catalog']['CreatedAt'],
              catalogName: val['Catalog']['name']
            }
            this.articleData.push(item);
            this.iconBtnLikeType.set(val['ID'], "bootstrapHeart");
          }
        }
        // console.log(this.articleData)
      },
      error: (err) => {
        console.log(err)
      }
    })
  }
}
