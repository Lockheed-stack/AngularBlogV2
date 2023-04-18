import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-blog-admin',
  templateUrl: './blog-admin.component.html',
  styleUrls: ['./blog-admin.component.css']
})
export class BlogAdminComponent {
  isCollapsed = true;

  constructor(
    private router: Router,
    private modal: NzModalService) { }

  onLogoutClick() {
    const ref: NzModalRef = this.modal.confirm(
      {
        nzTitle: '提示',
        nzContent: '确定退出吗',
        nzMaskClosable: false,
        nzOkDanger: true,
        nzOnOk:()=> new Promise((resolve, reject) => {
          ref.updateConfig({ nzCancelDisabled: true })
          setTimeout(resolve, 500)
        }).then(() => {
          window.sessionStorage.removeItem('token');
          this.router.navigate(['/login']);
        })
      }
    )


  }
}
