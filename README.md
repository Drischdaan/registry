<h1 align="center">@drischdaan/registry</h1>
<p align="center">
    <img src="https://img.shields.io/npm/v/@drischdaan/registry?logo=npm&style=flat-square&link=https://www.npmjs.com/package/@drischdaan/registry">
    <img src="https://img.shields.io/github/license/Drischdaan/registry?style=flat-square">
</p>
<p align="center">
    <img src="https://img.shields.io/github/workflow/status/Drischdaan/registry/Tests?label=tests&logo=github&style=flat-square">
</p>
A typeorm repository inspired map wrapper

## Examples
In these example we are using this basic setup:
```ts
class Product {
    constructor(
        public displayName: string,
        public price: number,
        public isAvailable: boolean,
    ) {}
}

const registry: Registry<Product> = new Registry<Product>();
```

#### Adding an entry
```ts
const uuidTestProduct: string = registry.insert(new Product('TestProduct', 9.99, true));
const uuidTestProduct2: string = registry.insert(new Product('TestProduct2', 9.99, false));
```

#### Finding an entry by uuid
```ts
const testProduct: Product = registry.findOne({ uuid: uuid });
console.log(testProduct.displayName); // <-- Should return "TestProduct"
```

#### Finding an entry by using the "where" find options
```ts
const testProduct: Product = registry.findOne({ where: { displayName: 'TestProduct' } });
console.log(testProduct.displayName); // <-- Should return "TestProduct"
```

#### Finding multiple entries by using the "where" find options
```ts
const products: Product[] = registry.find({ where: { price: 9.99 } });
console.log(products); // <-- Should return an array with all 2 products
console.log(products[1].displayName); // <-- Should return "TestProduct2"
```

#### Getting all entries
```ts
const products: Product[] = registry.find();
console.log(products); // <-- Should return an array with all 2 products
```

#### Getting the uuid of an entry
```ts
const uuid: string = registry.findUuid({ where: { displayName: 'TestProduct2' } });
console.log(uuidTestProduct2 === uuid); // <-- Should return true
```

#### Deleting an entry
You can either use the "where" option or the "uuid" option to specify which entry should be deleted

```ts
const response: boolean = registry.delete({ where: { displayName: 'TestProduct2' } });
console.log(response); // <-- Should return true
```


## Support

<div>
    <a href="https://www.buymeacoffee.com/Drischdaan">
        <img src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=&slug=Drischdaan&button_colour=BD5FFF&font_colour=ffffff&font_family=Lato&outline_colour=000000&coffee_colour=FFDD00">
    </a>
</div>
