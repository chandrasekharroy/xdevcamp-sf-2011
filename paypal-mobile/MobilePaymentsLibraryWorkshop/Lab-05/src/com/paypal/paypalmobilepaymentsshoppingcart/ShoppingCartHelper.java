package com.paypal.paypalmobilepaymentsshoppingcart;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Vector;

import android.content.res.Resources;

public class ShoppingCartHelper {
	
	public static final String PRODUCT_INDEX = "PRODUCT_INDEX";
	
	private static List<Product> catalog;
	private static Map<Product, ShoppingCartEntry> cartMap = new HashMap<Product, ShoppingCartEntry>();

	public static List<Product> getCatalog(Resources res) {
		if (catalog == null) {
			catalog = new Vector<Product>();
			catalog.add(new Product("Norwegian Travel", "6551", res
					.getDrawable(R.drawable.norway),
					"Once in a life time travel trip to Norway. Airfare and Hotel Include", 2994.49));
			catalog.add(new Product("Mexican Getway", "6552", res
					.getDrawable(R.drawable.mexico),
					"Romantic getway to Mexico. Airfare and Hotel Include", 1849.99));
			catalog.add(new Product("Hawaiian Escape", "6553", res
					.getDrawable(R.drawable.hawaii),
					"Hawaiian escape to island living. Airfare and Hotel Include", 2114.99));
		}

		return catalog;
	}

	public static void setQuantity(Product product, int quantity) {
		// Get the current cart entry
		ShoppingCartEntry curEntry = cartMap.get(product);

		// If the quantity is zero or less, remove the products
		if (quantity <= 0) {
			if (curEntry != null)
				removeProduct(product);
			return;
		}

		// If a current cart entry doesn't exist, create one
		if (curEntry == null) {
			curEntry = new ShoppingCartEntry(product, quantity);
			cartMap.put(product, curEntry);
			return;
		}

		// Update the quantity
		curEntry.setQuantity(quantity);
	}
	
	public static int getProductQuantity(Product product) {
		// Get the current cart entry
		ShoppingCartEntry curEntry = cartMap.get(product);

		if (curEntry != null)
			return curEntry.getQuantity();

		return 0;
	}

	public static void removeProduct(Product product) {
		cartMap.remove(product);
	}

	public static List<Product> getCartList() {
		List<Product> cartList = new Vector<Product>(cartMap.keySet().size());
		for (Product p : cartMap.keySet()) {
			cartList.add(p);
		}

		return cartList;
	}

}
