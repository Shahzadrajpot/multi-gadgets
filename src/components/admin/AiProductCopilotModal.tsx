import { useState, useEffect } from 'react';
import { Modal, Input, Button, Tabs, Tag, Alert, message, Spin } from 'antd';
import {
  ThunderboltOutlined,
  CheckOutlined,
  LockOutlined,
  GlobalOutlined,
  FileTextOutlined,
  TagsOutlined,
  SafetyCertificateOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import {
  generateProductSeo,
  type ProductSeoSuggestion,
} from '../../services/aiService';
import './AiProductCopilotModal.css';

interface AiProductCopilotModalProps {
  open: boolean;
  onClose: () => void;
  initialProductName: string;
  categoryName?: string;
  onApply: (suggestion: ProductSeoSuggestion) => void;
}

export function AiProductCopilotModal({
  open,
  onClose,
  initialProductName,
  categoryName,
  onApply,
}: AiProductCopilotModalProps) {
  const [productName, setProductName] = useState(initialProductName);
  const [extraNotes, setExtraNotes] = useState('');
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<ProductSeoSuggestion | null>(null);

  useEffect(() => {
    if (open) {
      setProductName(initialProductName);
    }
  }, [open, initialProductName]);

  const handleGenerate = async () => {
    if (!productName.trim()) {
      message.error('Please enter a product name first');
      return;
    }

    setGenerating(true);
    try {
      const suggestion = await generateProductSeo({
        name: productName,
        categoryName,
        keyFeatures: extraNotes,
      });
      setResult(suggestion);

      if (suggestion.isFallback) {
        if (suggestion.errorReason) {
          message.warning(`Smart fallback used: ${suggestion.errorReason}`);
        } else {
          message.warning('Using smart local fallback template');
        }
      } else {
        message.success('AI SEO content generated live with Gemini 1.5 Flash!');
      }
    } catch (err) {
      message.error(err instanceof Error ? err.message : 'Failed to generate SEO content');
    } finally {
      setGenerating(false);
    }
  };

  const handleApply = () => {
    if (!result) return;
    onApply(result);
    message.success('AI suggestions applied to form!');
    onClose();
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={720}
      destroyOnClose
      centered
      title={null}
    >
      {/* Header */}
      <div className="mg-ai-modal-header">
        <div className="mg-ai-icon-badge">
          <ThunderboltOutlined />
        </div>
        <div className="mg-ai-header-text">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <h3>AI SEO Copilot</h3>
            {result && (
              result.isFallback ? (
                <Tag color="gold" icon={<WarningOutlined />}>Local Smart Fallback</Tag>
              ) : (
                <Tag color="green" icon={<SafetyCertificateOutlined />}>Live Gemini 1.5 Flash</Tag>
              )
            )}
          </div>
          <p>Generate high-converting eCommerce descriptions and Google search metadata</p>
        </div>
      </div>

      {/* Input controls */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: '#334155', display: 'block', marginBottom: 6 }}>
            Product Name / Model
          </label>
          <Input
            size="large"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="e.g. Ultra S9 Pro AMOLED Smartwatch"
          />
        </div>

        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: '#334155', display: 'block', marginBottom: 6 }}>
            Additional Highlights (Optional)
          </label>
          <Input
            value={extraNotes}
            onChange={(e) => setExtraNotes(e.target.value)}
            placeholder="e.g. 10-day battery, titanium case, IP68 water resistant"
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
          <Button
            type="primary"
            size="large"
            icon={<ThunderboltOutlined />}
            loading={generating}
            onClick={handleGenerate}
            className="mg-ai-trigger-btn"
          >
            {generating ? 'Generating with Gemini AI...' : 'Generate with AI Copilot'}
          </Button>

          <span style={{ fontSize: 12, color: '#64748b', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <LockOutlined style={{ color: '#10b981' }} /> Admin Auth & Edge Function Protected
          </span>
        </div>
      </div>

      {/* Loading State */}
      {generating && (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <Spin size="large" />
          <p style={{ marginTop: 16, color: '#64748b', fontWeight: 500 }}>
            Analyzing gadget specifications and engineering Google SEO copy...
          </p>
        </div>
      )}

      {/* Generated Results */}
      {result && !generating && (
        <div style={{ marginTop: 24 }}>
          {result.isFallback ? (
            <Alert
              type="warning"
              showIcon
              message={
                <span style={{ fontWeight: 600, color: '#b45309' }}>
                  Local Smart Fallback Template Used
                </span>
              }
              description={
                <div style={{ fontSize: 13, color: '#92400e', marginTop: 4 }}>
                  {result.errorReason && (
                    <div style={{ marginBottom: 6, padding: '4px 8px', background: '#fef3c7', borderRadius: 4, fontFamily: 'monospace', fontSize: 12 }}>
                      Server notice: {result.errorReason}
                    </div>
                  )}
                  Live Gemini AI was not reachable or is awaiting configuration. A rule-based commercial fallback was generated so your product publishing flow remains uninterrupted.
                </div>
              }
              style={{
                marginBottom: 16,
                backgroundColor: '#fffbeb',
                border: '1px solid #fde68a',
                borderRadius: 8,
              }}
            />
          ) : (
            <Alert
              type="success"
              showIcon
              message={
                <span style={{ fontWeight: 600, color: '#15803d' }}>
                  Generated Live with Google Gemini AI
                </span>
              }
              description={
                <div style={{ fontSize: 13, color: '#166534', marginTop: 4 }}>
                  Successfully synthesized by Google Gemini 1.5 Flash via protected Supabase Edge Function with CTR-optimized SERP metadata.
                </div>
              }
              style={{
                marginBottom: 16,
                backgroundColor: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: 8,
              }}
            />
          )}

          <Tabs
            defaultActiveKey="serp"
            items={[
              {
                key: 'serp',
                label: (
                  <span>
                    <GlobalOutlined /> Google SERP Preview
                  </span>
                ),
                children: (
                  <div>
                    <p style={{ fontSize: 13, color: '#64748b', marginBottom: 8 }}>
                      This is how your product will appear in Google Search Results:
                    </p>
                    <div className="mg-serp-preview">
                      <div className="mg-serp-header">
                        <img src="/Logo.webp" alt="Multi Gadgets" className="mg-serp-favicon" />
                        <div className="mg-serp-site-info">
                          <span className="mg-serp-site-name">Multi Gadgets</span>
                          <span className="mg-serp-url">https://multi-gadgets.vercel.app/product/...</span>
                        </div>
                      </div>
                      <h4 className="mg-serp-title">{result.meta_title}</h4>
                      <p className="mg-serp-desc">{result.meta_description}</p>
                    </div>

                    <div style={{ marginTop: 12, display: 'flex', gap: 12 }}>
                      <Tag color="blue">Title: {result.meta_title.length}/60 chars</Tag>
                      <Tag color="cyan">Description: {result.meta_description.length}/155 chars</Tag>
                    </div>
                  </div>
                ),
              },
              {
                key: 'desc',
                label: (
                  <span>
                    <FileTextOutlined /> Product Description
                  </span>
                ),
                children: (
                  <div
                    style={{
                      background: '#f8fafc',
                      padding: 16,
                      borderRadius: 8,
                      border: '1px solid #e2e8f0',
                      whiteSpace: 'pre-line',
                      fontSize: 14,
                      lineHeight: 1.6,
                      maxHeight: 220,
                      overflowY: 'auto',
                    }}
                  >
                    {result.description}
                  </div>
                ),
              },
              {
                key: 'features',
                label: (
                  <span>
                    <TagsOutlined /> Features & Variants
                  </span>
                ),
                children: (
                  <div>
                    <h5 style={{ margin: '8px 0', fontSize: 13, fontWeight: 600 }}>Technical Feature Bullets:</h5>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
                      {(result.features || []).map((f, i) => (
                        <span key={i} className="mg-feature-tag">
                          ✓ {f}
                        </span>
                      ))}
                    </div>

                    <h5 style={{ margin: '8px 0', fontSize: 13, fontWeight: 600 }}>Suggested Color Variants:</h5>
                    <Tag color="purple" style={{ fontSize: 13, padding: '4px 8px' }}>
                      {result.suggested_variants}
                    </Tag>
                  </div>
                ),
              },
            ]}
          />

          {/* Action Bar */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
            <Button onClick={onClose}>Discard</Button>
            <Button
              type="primary"
              icon={<CheckOutlined />}
              size="large"
              onClick={handleApply}
              style={{ background: '#0284c7', borderColor: '#0284c7' }}
            >
              Apply to Product Form
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}

export default AiProductCopilotModal;
