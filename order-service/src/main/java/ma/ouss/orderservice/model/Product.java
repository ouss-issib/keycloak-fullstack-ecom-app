package ma.ouss.orderservice.model;


import lombok.*;

@AllArgsConstructor @NoArgsConstructor
@Setter @Getter @ToString
@Builder
public class Product {
    private String id;
    private String name;
    private double price;
    private int quantity;
}
