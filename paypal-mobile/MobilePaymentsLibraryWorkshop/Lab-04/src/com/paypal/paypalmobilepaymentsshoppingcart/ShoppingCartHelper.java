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
			catalog.add(new Product("Football Handheld Game", "6551", res
					.getDrawable(R.drawable.football),
					"Mattel’s 1977 handheld electronic football game proved a surprise hit that spawned numerous imitators. This replica (now with the word “classic” in the title) is a fun, inexpensive shot of nostalgia, though its design will be lost on new pigskin fans because this isn’t so much football, but a football-like exercise. ", 94.49));
			catalog.add(new Product("Micronaut", "6552", res
					.getDrawable(R.drawable.micronaut),
					"A series of interchangeable space toys (figures, vehicles, and playsets) produced by the Mego Corporation between", 24.99));
			catalog.add(new Product("View-Master", "6553", res
					.getDrawable(R.drawable.viewmaster),
					"View-Master is a device for viewing seven 3-D images (also called stereo images) on a paper disk.", 14.99));
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
