import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { map } from 'rxjs';
import { CategoriesService } from 'src/app/services/categories.service';

interface catalog {
  id: number,
  catalogName: string,
}

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css'],
  providers: [CategoriesService]
})


export class CategoriesComponent implements OnInit {

  constructor(
    private categoriesService: CategoriesService,
    private router:Router,
    private modal: NzModalService,
  ) {

  }

  total = 1;
  listOfCatalog: catalog[] = [];
  loading = true;
  pageSize = 5;
  pageIndex: number = 1;

  loadDataFromServer(pageIndex: number,
    pageSize: number,
    sortField: string | null,
    sortOrder: string | null,
    filter: Array<{ key: string; value: string[] }>
  ): void {

    this.loading = true;
    this.categoriesService.getCategories(pageIndex, pageSize, sortField, sortOrder, filter)
      .pipe(map(respondData => {
        const ListData: catalog[] = [];
        const total: number = respondData.total;

        for (var val of respondData.data) {
          ListData.push({ id: val['ID'], catalogName: val['name'] });
        }

        return { ListData, total };
      })).subscribe((data) => {
        this.loading = false;
        this.total = data.total;
        this.listOfCatalog = data.ListData;
      }
      );
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort, filter } = params;
    const currentSort = sort.find(item => item.value !== null);
    const sortField = (currentSort && currentSort.key) || null;
    const sortOrder = (currentSort && currentSort.value) || null;
    this.loadDataFromServer(pageIndex, pageSize, sortField, sortOrder, filter);
  }


  onbtnSearchClicked() {
    // this.loadDataFromServer(this.pageIndex, this.pageSize, null, null, []);
  }

  onbtnDeleteClicked(id: number) {
    const ref: NzModalRef = this.modal.confirm(
      {
        nzTitle: '提示',
        nzContent: '确定删除吗',
        nzMaskClosable: false,
        nzOkDanger: true,
        nzOnOk: () => new Promise((resolve, reject) => {
          ref.updateConfig({ nzCancelDisabled: true })
          setTimeout(resolve, 1000)
        }).then(() => {
          this.categoriesService.deleteCategories(id).subscribe(
            {
              next: (respondData) => {
                // console.log(respondData)
                if (respondData.message === 'OK') {
                  this.modal.success({ nzTitle: '删除成功' })
                  this.listOfCatalog = this.listOfCatalog.filter(d => d.id !== id)
                }
              },
              error: (error: HttpErrorResponse) => {
                // console.log(error)
                this.modal.error({ nzTitle: '删除失败', nzContent: error.statusText })
              }
            }
          )
        })
      });

  }
  
  onbtnEditClicked(id:number,name:string){
    this.router.navigate(['blogadmin/addCatalog'],{queryParams:{'id':id,'name':name}})
  }

  ngOnInit(): void {
    this.loadDataFromServer(this.pageIndex, this.pageSize, null, null, []);
  }
}
