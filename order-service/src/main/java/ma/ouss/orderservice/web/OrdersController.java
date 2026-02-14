package ma.ouss.orderservice.web;

import ma.ouss.orderservice.entities.Order;
import ma.ouss.orderservice.repositories.OrderRepository;
import ma.ouss.orderservice.restClients.InventoryRestClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class OrdersController {
    private OrderRepository orderRepository;
    private InventoryRestClient inventoryRestClient;
    public OrdersController(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
        this.inventoryRestClient = inventoryRestClient;
    }

    @GetMapping("/orders")
    public List<Order> getAllOrders(){
        return orderRepository.findAll();
    }

    @GetMapping("/orders/{id}")
    public Order getOrderById(@PathVariable(name = "id") String id){
        Order order = orderRepository.findById(id).get();
        order.getProductItems().forEach(p->{
            p.setProduct(inventoryRestClient.getProductById(p.getProduct().getId()));
        });
        return order;
    }
}
