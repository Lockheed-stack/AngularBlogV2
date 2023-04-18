import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { CatalogSubmitFormat, CategoriesService } from 'src/app/services/categories.service';

@Component({
  selector: 'app-add-catalog',
  templateUrl: './add-catalog.component.html',
  styleUrls: ['./add-catalog.component.css']
})
export class AddCatalogComponent implements OnInit {

  catalogFormGroup: FormGroup;
  catalogId: number = 0;
  name: string = '';
  errTips: string = '';

  constructor(
    private route: ActivatedRoute,
    private modal: NzModalService,
    private catalogService: CategoriesService,
  ) { }

  ngOnInit(): void {
    this.catalogFormGroup = new FormGroup(
      {
        'name': new FormControl(null, [Validators.required, this.checkNameIsTheAsBefore.bind(this)])
      }
    )
    if (this.route.snapshot.queryParams['id'] !== undefined) {
      this.catalogId = this.route.snapshot.queryParams['id'];
      this.name = this.route.snapshot.queryParams['name'];
    }

  }

  checkNameIsTheAsBefore(control: FormControl): { [errInfo: string]: boolean } {
    if (control.value === this.name) {
      return { 'theNewNameIsTheSameAsBefore': true };
    }
    return null;
  }


  onCatalogSubmit() {
    if (this.catalogFormGroup.valid) {
      let respondResult: string = "";
      const ref: NzModalRef = this.modal.confirm({
        nzTitle: '提示',
        nzContent: '确定提交吗',
        nzMaskClosable: false,

        nzOnOk: () => new Promise((resolve, reject) => {
          ref.updateConfig({ nzCancelDisabled: true })
          if (this.catalogId === 0) {
            const data: CatalogSubmitFormat = {
              name: this.catalogFormGroup.value['name']
            }
            this.catalogService.addCatalog(data).subscribe({
              next: (value) => {
                respondResult = value['message']
                resolve('OK')
              },
              error: (err: HttpErrorResponse) => {
                respondResult = err.statusText
                reject(err.statusText)
              }
            })
          } else {
            this.catalogService.updateCatalog(this.catalogId, this.catalogFormGroup.get('name').value).subscribe({
              next: (value) => {
                respondResult = value['message']
                resolve('OK')
              },
              error: (err: HttpErrorResponse) => {
                respondResult = err.statusText
                reject(err.statusText)
              }
            })
          }
        }).then(() => {
          if (respondResult === 'OK') {
            if(this.catalogId === 0){
              this.modal.success({ nzTitle: '添加成功' })
            }
            else{
              this.modal.success({ nzTitle: '修改成功' })
            }
          }
          else {
            this.modal.error({ nzTitle: '失败', nzContent: respondResult })
          }
        }).catch((err) => {
          this.modal.error({ nzTitle: '失败', nzContent: err })
        })
      })

    } else {
      Object.values(this.catalogFormGroup.controls).forEach(control => {
        if (control.invalid) {

          if (control.errors['theNewNameIsTheSameAsBefore'] === true) {
            this.errTips = "分类名与之前重复"
          }
          else {
            this.errTips = "标题不能为空"
          }
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

}
