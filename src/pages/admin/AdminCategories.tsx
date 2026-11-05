import { useState, useEffect } from 'react';
import { Table, Button, Space, Tag, Modal, Form, Input, Switch, Upload, Image, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { fetchCategories, createCategory, updateCategory, deleteCategory } from '../../services/categoryService';
import { uploadCategoryImage } from '../../services/storageService';
import type { CategoryWithCount } from '../../services/categoryService';
import './AdminProducts.css';

export default function AdminCategories() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [categories, setCategories] = useState<CategoryWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const loadData = () => {
    setLoading(true);
    fetchCategories()
      .then(setCategories)
      .catch(() => message.error('Failed to load'))
      .finally(() => setLoading(false));
  };

  useEffect(() => loadData(), []);

  const columns = [
    { title: 'Image', dataIndex: 'image_url', key: 'image_url', width: 80, render: (img: string) => img ? <Image width={48} height={48} src={img} style={{ objectFit: 'cover', borderRadius: 8 }} /> : '-' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Slug', dataIndex: 'slug', key: 'slug' },
    {
      title: 'Products',
      dataIndex: 'product_count',
      key: 'product_count',
    },
    {
      title: 'Status',
      dataIndex: 'is_active',
      key: 'status',
      render: (v: boolean) => <Tag color={v ? 'green' : 'default'}>{v ? 'Active' : 'Inactive'}</Tag>,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: CategoryWithCount) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} onClick={() => { setEditingId(record.id); setImageUrl(record.image_url); form.setFieldsValue(record); setModalOpen(true); }} />
          <Button type="link" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} />
        </Space>
      ),
    },
  ];

  const handleDelete = async (id: string) => {
    Modal.confirm({
      title: 'Delete Category',
      content: 'Are you sure you want to delete this category?',
      okText: 'Delete',
      okType: 'danger',
      onOk: async () => {
        try {
          await deleteCategory(id);
          message.success('Category deleted');
          loadData();
        } catch (err) {
          if (err instanceof Error) message.error(err.message);
        }
      },
    });
  };

  const handleImageUpload = async (file: File) => {
    try {
      setUploading(true);
      // For new categories, use a temporary ID (it will be replaced after creation)
      const tempId = editingId || 'temp-' + Date.now();
      const url = await uploadCategoryImage(file, tempId);
      setImageUrl(url);
      message.success('Image uploaded');
    } catch (err) {
      if (err instanceof Error) message.error(err.message);
    } finally {
      setUploading(false);
    }
    return false; // Prevent default upload
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (!editingId) {
      const autoSlug = val
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      form.setFieldsValue({ slug: autoSlug });
    }
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const values = await form.validateFields();
      
      const finalSlug = (values.slug || values.name)
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') || `cat-${Date.now()}`;
      values.slug = finalSlug;

      // If there's an image, add it to values
      if (imageUrl) {
        values.image_url = imageUrl;
      }

      if (editingId) {
        await updateCategory(editingId, values);
        message.success('Category updated');
      } else {
        await createCategory(values);
        message.success('Category created');
      }
      setModalOpen(false);
      setEditingId(null);
      setImageUrl(null);
      form.resetFields();
      loadData();
    } catch (err) {
      if (err instanceof Error) message.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pk-admin-products">
      <div className="pk-admin-page-header">
        <h1>Category Management</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingId(null); setImageUrl(null); form.resetFields(); setModalOpen(true); }}>
          Add Category
        </Button>
      </div>

      <Table dataSource={categories} columns={columns} rowKey="id" pagination={false} loading={loading} />

      <Modal
        title={editingId ? 'Edit Category' : 'Add Category'}
        open={modalOpen}
        onCancel={() => { setModalOpen(false); setEditingId(null); setImageUrl(null); }}
        onOk={handleSubmit}
        confirmLoading={submitting}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Category Name" rules={[{ required: true, message: 'Please enter category name' }]}>
            <Input onChange={handleNameChange} placeholder="e.g. Smart Watches" />
          </Form.Item>
          <Form.Item
            name="slug"
            label="URL Slug (Auto-generated)"
            extra="Auto-generated from name. Leave blank or edit for custom SEO URL."
          >
            <Input placeholder="e.g. smart-watches" />
          </Form.Item>
          <Form.Item label="Category Photo">
            {imageUrl && (
              <div style={{ marginBottom: 12 }}>
                <Image width={100} height={100} src={imageUrl} style={{ objectFit: 'cover', borderRadius: 8 }} />
              </div>
            )}
            <Upload
              maxCount={1}
              beforeUpload={handleImageUpload}
              accept="image/*"
              disabled={uploading}
            >
              <Button loading={uploading}>Upload Photo</Button>
            </Upload>
          </Form.Item>
          <Form.Item name="is_active" label="Active" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
