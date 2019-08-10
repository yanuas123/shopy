# Shopy

This is a trial site of clothing webshop where dynamic functionality is written using **TypeScript**. The site contains several pages and different popups for the functionality of the store. Available to browse and purchase products, register your account. The responsive templates are designed up to 320 pixels using Pixel Perfect.

> [Static Demo](https://yanuas123.github.io/shopy/)

> [Server Demo](https://shopy1.herokuapp.com/)

## Site Pages

- [Home Page](https://yanuas123.github.io/shopy/)
- [Catalog of Products](https://yanuas123.github.io/shopy/products.html)
- [Single Product](https://yanuas123.github.io/shopy/product.html)
- [Contact Page](https://yanuas123.github.io/shopy/contact.html)

### Main POP-UPs

- Sign-Up
- Cart
- Purchase Confirmation
- Search

## Some features of functionality

- Clicking on the store contact information (phone and email) contacts information is copied to the clipboard
- Clicking on the search icon will show up the search pop-up. The search data is sent to the server and the result is sent from there. The search is performed in the product database by product name and description.
- If the user is logged in, when clicking on the user icon, a local pop-up will show up to exit, if not logged in, then will show up the pop-up. To register, open the login pop-up and then follow the registration link.
- You can go to the basket only when there is a product in it. You can go through the shopping cart to confirm your purchase and enter contact details to send the product. If the user is logged in, the contact information is stored in the database.
- The product card contains color and size information available for this product. If the user wants to add the item to the cart, he can choose the size and color by clicking on their labels and then clicking on the button to add to the cart. Some colors or sizes may not be available when you want to select them, then they appear inactive (for example, a particular color may not be available for a particular size, although it is available in a another size).
- Like buttons are active only when the user is registered.
- Social sharing button opens pop-up where you can select the social network for which the link in this product is available. If there are no links, the button is inactive.

## Development Information

### Built with

- HTML5
- SASS
- [Bootstrap](https://getbootstrap.com/) Grid v 4.3.1
- [TypeScript](https://www.typescriptlang.org/) v 3.5.3
- [jQuery](https://jquery.com/) v 3.4.1
- [Slick](https://kenwheeler.github.io/slick/) v 1.8.1
- [Gulp](https://gulpjs.com/) v 4.0.2

### Front-End

The site is compiled using the **Gulp 4**. The compilation uses various additional packages for HTML, CSS, images and JavaScript. There are three collections of codes available: source code `/src`, layout test codes `/dest`, build codes `/build`.
##### Compilation console commands:
> - `gulp` - code compilation for layout testing
> - `gulp build` - build compilation
> - `gulp build_end` - build compilation (image optimization, beautify html, beautify and optimized css, deleted consoles from js)

Also available additional option to compile code for PHP. In this case in HTML template are inserted "loop" labels and data attributes that are designed for compilation client-side teplates using javascript are deleted. This option is available in `gulpfile.js` in the object by `const prm.html_del_dirty.mode`, where "node" and "php" options are available.

#### HTML codes

In the source files the html template is divided into many files for reuse and easy editing. The main files are in the main directory and the others are in the `partials` directory. For ease of use of repetitive text data, a mini database from a file `html-include-prop.js` in the main folder is used. When compiling build codes, data from a mini-database and some specially commented data that is not used when site launches are not compiled (image url and links). Also, there are no compilations for cycles of template blocks. They are inserted as a single copy.

#### CSS codes

SASS is used to create the css. Styles in the source directory are divided into several files: 
- `variables` - which in addition to variables also contain common mixins 
- `regular` - some common styles for text elements, forms, and buttons 
- `units` - styles for various reused blocks 
- `style` - styles for the main custom elements that can override the styles of internal reused elements 

The final build is optimized with autoprefixer. **Bootstrap Grid** v 4.3.1 is used for building blocks.

#### JavaScript codes

JavaScript is written using `TypeScript`. Since Gulp 4 is not available for proper module compilation, two compilation configuration files are used: one for the editor, the other for the compiler. In the source codes, depending on the functionality, some modules are located in the main ts folder, while others are in the subfolder. These are modules that are not related to the functionality of the contextual site (plugin type). When compiled, all modules are combined into one file. During compilation uses settings of types: for global variables; for `jQuery` - in some modules it is used; for `Slick` - used for image galleries. Since javascript uses requests to the server, they are compiled only to build. To test the layout in the image galleries, the `test.js` from the `js` folder is used to run **Slick**.

### Back-End

The test server is built with the **Node.js** and **Express.js**. The **MongoDB** database is used.
The test admin part is built with **Angular.js** using **Bootstrap**.

## Author

- Yaroslav Levchenko

## License

This project is licensed under the MIT License - see the [LICENSE.md](License.md) file for details
