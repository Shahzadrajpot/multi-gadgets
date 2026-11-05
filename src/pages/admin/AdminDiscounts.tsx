import { useEffect, useState } from 'react';
import { Table, Button, Card, Switch, Modal, Form, Select, InputNumber, DatePicker, message, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import './AdminProducts.css';
import { fetchAllGlobalDiscounts, createGlobalDiscount, updateGlobalDiscount, deleteGlobalDiscount } from '../../services/discountService';

export default function AdminDiscounts() {
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [discounts, setDiscounts] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);
  const [form] = Form.useForm();

  const load = () => {
    setLoading(true);
    fetchAllGlobalDiscounts().then((d: any[]) => setDiscounts(d)).catch(() => message.error('Failed to load')).finally(() => setLoading(false));
  };

  useEffect(() => load(), []);

  const columns = [
    {
      title: 'Type',
      dataIndex: 'discount_type',
      key: 'type',
      render: (t: string, r: any) => (t === 'percentage' ? `${r.discount_value}% off` : `Rs. ${r.discount_value} off`),
    },
    {
      title: 'Applies To',
      dataIndex: 'apply_to',
      key: 'applyTo',
      render: (v: string) => (v === 'all' ? 'All Products' : 'Selected Categories'),
    },
    { title: 'Start', dataIndex: 'start_date', key: 'startDate' },
    { title: 'End', dataIndex: 'end_date', key: 'endDate' },
    {
      title: 'Status',
      dataIndex: 'is_active',
      key: 'is_active',
      render: (v: boolean, r: any) => (
        <Switch checked={v} size="small" onChange={async (checked) => {
          try { await updateGlobalDiscount(r.id, { is_active: checked }); message.success('Updated'); load(); } catch { message.error('Failed'); }
        }} />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, row: any) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => { setEditing(row); form.setFieldsValue({ type: row.discount_type, value: row.discount_value, applyTo: row.apply_to, range: [row.start_date && row.start_date ? null : null] }); setModalOpen(true); }} />
          <Button danger icon={<DeleteOutlined />} onClick={async () => { await deleteGlobalDiscount(row.id); message.success('Deleted'); load(); }} />
        </Space>
      )
    }
  ];

  const onFinish = async (vals: any) => {
    try {
      setSubmitting(true);
      // Validate date range
      if (!vals.range || vals.range.length < 2) {
        return message.error('Please select both start and end dates');
      }
      
      const [startDate, endDate] = vals.range;
      if (startDate.isAfter(endDate)) {
        return message.error('End date must be after start date');
      }
      
      if (endDate.isBefore(startDate)) {
        return message.error('Start date must be before end date');
      }
      
      const payload: any = {
        is_active: true,
        discount_type: vals.type,
        discount_value: vals.value,
        apply_to: vals.applyTo,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
      };
      
      if (editing) {
        await updateGlobalDiscount(editing.id, payload);
        message.success('Discount updated');
      } else {
        await createGlobalDiscount(payload);
        message.success('Discount created');
      }
      setModalOpen(false);
      setEditing(null);
      form.resetFields();
      load();
    } catch (err) {
      message.error(err instanceof Error ? err.message : 'Failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pk-admin-products">
      <div className="pk-admin-page-header">
        <h1>Discount Management</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditing(null); form.resetFields(); setModalOpen(true); }}>
          Add Global Discount
        </Button>
      </div>

      <Card title="Discount Priority">
        <p>Product discount takes priority over global discount. No double stacking.</p>
      </Card>

      <Table dataSource={discounts} columns={columns} rowKey="id" style={{ marginTop: 24 }} loading={loading} pagination={false} />

      <Modal title={editing ? 'Edit Global Discount' : 'Add Global Discount'} open={modalOpen} onCancel={() => setModalOpen(false)} footer={null}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="type" label="Type" rules={[{ required: true }]}>
            <Select options={[{ value: 'percentage', label: 'Percentage' }, { value: 'fixed', label: 'Fixed' }]} />
          </Form.Item>
          <Form.Item name="value" label="Value" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="applyTo" label="Apply To" initialValue="all">
            <Select options={[{ value: 'all', label: 'All Products' }, { value: 'categories', label: 'Categories' }]} />
          </Form.Item>
          <Form.Item name="range" label="Active Range" rules={[{ required: true }]}>
            <DatePicker.RangePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={submitting}>Save</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
