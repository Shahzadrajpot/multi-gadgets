import { supabase } from '../lib/supabase';

function generateOrderNumber(): string {
  return `PKH-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

export interface CreateOrderData {
  customer_name: string;
  phone: string;
  city: string;
  address: string;
  notes?: string;
  items: {
    product_id: string;
    product_name: string;
    size: string;
    quantity: number;
    unit_price: number;
    discount_amount: number;
    total: number;
  }[];
  subtotal: number;
  product_discount: number;
  global_discount: number;
  delivery_charges: number;
  total: number;
}

export async function createOrder(data: CreateOrderData) {
  const orderNumber = generateOrderNumber();

  const { data: order, error } = await supabase
    .from('orders')
    .insert({
      order_number: orderNumber,
      customer_name: data.customer_name,
      phone: data.phone,
      city: data.city,
      address: data.address,
      notes: data.notes,
      subtotal: data.subtotal,
      product_discount: data.product_discount,
      global_discount: data.global_discount,
      delivery_charges: data.delivery_charges,
      total: data.total,
    })
    .select()
    .single();

  if (error) throw error;

  await supabase.from('order_items').insert(
    data.items.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      product_name: item.product_name,
      size: item.size,
      quantity: item.quantity,
      unit_price: item.unit_price,
      discount_amount: item.discount_amount,
      total: item.total,
    }))
  );

  return order;
}

export async function fetchOrders(options?: {
  status?: string;
  page?: number;
  pageSize?: number;
}) {
  let query = supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (options?.status) {
    query = query.eq('status', options.status);
  }

  const page = options?.page ?? 1;
  const pageSize = options?.pageSize ?? 10;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function fetchOrderById(id: string) {
  const { data: order, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;

  const { data: items } = await supabase
    .from('order_items')
    .select('*')
    .eq('order_id', id);

  return { ...order, items: items || [] };
}

export async function updateOrderStatus(id: string, status: string) {
  const { data, error } = await supabase
    .from('orders')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getOrderStats() {
  const [productsRes, ordersRes, pendingRes] = await Promise.all([
    supabase.from('products').select('id', { count: 'exact', head: true }),
    supabase.from('orders').select('id', { count: 'exact', head: true }),
    supabase.from('orders').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
  ]);

  const { data: revenueData } = await supabase
    .from('orders')
    .select('total')
    .in('status', ['delivered', 'shipped', 'confirmed']);

  const totalRevenue = (revenueData || []).reduce((sum, o) => sum + (o.total || 0), 0);

  const { count: activeProducts } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true);

  const { count: outOfStock } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('stock', 0);

  return {
    totalProducts: productsRes.count || 0,
    activeProducts: activeProducts || 0,
    outOfStock: outOfStock || 0,
    totalOrders: ordersRes.count || 0,
    pendingOrders: pendingRes.count || 0,
    totalRevenue,
  };
}
