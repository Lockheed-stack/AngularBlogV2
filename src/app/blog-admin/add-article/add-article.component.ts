import { HttpClient, HttpErrorResponse, HttpEvent, HttpEventType, HttpRequest, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzUploadChangeParam, NzUploadFile, NzUploadXHRArgs, } from 'ng-zorro-antd/upload';
import { map } from 'rxjs';
import { ArticlesService, articleSubmitFormat } from 'src/app/services/articles.service';
import { CategoriesService } from 'src/app/services/categories.service';
import { loadImgFail } from '../article-list/article-list.component';
import { GlobalService } from 'src/app/services/global.service';

// interface articleSubmitFormat {
//   title: string,
//   cid: number,
//   desc: string,
//   content: string,
//   img: string
// }
interface catalog {
  id: number,
  catalogName: string
}

@Component({
  selector: 'app-add-article',
  templateUrl: './add-article.component.html',
  styleUrls: ['./add-article.component.css'],
  providers: [CategoriesService]
})

export class AddArticleComponent implements OnInit {
  articleFormGroup: FormGroup
  loading = false;
  oldAvatarUrl: string = "";
  avatarUrl?: string = "";
  catalogList: catalog[] = [];
  uploadList: NzUploadFile[] = [];
  fallback: string = loadImgFail;

  // get data from route
  articleId: number = 0;
  articleTitle: string = "新增文章";
  catalogName: string = "选择分类";

  constructor(private categoryService: CategoriesService,
    private articleService: ArticlesService,
    private http: HttpClient,
    private modal: NzModalService,
    private route: ActivatedRoute,
    private globalVar: GlobalService,
  ) { }


  ngOnInit(): void {
    this.articleFormGroup = new FormGroup(
      {
        'title': new FormControl(null, [Validators.required]),
        'cid': new FormControl(null, [Validators.required]),
        'desc': new FormControl(null, [Validators.required]),
        'content': new FormControl(null),
      }

    )
    this.route.queryParams.subscribe({
      next: (values) => {
        if (Object.keys(values).length > 0) {
          this.articleId = values['id'];
          this.articleTitle = "编辑文章: " + values['title'];
          this.catalogName = values['name'];
          this.oldAvatarUrl = values['img']
          this.articleFormGroup.patchValue({
            'title': values['title'],
            'desc': values['desc']
          })
        } else {
          this.articleId = 0;
          this.articleTitle = "新增文章";
          this.catalogName = "选择分类";
          this.oldAvatarUrl = "";
          this.articleFormGroup.reset();
        }
      },
      error: (err) => {
        this.articleId = 0;
        this.articleTitle = "新增文章";
        this.catalogName = "选择分类";
        this.oldAvatarUrl = "";
        this.articleFormGroup.reset();
      }
    })
  }

  onCategorySelectClicked() {
    // get categories
    this.loading = true;
    this.categoryService.getCategories(-1, -1, null, null, null)
      .pipe(map(respondData => {
        const catalogList: catalog[] = [];
        for (let val of respondData.data) {
          catalogList.push({ id: val['ID'], catalogName: val['name'] });
        }
        return catalogList;
      }))
      .subscribe(
        {
          next: (data) => {
            this.catalogList = [];
            this.catalogList = data;
            this.loading = false;
          },
          error: () => {
            this.loading = false;
          }
        }
      )
  }

  // ------------------------- process image upload -------------------------------
  customUpload = (item: NzUploadXHRArgs) => {
    //create a FormData here to store files and other parameters.
    const formdata = new FormData();
    formdata.append('file', item.file as any);
    // console.log(formdata.get('file'));
    var url: string = this.globalVar.domain + '/controller/upload';
    return this.http.post(url, formdata,
      {
        reportProgress: true,
        observe: 'events',
      }).subscribe(
        {
          next: (res) => {
            switch (res.type) {
              case HttpEventType.UploadProgress:
                // console.log("upload event: ", res);
                item.file.status = 'uploading';
                if (res.total > 0) {
                  (res as any).percent = (res.loaded / res.total) * 100;
                }
                item.onProgress(res, item.file);
                break;
              case HttpEventType.Response:
                // console.log('respond event: ', res);
                this.avatarUrl = res.body['url'];
                item.file.status = 'success'
                item.onSuccess(res.body, item.file, res)
            }
          },
          error: (err) => {
            // console.log("err:", err);
            item.onError(err, item.file);
          }
        }
      )
  }

  private getBase64(img: File, callback: (img: string) => void): void {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result!.toString()));
    reader.readAsDataURL(img);
  }
  handleUploadChange(info: NzUploadChangeParam) {
    let fileList = [...info.fileList];

    // limit one file
    fileList = fileList.slice(-1);
    // read from response and show link
    fileList = fileList.map(file => {
      if (file.response) {
        file.url = file.response.url;
        // console.log("file.url: ", file.url)
      }
      return file;
    })
    this.uploadList = fileList;

    // switch(info.file.status){
    //   case 'done':
    //     {
    //       // this.getBase64(info.file.originFileObj,(img)=>{
    //       //   // console.log(img)
    //       //   this.avatarUrl = img;
    //       // })
    //       console.log('done')
    //     }
    // }
  }
  // --------------------------- image upload done --------------------------------

  onArticleSubmit() {
    if (this.articleFormGroup.valid) {
      let respondResult: string = "";
      const ref: NzModalRef = this.modal.confirm({
        nzTitle: '提示',
        nzContent: '确定提交吗',
        nzMaskClosable: false,

        nzOnOk: () => new Promise((resolve, reject) => {
          ref.updateConfig({ nzCancelDisabled: true })

          if (this.avatarUrl === "" && this.oldAvatarUrl !== "") {
            this.avatarUrl = this.oldAvatarUrl;
          }
          const postData: articleSubmitFormat = {
            title: this.articleFormGroup.value['title'],
            cid: this.articleFormGroup.value['cid'],
            desc: this.articleFormGroup.value['desc'],
            img: this.avatarUrl,
            content: this.articleFormGroup.value['content']
          }
          if (this.articleId === 0) { //add article
            this.articleService.addArticle(postData).subscribe({
              next: (value) => {
                respondResult = value['message']
                resolve('OK')
              },
              error: (err: HttpErrorResponse) => {
                respondResult = err.statusText
                reject(err.statusText)
              }
            })
          } else { // update article
            this.articleService.updataArticle(postData, this.articleId).subscribe({
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
            if (this.articleId === 0) {
              this.modal.success({ nzTitle: '添加成功' })
            }
            else {
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
      Object.values(this.articleFormGroup.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

}
