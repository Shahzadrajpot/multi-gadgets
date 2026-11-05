import { Form, Input, InputNumber, Switch, Button, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import './AdminProducts.css';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { fetchStoreSettings, updateStoreSettings } from '../../services/storeService';

export default function AdminSettings() {
  const [form] = Form.useForm();
  const [settingsId, setSettingsId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchStoreSettings().then((s: any) => {
      setSettingsId(s.id || null);
      form.setFieldsValue({
        storeName: s.store_name,
        whatsapp: s.whatsapp_number,
        deliveryCharges: s.delivery_charges,
        currency: s.currency,
        codEnabled: s.cod_enabled,
        metaTitle: s.default_meta_title,
        metaDescription: s.default_meta_description,
      });
    }).catch(() => message.error('Failed to load settings'));
  }, []);

  const onFinish = async (values: any) => {
    try {
      setSubmitting(true);
      const payload = {
        store_name: values.storeName,
        whatsapp_number: values.whatsapp,
        delivery_charges: values.deliveryCharges,
        cod_enabled: values.codEnabled,
        default_meta_title: values.metaTitle,
        default_meta_description: values.metaDescription,
      };
      
      if (settingsId) {
        await updateStoreSettings(settingsId, payload);
      } else {
        // Create new settings record if it doesn't exist
        const { data, error } = await supabase
          .from('store_settings')
          .insert({ ...payload, currency: 'PKR' })
          .select()
          .single();
        if (error) throw error;
        setSettingsId(data.id);
      }
      message.success('Settings saved successfully');
    } catch (err) {
      message.error(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pk-admin-products">
      <h1>Store Settings</h1>
      <Form form={form} layout="vertical" style={{ maxWidth: 600 }} onFinish={onFinish}>
        <Form.Item name="storeName" label="Store Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="whatsapp" label="WhatsApp Number" rules={[{ required: true }]}>
          <Input placeholder="923001234567" />
        </Form.Item>
        <Form.Item name="deliveryCharges" label="Delivery Charges (Rs.)" rules={[{ required: true }]}>
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="currency" label="Currency">
          <Input disabled />
        </Form.Item>
        <Form.Item name="codEnabled" label="Cash on Delivery" valuePropName="checked">
          <Switch />
        </Form.Item>
        <Form.Item name="logo" label="Logo">
          <Upload>
            <Button icon={<UploadOutlined />}>Upload Logo</Button>
          </Upload>
        </Form.Item>
        <Form.Item name="metaTitle" label="Default SEO Title">
          <Input />
        </Form.Item>
        <Form.Item name="metaDescription" label="Default SEO Description">
          <Input.TextArea rows={3} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={submitting}>
            Save Settings
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
