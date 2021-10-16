import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Categories, Product } from 'src/app/shared/interfaces/product.interfaces';
import { ProductService } from 'src/app/shared/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products!: Product[];
  categories!: Categories[];
  constructor(private productService: ProductService, private router: Router) { }
  positionName!: number;
  isInStock!: boolean;
  productListComponent = this;
  isSortByPrice = false;
  nextDownSortByPrice = false;
  v1!: number;
  v2!: number;
  isSortByInStock = false;
  nextDownSortByInStock !: boolean;

  sortByPrice(flag: boolean) {
    if (flag) {
      this.isSortByInStock = false;
      this.isSortByPrice = true;
    }
    if (this.nextDownSortByPrice == true) {
      this.products.sort((a, b) => { return a.price - b.price; })
      if (flag) {
        this.nextDownSortByPrice = false;
        this.v1 = 2;
      }
    }
    else {
      this.products.sort((a, b) => { return b.price - a.price; })
      if (flag) {
        this.nextDownSortByPrice = true;
        this.v1 = 2;
      }
    }
  }
  async sortByInStock(flag: boolean) {


    if (flag) {
      this.isSortByPrice = false;
      this.isSortByInStock = true;
    }

    console.log(this.nextDownSortByInStock)
    if (this.nextDownSortByInStock == true) {
      this.products.sort((a, b) => { return a.inStock - b.inStock; })
      if (flag === true) {
        this.nextDownSortByInStock = false;
      }
    }
    else {

      this.products.sort((a, b) => { return b.inStock - a.inStock; })

      if (flag === true) {
        this.nextDownSortByInStock = true;
      }
    }
    console.log(this.nextDownSortByInStock);
  }

  async OnBoolChanged(isInStock: boolean) {
    if (isInStock) {
      this.products = this.products.filter(x => {
        return x.inStock != 0
      })
    } else {
      await this.getData();
      this.OnSelChanged(this.positionName)
    }

    if (this.isSortByInStock)
      this.sortByInStock(false)
    if (this.isSortByPrice) {
      this.sortByPrice(false)

    }


  }
  async OnSelChanged(name: any) {
    if (name == "Показать все") {


      

      if (this.isInStock) {
        this.products = this.products.filter(x => {
          return x.inStock != 0
        })
      }

      if (this.isSortByInStock)
        this.sortByInStock(false)
      if (this.isSortByPrice) {
        this.sortByPrice(false)
      }

await this.getData();
    }
    else if (name) {
      let categoryId = this.getCategoryByName(name);

      await this.getData();

      if (this.isInStock) {
        this.products = this.products.filter(x => {
          return x.inStock != 0
        })
      }

      this.products = this.products.filter(x => { return x.categoryId == categoryId })
    } else {
      
    }
    if (this.isSortByInStock)
      this.sortByInStock(false)
    if (this.isSortByPrice) {
      this.sortByPrice(false)
    }
  
  }

  getCategoryByName(name: string) {

    let category = this.categories?.find(x => x.name == name);

    return category?.id
  }

  linkToItem(id?: number) {
    if (id) {
      this.router.navigate([this.router.url, 'item', id])
    } else
      this.router.navigate([this.router.url, 'item'])
  }
  async getData() {
    try {
      this.products = (await this.
        productService.getProducts()) || []
    } catch (error) {
      console.log(error)
    }
  }
  async getCategories() {
    try {
      this.categories = (await this.
        productService.getCategories()) || []
    } catch (error) {
      console.log(error)
    }
  }
  async inStockUpDown(Up: boolean, id: any) {
    if (Up) {
      try {
        let product = await this.productService.getProduct(id);

        product.inStock++;
        await this.productService.putProduct(id, product)
        await this.getData();




        if (this.isSortByInStock)
          this.sortByInStock(false)
        if (this.isSortByPrice) {
          this.sortByPrice(false)

        }


        this.OnSelChanged(this.positionName)

      } catch (error) {

      }
    }
    else {
      try {
        let product = await this.productService.getProduct(id);
        if (product.inStock > 0)
          product.inStock--;
        await this.productService.putProduct(id, product)
        await this.getData();




        if (this.isSortByInStock)
          this.sortByInStock(false)
        if (this.isSortByPrice) {
          this.sortByPrice(false)
        }

        this.OnBoolChanged(this.isInStock);
        this.OnSelChanged(this.positionName)
      } catch (error) {

      }
    }



  }
  getCategoryNameById(id: number) {
    let category = this.categories?.find(x => x.id == id);
    return category?.name
  }

  ngOnInit(): void {
    this.getData();
    this.getCategories();
    this.nextDownSortByInStock = false;
    this.v1 = 1;
    this.v2 = 1;
  }

}
