package com.jobix.jobix_Backend.controller;
import com.jobix.jobix_Backend.model.Feature;
import com.jobix.jobix_Backend.model.Product;
import com.jobix.jobix_Backend.repository.CategoryRepository;
import com.jobix.jobix_Backend.repository.ProductServiceInterface;
import com.jobix.jobix_Backend.service.FeatureService;
import com.jobix.jobix_Backend.service.ProductService;
import com.jobix.jobix_Backend.service.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;


@RestController
@RequestMapping("/api/product")
@CrossOrigin(origins = "http://localhost:5173")// para permitir peticiones desde frontend React
public class ProductController {

    @Autowired
    private  ProductService productService;
    @Autowired
    private  ProductServiceInterface productServiceInterface;

    @Autowired
    private  CategoryRepository categoryRepository;

    @Autowired
    private   FeatureService featureService;

    //@Autowired
    //private ReservationService reservationService;

    public ProductController(ProductService productService, ProductServiceInterface productServiceInterface,
                             CategoryRepository categoryRepository, FeatureService featureService,
                             ReservationService reservationService) {
        this.productService = productService;
        this.productServiceInterface = productServiceInterface;
        this.categoryRepository = categoryRepository;
        this.featureService = featureService;
        //this.reservationService = reservationService;
    }

    @PostMapping
    public ResponseEntity<Product> createProduct(@RequestBody Product product){
        Product saved = productService.SaveProduct(product);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }


    @PostMapping("/products")
    public ResponseEntity<Product> addProduct(@RequestBody Product product){
        Product savedProduct = productService.SaveProduct(product);
        return ResponseEntity.ok(savedProduct);
    }


    @GetMapping("/randomProducts")
    public List<Product> getRandomProducts() {
        return productServiceInterface.getRandomProduct(); // Llama al metodo del servicio
    }

    @GetMapping("/{id}")// Obtener un producto específico por su ID
    public ResponseEntity<?> getProductByid(@PathVariable Long id){
        Optional<Product> product = productServiceInterface.getById(id);
        return product.isPresent() ? ResponseEntity.ok(product.get()) : ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("Producto no encontrado");
    }

    @GetMapping
    public ResponseEntity<List<Product>> getProduct(@RequestParam(required = false) List<Long> category){
        List<Product> products;

        if (category != null && !category.isEmpty()){
            products = productService.findByCategoryIds(category);
        }else {
            products = productService.findAll();
        }
        return ResponseEntity.ok(products);
    }

    @GetMapping("/available")
    public List<Product> getAvailableProducts(
            @RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        return productService.getAvailableProducts(startDate, endDate);
    }



   @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProductById(@PathVariable Long id){
        productService.deleteProduct(id);
        return ResponseEntity.ok().build();

    }


    @PutMapping(value = "/{id}", consumes = {"multipart/form-data"})
    public ResponseEntity<?> updateProduct (@PathVariable Long id, @RequestParam("name") String name,
                                            @RequestParam("description") String description,
                                            @RequestParam(value = "category", required = false) Long categoryId,
                                            @RequestParam(value = "image", required = false) MultipartFile [] image){

        try{
            Product updateProduct = productService.updateProduct(id, name, description, categoryId , image);
            return ResponseEntity.ok(updateProduct);

        }catch (Exception e){
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    //capturamos lo que se diligencia en el formulario
    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<?> addProduct(
            @RequestParam("name") String name,
            @RequestParam("description") String description,
            @RequestParam(value = "category", required = false) Long categoryId,
            @RequestParam(value = "features", required = false) List<Long> featureIds,
            @RequestParam("image") List<MultipartFile> image) {

        try {
            //_______________________TUDO LO REFERENTE A LAS IMÁGENES QUE SE SUBEN ↓______________________
            //guardamos los nombres de los archivos que se suben:
            List<String> fileNames = new ArrayList<>();
            // Ruta absoluta a src/main/resources/static/uploads/
            String file = new File("img_uploads").getAbsolutePath() + "/";

            //recorrer cada imagen y guardar en el disco con su unico nombre:
            for (MultipartFile img : image) {
                String fileName = System.currentTimeMillis() + "_" + img.getOriginalFilename();
                File destinationFile = new File(file + fileName);
                img.transferTo(destinationFile);// Guarda físicamente la imagen
                fileNames.add(fileName);// Guarda el nombre para la BD
            }
            //_________________________________________________________________________________________________

            //se crea producto aqui:
            Product product = new Product();
            product.setName(name);
            product.setDescription(description);
            product.setImage(fileNames);

            if (categoryId != null) {
                categoryRepository.findById(categoryId).ifPresent(product::setCategory);
            }

            //cragar caracteristicas y asignarlas:
            if (featureIds != null && !featureIds.isEmpty()) {
                List<Feature> features = featureService.findAllById(featureIds);
                product.setFeatureList(features);
            }

            Product savedProducts = productService.SaveProduct(product);

            return ResponseEntity.status(HttpStatus.CREATED).body(savedProducts);


        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage()); // nombre duplicado, por ejemplo
        } catch (IOException e) {
            e.printStackTrace(); // da más detalle en consola
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al intentar guardar imágenes");
        } catch (Exception e) {
            e.printStackTrace(); // útil para errores inesperados
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error inesperado");
        }
    }
}
