import { Component, Input, OnInit } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-tool-bar',
  templateUrl: './tool-bar.component.html',
  styleUrls: ['./tool-bar.component.css']
})
export class ToolBarComponent {
  @Input() element: MatSidenav

  constructor(
    private router: Router,
    private globalVar: GlobalService
  ) { }

  QRcodeURL: string = this.globalVar.domain;

  onToggleClicked() {
    this.element.toggle()
  }
  onShareClicked() {
    if (this.router.url.length > 1) {
      this.QRcodeURL = this.QRcodeURL + this.router.url.substring(1);
    }
  }
}
