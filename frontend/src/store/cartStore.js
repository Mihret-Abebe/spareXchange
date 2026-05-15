import { create } from "zustand";
import axios from "axios";

const API_URL = import.meta.env.MODE === "development" ? "http://localhost:5000/api/listings" : "/api/listings";

axios.defaults.withCredentials = true;

export const useCartStore = create((set, get) => ({
	cartItems: [],
	loading: false,
	error: null,

	// Load cart from localStorage on initialization
	initializeCart: () => {
		try {
			const savedCart = localStorage.getItem("sparexchange_cart");
			if (savedCart) {
				set({ cartItems: JSON.parse(savedCart) });
			}
		} catch (error) {
			console.error("Failed to load cart from localStorage:", error);
		}
	},

	// Add item to cart
	addToCart: (listing, quantity = 1) => {
		set(state => {
			const existingItem = state.cartItems.find(item => item.listingId === listing._id);
			
			let newCartItems;
			if (existingItem) {
				// Update quantity if item already exists
				newCartItems = state.cartItems.map(item =>
					item.listingId === listing._id
						? { ...item, quantity: item.quantity + quantity }
						: item
				);
			} else {
				// Add new item
				newCartItems = [...state.cartItems, {
					listingId: listing._id,
					title: listing.title,
					price: listing.price,
					images: listing.images,
					quantity: quantity,
					seller: listing.seller,
					ecoPoints: listing.ecoPoints
				}];
			}

			// Save to localStorage
			localStorage.setItem("sparexchange_cart", JSON.stringify(newCartItems));

			return { cartItems: newCartItems };
		});
	},

	// Remove item from cart
	removeFromCart: (listingId) => {
		set(state => {
			const newCartItems = state.cartItems.filter(item => item.listingId !== listingId);
			localStorage.setItem("sparexchange_cart", JSON.stringify(newCartItems));
			return { cartItems: newCartItems };
		});
	},

	// Update item quantity
	updateQuantity: (listingId, quantity) => {
		if (quantity < 1) return;
		
		set(state => {
			const newCartItems = state.cartItems.map(item =>
				item.listingId === listingId ? { ...item, quantity } : item
			);
			localStorage.setItem("sparexchange_cart", JSON.stringify(newCartItems));
			return { cartItems: newCartItems };
		});
	},

	// Clear cart
	clearCart: () => {
		localStorage.removeItem("sparexchange_cart");
		set({ cartItems: [] });
	},

	// Get cart total
	getCartTotal: () => {
		const state = get();
		return state.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
	},

	// Get cart items count
	getCartCount: () => {
		const state = get();
		return state.cartItems.reduce((count, item) => count + item.quantity, 0);
	}
}));
