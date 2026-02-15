package ma.ouss.inventoryservice;

import ma.ouss.inventoryservice.entities.Product;
import ma.ouss.inventoryservice.repositories.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.util.UUID;

@SpringBootApplication
public class InventoryServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(InventoryServiceApplication.class, args);
    }


    @Bean
    CommandLineRunner commandLineRunner(ProductRepository productRepository) {
        return args -> {
          productRepository.save(Product.builder()
                          .id("P01")
                          .name("Asus Rog 17")
                          .price(15000)
                          .quantity(2)
                  .build());
            productRepository.save(Product.builder()
                    .id("P02")
                    .name("Printer LG")
                    .price(870)
                    .quantity(1)
                    .build());
            productRepository.save(Product.builder()
                    .id("P03")
                    .name("Iphone 17")
                    .price(20500)
                    .quantity(10)
                    .build());

        };
    }
}
