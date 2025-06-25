package com.jobix.jobix_Backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
public class Feature {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long Id;

    private String name;
    private String icon;

    @ManyToMany(mappedBy = "featureList")//la relación ya está mapeada del lado de Product
    @JsonIgnore
    private List<Product> productList = new ArrayList<>();


    public Feature(Long id, String name, String icon, List<Product> productList) {
        Id = id;
        this.name = name;
        this.icon = icon;
        this.productList = productList;
    }

    public Feature() {
    }

    public Long getId() {
        return Id;
    }

    public void setId(Long id) {
        Id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String iconUrl) {
        this.icon = iconUrl;
    }

    public List<Product> getProductList() {
        return productList;
    }

    public void setProductList(List<Product> productList) {
        this.productList = productList;
    }
}
