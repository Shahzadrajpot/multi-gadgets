import { useEffect, useState } from 'react';
import { Table, Button, Switch, Modal, Form, Input, Upload, message } from 'antd';
import { PlusOutlined, UploadOutlined, DeleteOutlined } from '@ant-design/icons';
import './AdminProducts.css';
import { fetchBanners, createBanner, updateBanner, deleteBanner } from '../../services/bannerService';
import { uploadBannerImage } from '../../services/storageService';

export default function AdminBanners() {
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();

  const load = () => {
    setLoading(true);
    fetchBanners().then((d: any[]) => setBanners(d)).catch(() => message.error('Failed to load')).finally(() => setLoading(false));
  };

  useEffect(() => load(), []);

  const columns = [
    { title: 'Title', dataIndex: 'title', key: 'title' },
    { title: 'Image', dataIndex: 'image_url', key: 'image', render: (u: string) => <img src={u} style={{ width: 160 }} /> },
    { title: 'Active', dataIndex: 'is_active', key: 'active', render: (v: boolean) => <Switch checked={v} /> },
    { title: 'Actions', key: 'actions', render: (_: any, row: any) => (
      <div>
        <Button onClick={() => { setEditing(row); form.setFieldsValue({ title: row.title, subtitle: row.subtitle, link: row.link }); setModalOpen(true); }}>Edit</Button>
        <Button danger icon={<DeleteOutlined />} onClick={async () => { await deleteBanner(row.id); message.success('Deleted'); load(); }} style={{ marginLeft: 8 }}>Delete</Button>
      </div>
    ) }
  ];

  const onFinish = async (vals: any) => {
    try {
      setSubmitting(true);
      let imageUrl = editing?.image_url;
      if (vals.image && vals.image.file) {
        imageUrl = await uploadBannerImage(vals.image.file);
      }
      const payload = {
        title: vals.title,
        subtitle: vals.subtitle,
        link: vals.link,
        image_url: imageUrl,
        is_active: true,
      };
      if (editing) await updateBanner(editing.id, payload);
      else await createBanner(payload);
      message.success('Banner saved');
      setModalOpen(false);
      form.resetFields();
      setEditing(null);
      load();
    } catch (err) {
      message.error(err instanceof Error ? err.message : 'Failed to save banner');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pk-admin-products">
      <div className="pk-admin-page-header">
        <h1>Banner Management</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditing(null); form.resetFields(); setModalOpen(true); }}>Add Banner</Button>
      </div>

      <Table dataSource={banners} columns={columns} rowKey="id" loading={loading} pagination={false} />

      <Modal title={editing ? 'Edit Banner' : 'Add Banner'} open={modalOpen} onCancel={() => setModalOpen(false)} footer={null}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="subtitle" label="Subtitle">
            <Input />
          </Form.Item>
          <Form.Item name="link" label="Link">
            <Input />
          </Form.Item>
          <Form.Item name="image" label="Image">
            <Upload beforeUpload={() => false} maxCount={1}>
              <Button icon={<UploadOutlined />}>Choose Image</Button>
            </Upload>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={submitting}>Save</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
