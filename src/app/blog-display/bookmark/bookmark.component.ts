import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

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
  selector: 'app-bookmark',
  templateUrl: './bookmark.component.html',
  styleUrls: ['./bookmark.component.css']
})
export class BookmarkComponent implements OnChanges {

  @Input() inputArray: Array<Title>;
  @Input() contentLoading: boolean;

  popoverVisible: boolean = false;

  isShow(){
    this.popoverVisible = true;
  }

  onScroll(titleId: string) {
    
    const element = document.getElementById(titleId);
    element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'start' });
    setTimeout(() => {
      this.popoverVisible = false;
    }, 500);
  }
  ngOnChanges(changes: SimpleChanges): void {
    // console.log(changes["contentLoading"])
  }
}
