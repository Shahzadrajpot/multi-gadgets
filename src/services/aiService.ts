/**
 * MultiGadgets - AI SEO Copilot Service
 * Securely calls Supabase Edge Function "generate-seo"
 * Zero API keys are stored in the client browser.
 */

import { supabase } from '../lib/supabase';

export interface ProductSeoInput {
  name: string;
  categoryName?: string;
  keyFeatures?: string;
}

export interface ProductSeoSuggestion {
  optimized_title: string;
  description: string;
  meta_title: string;
  meta_description: string;
  features: string[];
  suggested_variants: string;
  isFallback: boolean;
  source?: 'gemini_1.5_flash' | 'local_fallback';
  errorReason?: string;
}

/**
 * Generates high-converting product description and SEO metadata
 * via the secure Supabase Edge Function (GEMINI_API_KEY is stored in Supabase Edge Secrets).
 */
export async function generateProductSeo(input: ProductSeoInput): Promise<ProductSeoSuggestion> {
  try {
    const { data, error } = await supabase.functions.invoke('generate-seo', {
      body: input,
    });

    if (error) {
      let errorMsg = error.message;
      // Extract detailed server error message if available in error context
      try {
        if ('context' in error && error.context && typeof (error.context as Response).json === 'function') {
          const body = await (error.context as Response).json();
          if (body?.error) errorMsg = body.error;
        }
      } catch {
        // Fall back to original error.message if context is unreadable
      }
      console.warn('Supabase Edge Function returned an error, using intelligent fallback:', errorMsg);
      return generateFallbackSeo(input, errorMsg);
    }

    // Defensive schema validation of server payload
    if (
      !data ||
      typeof data !== 'object' ||
      typeof data.optimized_title !== 'string' ||
      typeof data.description !== 'string' ||
      typeof data.meta_title !== 'string' ||
      typeof data.meta_description !== 'string' ||
      !Array.isArray(data.features)
    ) {
      const parseError = 'Received malformed or incomplete payload from AI server';
      console.warn(parseError, data);
      return generateFallbackSeo(input, parseError);
    }

    return {
      optimized_title: data.optimized_title,
      description: data.description,
      meta_title: data.meta_title,
      meta_description: data.meta_description,
      features: data.features.filter((f: unknown) => typeof f === 'string'),
      suggested_variants: typeof data.suggested_variants === 'string' ? data.suggested_variants : 'Black, Silver, Space Gray',
      isFallback: false,
      source: 'gemini_1.5_flash',
    };
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Network call to Edge Function failed';
    console.warn('Network call to Edge Function failed, using intelligent fallback:', msg);
    return generateFallbackSeo(input, msg);
  }
}

/**
 * Intelligent local rule-based SEO generator fallback
 * Used when offline or before the Supabase Edge Function secret is configured.
 */
export function generateFallbackSeo(input: ProductSeoInput, errorReason?: string): ProductSeoSuggestion {
  const name = input.name.trim() || 'Smart Gadget';
  const category = input.categoryName || 'Smart Gadgets';

  return {
    optimized_title: name,
    description: `Experience the next generation of everyday technology with the ${name} in our ${category} lineup. Engineered for premium performance and durability, this device seamlessly integrates with your digital routine.\n\nKey Highlights:\n• High-precision build quality and ergonomic design\n• Extended battery performance for all-day reliability\n• Ultra-responsive connectivity with universal device compatibility\n• 100% Genuine product backed by official 7-day checking warranty`,
    meta_title: `${name} | Multi Gadgets`.slice(0, 60),
    meta_description: `Buy ${name} at Multi Gadgets Pakistan. Enjoy best price, official warranty, and fast Cash on Delivery nationwide.`.slice(0, 155),
    features: [
      'High-grade premium build quality',
      'Long-lasting battery endurance',
      'Ultra-fast seamless connectivity',
      'Official 7-day checking warranty',
    ],
    suggested_variants: 'Black, Silver, Space Gray',
    isFallback: true,
    source: 'local_fallback',
    errorReason,
  };
}
