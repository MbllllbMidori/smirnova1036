import { Component,EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Categories, Product } from 'src/app/shared/interfaces/product.interfaces';
import { ProductService } from 'src/app/shared/services/product.service';

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.css']
})
export class ProductItemComponent implements OnInit {

  //constructor() { }
  product!: Product;
  id: number | null = null;
  @Output() onSave = new EventEmitter<Product>();
  productForm!: FormGroup;
  categories!: Categories[];
  constructor(private fb: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private activatedRoute: ActivatedRoute) { }


  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.id = params.id ? +params.id : null
    })
    this.getData();
    this.getCategories();
  }
  async getCategories() {
    try {
      this.categories = (await this.
        productService.getCategories()) || []
    } catch (error) {
      console.log(error)
    }
  }
  getCategoryNameById(id: number){
    let category = this.categories?.find(x => x.id == id);
   console.log(category?.name);
    return category?.name
  }

  async getData() {
    const controls = {
      name: [null, [Validators.required, Validators.maxLength(100)]],
      article: [null, [Validators.required, Validators.maxLength(100)]],
      price: [null, [Validators.required, Validators.maxLength(100), Validators.pattern(/^[0-9]/)]],
      manufacturer: [null, [Validators.maxLength(100)]],
      categoryId: [null, [Validators.required]],
      weight: [null, [Validators.required, Validators.maxLength(100), Validators.pattern(/^[0-9]/)]],
      inStock: [null, [Validators.required, Validators.maxLength(100), Validators.pattern(/^[0-9]/)]],

    }
    this.productForm = this.fb.group(controls);
    if (this.id) {
      try {
        this.product = await this.productService.getProduct(this.id)

      } catch (error) {

      }
      console.log(this.product);
      this.productForm.patchValue(this.product)
    } else
      this.productForm.reset();
  }


  async save() {
    if (this.id) {
      const product = this.productForm.value;
      try {
        await this.productService.putProduct(this.id, product)
        console.log(this.productForm.value)
        this.getData();
        this.router.navigate(["../products"])
        
      } catch (error) {

      }
    } else {
      const product = this.productForm.value;
      
      try {
        const result = await this.productService.postProduct(product)
        this.router.navigate(["../products"])
      } catch (error) {

      }
      this.productForm.reset();
    }
  }
  async delete() {

    const personal = this.productForm.value;

    try {
      await this.productService.deleteProduct(this.id)
    } catch (error) {

    }

  }
}
