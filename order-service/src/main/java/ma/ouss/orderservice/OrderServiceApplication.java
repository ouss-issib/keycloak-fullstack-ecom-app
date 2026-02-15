package ma.ouss.orderservice;

import ma.ouss.orderservice.entities.Order;
import ma.ouss.orderservice.entities.OrderState;
import ma.ouss.orderservice.entities.ProductItem;
import ma.ouss.orderservice.model.Product;
import ma.ouss.orderservice.repositories.OrderRepository;
import ma.ouss.orderservice.repositories.ProductItemRepository;
import ma.ouss.orderservice.restClients.InventoryRestClient;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.Bean;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;
import java.util.Random;
import java.util.UUID;

@SpringBootApplication
@EnableFeignClients
public class OrderServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(OrderServiceApplication.class, args);
    }


    @Bean
    CommandLineRunner commandLineRunner(OrderRepository orderRepository,
                                        ProductItemRepository productRepository,
                                        InventoryRestClient inventoryRestClient, ProductItemRepository productItemRepository) {
        return args -> {
//            List<Product> products = inventoryRestClient.getAllProducts();
            List<String> productIds = List.of("P01","P02","P03");

            for (int i = 0; i < 5; i++) {
                Order order = Order.builder()
                        .id(UUID.randomUUID().toString())
                        .state(OrderState.PENDING)
                        .date(LocalDate.now())
                        .build();

                Order savedOrder = orderRepository.save(order);

                productIds.forEach(productId -> {
                   ProductItem productItem = ProductItem.builder()
                           .productId(productId)
                           .quantity(new Random().nextInt(10))
                           .price(Math.random() * 10000+20)
                           .order(order)
                           .build();
                productItemRepository.save(productItem);
                });

            }
        };
    }
}
