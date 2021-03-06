package com.paypal.paypalmobilepaymentsshoppingcart;

import java.util.List;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ListView;
import android.widget.AdapterView.OnItemClickListener;

public class PayPalMobilePaymentsShoppingCartActivity extends Activity {

	private List<Product> mProductList;

	/** Called when the activity is first created. */
	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.catalog);

		// Obtain a reference to the product catalog
		mProductList = ShoppingCartHelper.getCatalog(getResources());

		// Create the list
		ListView listViewCatalog = (ListView) findViewById(R.id.ListViewCatalog);
		listViewCatalog.setAdapter(new ProductAdapter(mProductList,
				getLayoutInflater(), false));

		listViewCatalog.setOnItemClickListener(new OnItemClickListener() {

			@Override
			public void onItemClick(AdapterView<?> parent, View view,
					int position, long id) {
				Intent productDetailsIntent = new Intent(getBaseContext(),
						ProductDetailsActivity.class);
				productDetailsIntent.putExtra(ShoppingCartHelper.PRODUCT_INDEX,
						position);
				startActivity(productDetailsIntent);
			}
		});
	}
}