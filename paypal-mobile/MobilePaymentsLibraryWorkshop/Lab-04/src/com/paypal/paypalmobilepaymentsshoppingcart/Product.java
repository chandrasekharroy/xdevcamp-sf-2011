package com.paypal.paypalmobilepaymentsshoppingcart;

import android.graphics.drawable.Drawable;

public class Product {
	
	 public String title;
	 public Drawable productImage;
	 public String description;
	 public String itemId;
	 public double price;
	 public boolean selected;

	 public Product(String title, String itemId,Drawable productImage, String description,
	   double price) {
	  this.title = title;
	  this.productImage = productImage;
	  this.description = description;
	  this.itemId = itemId;
	  this.price = price;
	 }

}
