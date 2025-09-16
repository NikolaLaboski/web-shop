import { useMutation } from '@apollo/client';
import { PLACE_ORDER } from '../graphql/mutations';
import { useCart } from '../cart/CartContext';

export default function PlaceOrderButton() {
  const { cartItems, clearCart, setShowCart } = useCart();
  const [placeOrder, { loading }] = useMutation(PLACE_ORDER);

  const onPlaceOrder = async () => {
    const items = cartItems.map(ci => ({
      product_id: ci.id,      // slug/string
      quantity: ci.quantity,  // integer
    }));

    try {
      const { data } = await placeOrder({ variables: { items } });
      if (data?.createOrder) {
        clearCart();
        setShowCart(false);
        alert('Order placed');
      } else {
        alert('Order failed');
      }
    } catch (e) {
      console.error(e);
      alert('Error placing order');
    }
  };

  return (
    <button
      onClick={onPlaceOrder}
      disabled={loading || cartItems.length === 0}
    >
      {loading ? 'Placing…' : 'Place order'}
    </button>
  );
}
