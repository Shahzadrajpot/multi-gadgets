import { useState, useEffect } from 'react';
import { Table, Button, Space, Tag, Image, Modal, Form, Input, InputNumber, Select, Switch, Upload, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { fetchAdminProducts, createProduct, updateProduct, deleteProduct } from '../../services/productService';
import { fetchCategories } from '../../services/categoryService';
import { mapProduct } from '../../utils/transform';
import type { Product } from '../../types';
import type { CategoryWithCount } from '../../services/categoryService';
import './AdminProducts.css';
import { uploadProductImage } from '../../services/storageService';

export default function AdminProducts() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [fileList, setFileList] = useState<any[]>([]);

  const loadData = () => {
    setLoading(true);
    Promise.all([fetchAdminProducts(), fetchCategories()])
      .then(([prods, cats]) => {
        setProducts(prods.map((p) => mapProduct(p as Record<string, unknown>)));
        setCategories(cats);
      })
      .catch(() => message.error('Failed to load'))
      .finally(() => setLoading(false));
  };

  useEffect(() => loadData(), []);

  const columns = [
    {
      title: 'Image',
      dataIndex: 'images',
      key: 'images',
      width: 80,
      render: (imgs: string[]) => (
        <Image width={48} height={48} src={imgs?.[0]} style={{ objectFit: 'cover', borderRadius: 8 }} />
      ),
    },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    {
      title: 'Category',
      dataIndex: 'categoryId',
      key: 'category',
      render: (id: string) => categories.find((c) => c.id === id)?.name,
    },
    {
      title: 'Base Price',
      dataIndex: 'basePrice',
      key: 'basePrice',
      render: (v: number) => `Rs. ${v?.toLocaleString()}`,
    },
    {
      title: 'Discount',
      dataIndex: 'discount',
      key: 'discount',
      render: (d: Product['discount']) =>
        d ? `${d.type === 'percentage' ? d.value + '%' : 'Rs. ' + d.value}` : '-',
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
      render: (v: number) => (v <= 5 ? <Tag color="warning">{v}</Tag> : v),
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'status',
      render: (v: boolean) => <Tag color={v ? 'green' : 'default'}>{v ? 'Active' : 'Inactive'}</Tag>,
    },
    {
      title: 'Featured',
      dataIndex: 'isFeatured',
      key: 'featured',
      render: (v: boolean) => (v ? 'Yes' : 'No'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: Product) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Button type="link" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} />
        </Space>
      ),
    },
  ];

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setExistingImages(product.images || []);
    setFileList((product.images || []).map((url, i) => ({ uid: `e-${i}`, name: `img-${i}`, status: 'done', url })));
    form.setFieldsValue({
      name: product.name,
      slug: product.slug,
      category_id: product.categoryId,
      base_price: product.basePrice,
      discount_type: product.discount?.type,
      discount_value: product.discount?.value ?? 0,
      stock: product.stock,
      sku: product.sku,
      is_featured: product.isFeatured,
      is_active: product.isActive,
      sizes: product.sizes.join(', '),
    });
    setModalOpen(true);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (!editingProduct) {
      const autoSlug = val
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      form.setFieldsValue({ slug: autoSlug });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id);
      message.success('Deleted');
      loadData();
    } catch {
      message.error('Failed to delete');
    }
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const values = await form.validateFields();
      const sizeArray = values.sizes 
        ? values.sizes.split(',').map((s: string) => s.trim()).filter((s: string) => s)
        : [];
      
      const finalSlug = (values.slug || values.name)
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') || `prod-${Date.now()}`;
      
      if (editingProduct) {
        await updateProduct(editingProduct.id, {
          category_id: values.category_id,
          name: values.name,
          slug: finalSlug,
          base_price: values.base_price,
          discount_type: values.discount_type || null,
          discount_value: values.discount_value ?? 0,
          stock: values.stock,
          sku: values.sku,
          is_featured: values.is_featured,
          is_active: values.is_active,
          sizes: sizeArray,
        });

        const uploadedUrls: string[] = [];
        for (const f of newFiles) {
          const u = await uploadProductImage(f, editingProduct.id);
          uploadedUrls.push(u);
        }
        const finalImages = [...existingImages, ...uploadedUrls].slice(0, 4);
        await updateProduct(editingProduct.id, { images: finalImages });
        message.success('Product updated successfully');
      } else {
        const created = await createProduct({
          category_id: values.category_id,
          name: values.name,
          slug: finalSlug,
          base_price: values.base_price,
          discount_type: values.discount_type,
          discount_value: values.discount_value ?? 0,
          stock: values.stock,
          sku: values.sku,
          is_featured: values.is_featured ?? false,
          is_active: values.is_active ?? true,
          sizes: sizeArray,
          images: [],
        });

        const productId = created.id;
        const uploadedUrls: string[] = [];
        for (const f of newFiles) {
          const u = await uploadProductImage(f, productId);
          uploadedUrls.push(u);
        }
        if (uploadedUrls.length) await updateProduct(productId, { images: uploadedUrls.slice(0, 4) });
        message.success('Product created successfully');
      }
      setModalOpen(false);
      setEditingProduct(null);
      form.resetFields();
      setExistingImages([]);
      setNewFiles([]);
      setFileList([]);
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
        <h1>Product Management</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingProduct(null); form.resetFields(); setModalOpen(true); }}>
          Add Product
        </Button>
      </div>

      <Table
        dataSource={products}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        loading={loading}
      />

      <Modal
        title={editingProduct ? 'Edit Product' : 'Add Product'}
        open={modalOpen}
        onCancel={() => { setModalOpen(false); setEditingProduct(null); }}
        onOk={handleSubmit}
        confirmLoading={submitting}
        width={640}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Product Name" rules={[{ required: true, message: 'Please enter product name' }]}>
            <Input onChange={handleNameChange} placeholder="e.g. Ultra Smart Watch Pro" />
          </Form.Item>
          <Form.Item
            name="slug"
            label="URL Slug (Auto-generated)"
            extra="Auto-generated from name. Leave blank or edit for custom SEO URL."
          >
            <Input placeholder="e.g. ultra-smart-watch-pro" />
          </Form.Item>
          <Form.Item name="category_id" label="Category" rules={[{ required: true }]}>
            <Select options={categories.map((c) => ({ value: c.id, label: c.name }))} />
          </Form.Item>
          <Form.Item name="base_price" label="Base Price (Rs.)" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="discount_type" label="Discount Type">
            <Select allowClear options={[{ value: 'percentage', label: 'Percentage' }, { value: 'fixed', label: 'Fixed' }]} />
          </Form.Item>
          <Form.Item name="discount_value" label="Discount Value">
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="stock" label="Stock" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="sku" label="SKU">
            <Input />
          </Form.Item>
          <Form.Item name="is_featured" label="Featured" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item name="is_active" label="Active" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item name="sizes" label="Variants / Colors / Options (comma separated)">
            <Input placeholder="e.g. Black, White, Silver, Space Gray" />
          </Form.Item>
          <Form.Item label="Images (up to 4)">
            <Upload
              listType="picture-card"
              fileList={fileList}
              multiple
              beforeUpload={(file) => {
                // Validate file size (max 5MB)
                const maxSize = 5 * 1024 * 1024;
                if (file.size > maxSize) {
                  message.error(`File ${file.name} is too large. Max size is 5MB.`);
                  return false;
                }
                
                // Validate file type
                if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
                  message.error(`${file.name} is not a valid image format. Use JPG, PNG, or WebP.`);
                  return false;
                }
                
                // Limit to 4 images
                if (fileList.length + existingImages.length >= 4) {
                  message.error('Maximum 4 images allowed');
                  return false;
                }
                
                setNewFiles((s) => [...s, file as File]);
                setFileList((l) => [...l, { uid: (file as File).name + Date.now(), name: file.name, status: 'done', originFileObj: file }]);
                return false;
              }}
              onRemove={(file) => {
                const origin = (file as any).originFileObj as File | undefined;
                if (origin) {
                  setNewFiles((s) => s.filter((f) => f !== origin));
                } else if ((file as any).url) {
                  setExistingImages((s) => s.filter((u) => u !== (file as any).url));
                }
                setFileList((l) => l.filter((i) => i.uid !== (file as any).uid));
              }}
            >
              {fileList.length + existingImages.length >= 4 ? null : <div>Upload</div>}
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
