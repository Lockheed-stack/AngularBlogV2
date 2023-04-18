import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, OnInit } from '@angular/core';
import { MatTreeFlattener, MatTreeFlatDataSource } from '@angular/material/tree';
import { Route, Router } from '@angular/router';
import { ArticlesService } from 'src/app/services/articles.service';
import { CategoriesService } from 'src/app/services/categories.service';



/**
 * Flat node with expandable and level information
 *
 * 具有可扩展和级别信息的平面节点
 *
 */
interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
  id:number;
}

interface CatalogNode {
  name: string;
  id:number;
  children?: CatalogNode[];
}

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css']
})
export class SideNavComponent implements OnInit {

  // catalog Tree variable
  isCatalog: Map<string,boolean> = new Map<string,boolean>;
  catalogArrayIndex: Map<string, number> = new Map<string, number>;
  category_tree_data: CatalogNode[] = [];

  constructor(
    private categoryService: CategoriesService,
    private router:Router
  ) { }

  // -------------------- catalog process ---------------------------
  processCategoriesWithArticles() {
    this.categoryService.getCategoriesWithArticles(-1, -1).subscribe({
      next: (value) => {
        if (value === null || value.message !== "OK") {
          console.log(value)
        } else {
          // console.log(value)
          let category_tree_data_index: number = 0

          for (let val of value.data) {

            if (!this.catalogArrayIndex.has(val['cname'])) {

              let ParentNode: CatalogNode = {
                name: val['cname'],
                id:val['cid'],
                children: []
              }

              if (val['id'] > 0) {
                const childNode: CatalogNode = {
                  name: (val['title'] === '' ? "null" : val['title']),
                  id:val['id'],
                }
                ParentNode.children.push(childNode);
                this.isCatalog.set(val['title'],false);
              }

              this.isCatalog.set(val['cname'],true);
              this.category_tree_data.push(ParentNode);
              this.catalogArrayIndex.set(val['cname'], category_tree_data_index);
              category_tree_data_index++;
            }
            else {
              const childNode: CatalogNode = {
                name: (val['title'] === '' ? "null" : val['title']),
                id:val['id'],
              }
              this.category_tree_data[this.catalogArrayIndex.get(val['cname'])].children.push(childNode)
            }
          }
        }
        this.dataSource.data = this.category_tree_data;
      },
      error: (err) => {
        console.log(err)
      }
    })
  }

  private _transformer = (node: CatalogNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
      id:node.id,
    };
  };

  treeControl = new FlatTreeControl<ExampleFlatNode>(
    node => node.level,
    node => node.expandable,
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    node => node.level,
    node => node.expandable,
    node => node.children,
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;
  // -------------------- catalog process ---------------------------


  // ---------------------- nav to article --------------------------
  onArticleBtnClick(id:number){
    // console.log(id)
    this.router.navigate(['/article',id]);
  }
  // ---------------------- nav to article --------------------------
  ngOnInit(): void {
    // this.getAllCatalog();
    this.processCategoriesWithArticles();
    
  }
}
