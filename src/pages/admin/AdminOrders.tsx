import { useState, useEffect } from 'react';
import { Table, Select, Tag, Modal, message } from 'antd';
import { fetchOrders, fetchOrderById, updateOrderStatus } from '../../services/orderService';
import './AdminProducts.css';

export default function AdminOrders() {
  const [orders, setOrders] = useState<Record<string, unknown>[]>([]);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailModal, setDetailModal] = useState<Record<string, unknown> | null>(null);

  const loadOrders = () => {
    setLoading(true);
    fetchOrders({ status: statusFilter || undefined })
      .then(setOrders)
      .catch(() => message.error('Failed to load'))
      .finally(() => setLoading(false));
  };

  useEffect(() => loadOrders(), [statusFilter]);

  const handleStatusChange = async (orderId: string, status: string) => {
    try {
      await updateOrderStatus(orderId, status);
      message.success('Status updated');
      loadOrders();
      if (detailModal && (detailModal.id as string) === orderId) {
        setDetailModal({ ...detailModal, status });
      }
    } catch {
      message.error('Failed to update');
    }
  };

  const columns = [
    { title: 'Order ID', dataIndex: 'order_number', key: 'order_number' },
    { title: 'Customer', dataIndex: 'customer_name', key: 'customer_name' },
    { title: 'Phone', dataIndex: 'phone', key: 'phone' },
    { title: 'City', dataIndex: 'city', key: 'city' },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (v: number) => `Rs. ${(v || 0).toLocaleString()}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (v: string, record: Record<string, unknown>) => (
        <Select
          value={v}
          onChange={(val) => handleStatusChange(record.id as string, val)}
          options={[
            { value: 'pending', label: 'Pending' },
            { value: 'confirmed', label: 'Confirmed' },
            { value: 'shipped', label: 'Shipped' },
            { value: 'delivered', label: 'Delivered' },
            { value: 'cancelled', label: 'Cancelled' },
          ]}
          style={{ width: 120 }}
          size="small"
        />
      ),
    },
    {
      title: 'Date',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (v: string) => (v ? new Date(v).toLocaleDateString() : '-'),
    },
    {
      title: 'Details',
      key: 'details',
      render: (_: unknown, record: Record<string, unknown>) => (
        <a onClick={() => fetchOrderById(record.id as string).then(setDetailModal)}>View</a>
      ),
    },
  ];

  return (
    <div className="pk-admin-products">
      <div className="pk-admin-page-header">
        <h1>Order Management</h1>
        <Select
          placeholder="Filter by status"
          allowClear
          style={{ width: 180 }}
          value={statusFilter}
          onChange={setStatusFilter}
        >
          <Select.Option value="pending"><Tag color="orange">pending</Tag></Select.Option>
          <Select.Option value="confirmed"><Tag color="blue">confirmed</Tag></Select.Option>
          <Select.Option value="shipped"><Tag color="cyan">shipped</Tag></Select.Option>
          <Select.Option value="delivered"><Tag color="green">delivered</Tag></Select.Option>
          <Select.Option value="cancelled"><Tag color="red">cancelled</Tag></Select.Option>
        </Select>
      </div>

      <Table
        dataSource={orders}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        loading={loading}
      />

      <Modal
        title="Order Details"
        open={!!detailModal}
        onCancel={() => setDetailModal(null)}
        footer={null}
        width={600}
      >
        {detailModal && (
          <div>
            <p><strong>Order:</strong> {detailModal.order_number as string}</p>
            <p><strong>Customer:</strong> {detailModal.customer_name as string}</p>
            <p><strong>Phone:</strong> {detailModal.phone as string}</p>
            <p><strong>Address:</strong> {detailModal.address as string}</p>
            <p><strong>Total:</strong> Rs. {(detailModal.total as number)?.toLocaleString()}</p>
            <p><strong>Status:</strong> {detailModal.status as string}</p>
            {(detailModal.items as Record<string, unknown>[] || []).map((item: Record<string, unknown>, i: number) => (
              <div key={i} style={{ marginTop: 8 }}>
                {String(item.product_name)} × {Number(item.quantity)} (Size: {String(item.size)}) - Rs. {(item.total as number)?.toLocaleString()}
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
}
