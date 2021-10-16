export interface Product{
    name:string;
    id?:number;
    article:string,
    price:number,
    manufacturer:string,
    categoryId: number,
    weight: number,
    inStock: number

}
export interface Categories {
    name:string;
    id:number;
}