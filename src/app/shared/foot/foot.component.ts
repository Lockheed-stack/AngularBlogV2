import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-foot',
  templateUrl: './foot.component.html',
  styleUrls: ['./foot.component.css']
})
export class FootComponent {
  @Input() scrollTopAnchor:HTMLElement
  localDate: Date = new Date();


  backToTop() {
    
    this.scrollTopAnchor.scrollIntoView({
      behavior:'smooth',
      block:'start',
      inline:'center'
    })
    console.log(document.documentElement.scrollTop)
  }
}
